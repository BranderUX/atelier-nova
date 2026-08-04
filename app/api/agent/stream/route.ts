import Anthropic from "@anthropic-ai/sdk";
import type { MessageStreamEvent } from "@anthropic-ai/sdk/resources/messages";
import { AGUIEventType, anthropicStream, type CustomerAIParams } from "@brander/sdk";
import { buildHomeResponseText, homeFollowUpText, isHomeQuery } from "@/lib/agent/home-screen";
import { checkRateLimit } from "@/lib/agent/rate-limit";
import { buildWorldPrompt } from "@/lib/agent/system-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const DEFAULT_MODEL = "claude-sonnet-5";
const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
} as const;

/**
 * Stream a pre-built response as AG-UI SSE events — same wire shape as the LLM
 * path. An optional followUp arrives after a delay, AFTER the screen — the
 * client routes post-block text to the closing note under the screen.
 */
function cannedResponse(text: string, followUp?: { text: string; delayMs: number }): Response {
  const ts = Date.now();
  const messageId = `msg-${ts}`;
  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      send({ type: AGUIEventType.RUN_STARTED, runId: `run-${ts}`, threadId: `thread-${ts}`, timestamp: ts });
      send({ type: AGUIEventType.TEXT_MESSAGE_START, messageId, role: "assistant", timestamp: ts });
      send({ type: AGUIEventType.TEXT_MESSAGE_CONTENT, messageId, delta: text, timestamp: ts });
      if (followUp) {
        await new Promise((resolve) => setTimeout(resolve, followUp.delayMs));
        send({
          type: AGUIEventType.TEXT_MESSAGE_CONTENT,
          messageId,
          delta: `\n${followUp.text}`,
          timestamp: Date.now(),
        });
      }
      send({ type: AGUIEventType.TEXT_MESSAGE_END, messageId, timestamp: Date.now() });
      send({ type: AGUIEventType.RUN_FINISHED, runId: `run-${ts}`, timestamp: Date.now() });
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(readable, { headers: SSE_HEADERS });
}

/**
 * The Atelier Nova demo agent. Receives CustomerAIParams from the Brander SDK
 * (sseStream adapter), prepends the demo-world prompt to the BranderUX system
 * segment, streams Claude, and re-emits AG-UI events as SSE.
 */
export async function POST(req: Request): Promise<Response> {
  const { params } = (await req.json()) as { params: CustomerAIParams };
  const siteOrigin = process.env.SITE_URL || new URL(req.url).origin;

  // The home query is deterministic — answer it directly with the pre-built
  // screen (no LLM call, never rate-limited): instant first paint, zero tokens.
  const lastUserMessage = [...params.messages].reverse().find((m) => m.role === "user");
  if (lastUserMessage && isHomeQuery(lastUserMessage.content)) {
    return cannedResponse(buildHomeResponseText(siteOrigin), {
      text: homeFollowUpText(),
      delayMs: 2000,
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const verdict = await checkRateLimit(ip);
  if (!verdict.allowed) {
    return cannedResponse(
      verdict.reason === "daily"
        ? "The atelier is resting for today — come back tomorrow, everything will be freshly generated."
        : "One moment — the atelier is with another client. Try again in a minute."
    );
  }

  const system = [buildWorldPrompt(siteOrigin), params.system]
    .filter(Boolean)
    .join("\n\n---\n\n");

  const anthropic = new Anthropic();
  const request = (messages: CustomerAIParams["messages"]) =>
    anthropic.messages.stream({
      model: process.env.AGENT_MODEL || DEFAULT_MODEL,
      max_tokens: params.max_tokens ?? 6000,
      system,
      messages,
      ...(params.tools?.anthropic?.length
        ? {
            tools: params.tools.anthropic as Anthropic.Tool[],
            ...(params.tool_choice ? { tool_choice: params.tool_choice } : {}),
          }
        : {}),
    });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: string) =>
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      try {
        await streamWithBlockGuard(request, params.messages, (event) =>
          send(JSON.stringify(event))
        );
      } catch (error) {
        send(
          JSON.stringify({
            type: AGUIEventType.RUN_ERROR,
            message: error instanceof Error ? error.message : "Agent stream failed",
            timestamp: Date.now(),
          })
        );
      } finally {
        send("[DONE]");
        controller.close();
      }
    },
  });

  return new Response(readable, { headers: SSE_HEADERS });
}

const RETRY_INSTRUCTION =
  "(system note) Your previous reply contained no UI block, so NO screen was rendered — the " +
  "shopper saw nothing. Answer the request above again as a COMPLETE UI screen in the block " +
  "format from the UI-generation instructions. Do not apologize or mention this note.";

/**
 * Stream the model while guarding the UI contract: events are buffered until the
 * A2UI block marker appears in the text, then flushed and passed through live.
 * A reply that finishes with NO block is discarded and silently retried once
 * with a corrective instruction — the client only ever sees one clean run.
 * If the retry also produces no block, its text is flushed so the shopper at
 * least gets the sentence.
 */
async function streamWithBlockGuard(
  request: (messages: CustomerAIParams["messages"]) => ReturnType<Anthropic["messages"]["stream"]>,
  baseMessages: CustomerAIParams["messages"],
  send: (event: unknown) => void
): Promise<void> {
  let previousText = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    const messages =
      attempt === 0
        ? baseMessages
        : [
            ...baseMessages,
            { role: "assistant" as const, content: previousText.trim() || "(empty reply)" },
            { role: "user" as const, content: RETRY_INSTRUCTION },
          ];
    const stream = request(messages);
    const buffered: unknown[] = [];
    let flushed = false;
    let text = "";
    for await (const event of anthropicStream(
      stream as AsyncIterable<MessageStreamEvent> as Parameters<typeof anthropicStream>[0]
    )) {
      if (flushed) {
        send(event);
        continue;
      }
      buffered.push(event);
      if (event.type === AGUIEventType.TEXT_MESSAGE_CONTENT) {
        text += (event as { delta?: string }).delta ?? "";
        if (text.includes("---A2UI_START---")) {
          for (const held of buffered) send(held);
          buffered.length = 0;
          flushed = true;
        }
      }
    }
    if (flushed) return;
    // No block in this attempt: drop its events and retry (or flush on final failure).
    if (attempt === 1) {
      for (const held of buffered) send(held);
      return;
    }
    previousText = text;
  }
}
