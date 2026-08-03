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
  const stream = anthropic.messages.stream({
    model: process.env.AGENT_MODEL || DEFAULT_MODEL,
    max_tokens: params.max_tokens ?? 6000,
    system,
    messages: params.messages,
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
        for await (const event of anthropicStream(
          stream as AsyncIterable<MessageStreamEvent> as Parameters<typeof anthropicStream>[0]
        )) {
          send(JSON.stringify(event));
        }
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
