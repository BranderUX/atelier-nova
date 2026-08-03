# Atelier Nova — a storefront generated live by BranderUX

**Live demo:** https://nova.branderux.app · **How it works:** https://nova.branderux.app/about

Atelier Nova is a complete example of a **full agentic application** built on
[BranderUX](https://branderux.com): a womenswear storefront where the entire
site is a single full-screen `<Brander />` surface. There are no pages, no
routes, no components for the store itself — every screen (the personalized
home, store sections, care answers, the interactive fitting room, the order
flow, trip capsules) is **generated at runtime** from the agent's responses.

## How it works

```
Browser
  └─ <Brander variant="chat" isFullscreen />         app/page.tsx
       └─ BranderUX embed (iframe)                   runtime UI generation (A2UI)
            └─ onQueryStream → sseStream("/api/agent/stream")
                 └─ Claude + the demo world          app/api/agent/stream/route.ts
```

The agent is a plain Anthropic streaming call. Its system prompt
(`lib/agent/system-prompt.ts`) carries the whole demo world:

- **The shopper** — Maya, size M, two delivery addresses, a real style profile.
- **Her purchase history** — dates computed relative to now, so "ordered last
  week" never goes stale.
- **The catalog** — 22 products with prices, fabrics, care instructions, fit
  notes and image URLs.
- **Pre-rendered try-on assets** — the fitting room swaps her full-body image
  from a 9-combination map, instantly, with no AI call.

BranderUX contributes the other half via `params.system`: the A2UI protocol and
the element catalog (nine custom "Nova" elements — hero, product grid, stylist
note, order panel, order confirmation, look board, editorial looks, fitting
room, suggestions — seeded by `scripts/seed-brander-project.mts`).

Two patterns worth stealing:

- **Deterministic intents skip the LLM.** The home query is answered with a
  pre-built A2UI block (`lib/agent/home-screen.ts`) — instant first paint, zero
  tokens. Same protocol, no model.
- **Elements can be full interactive apps.** The fitting room does drag-to-dress
  with instant image swaps entirely inside the element; only "Order this look"
  goes back through the agent.

## Running locally

```bash
cp .env.example .env.local   # fill in keys
npm install
npm run dev                  # http://localhost:3001
```

Requires a BranderUX environment with the Atelier Nova project seeded:

```bash
BRANDER_REFRESH_TOKEN=… BRANDER_API_BASE=… npm run seed
```

The seed is idempotent: it provisions the project (brand, settings, custom
pages), publishes the nine elements from `brander/elements/`, and pins the
screens — re-runs only touch what changed.

> Local note: the published `@brander/sdk` targets the BranderUX production
> origin. To point the embed at a local BranderUX instance, link a local SDK
> build (`npm i <path-to-brander-sdk> --no-save`).

## Deploying

Any Next.js host works (the demo runs on Vercel):

1. Set the env vars from `.env.example` — `ANTHROPIC_API_KEY`, the BranderUX
   token + project id, `SITE_URL`/`NEXT_PUBLIC_SITE_URL`, and (recommended)
   the Upstash pair for rate limiting.
2. `npm run build` / deploy.

The agent endpoint is guarded for public traffic: per-IP sliding window +
a global daily budget (`AGENT_DAILY_LIMIT`), with graceful in-character
fallbacks. The canned home never counts against either.

## The five demo moments

1. Load the site → a personalized "Welcome back, Maya" home, served instantly.
2. Right-click the wrap dress → "Will this shrink in the wash?" → a care card
   with the product's order panel on the same screen.
3. Hover the Recommended ribbon → the reason, grounded in her purchase history.
4. Click a product → order panel, size M preselected, complete-the-look modal →
   "Order placed."
5. "I'm flying to Lisbon for four days" → a packing capsule around what she
   owns. Then: "show me how it looks on me" → the fitting room.

---

Generated with [BranderUX](https://branderux.com) — AI-UX infrastructure that
turns your agent into full agentic applications, websites and MCP apps.
