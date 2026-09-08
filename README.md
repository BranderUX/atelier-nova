# Atelier Nova, a storefront generated live by BranderUX

**Live:** https://nova.branderux.app · **How it works:** https://nova.branderux.app/about

Atelier Nova is a womenswear store with no pages. Every screen, the home, the
store sections, care answers, the fitting room, the order flow, the trip
capsules, is generated live: built at the moment of the question, in the brand,
with the right UX for that question. The whole application is built and hosted
on [BranderUX](https://branderux.com). This repo is the shell around it, and the
store surface is one component.

## How it works

```
Browser
  └─ app/page.tsx
       └─ <Brander apiKey projectId variant="chat" isFullscreen />
            └─ the project's hosted agent answers, in branded screens
```

Describe your business in the BranderUX builder, publish, and the same agent
that runs your published site answers inside your app. No backend, no handler,
no model keys.

That is literally the case here: no agent route, no model key, no prompt in this
repo. The store's knowledge and behavior live in the BranderUX project:

- **The catalog**, 22 products with prices, fabrics, care instructions, fit
  notes and image URLs, stored as records the agent queries per question.
- **Orders**, a real entity. Placing an order writes a record and returns its
  number, and "Track my order" reads it back.
- **The shopper**, Maya, size M, two delivery addresses, a style profile and a
  purchase history whose dates are computed at seed time, so "ordered last
  week" is arithmetic the agent does against the clock.
- **The voice and the rules**, the store's persona and one composition rule per
  demo moment.
- **The home**, designed once in the builder and replayed on every landing:
  instant, identical every time, no model call.
- **Nine custom elements**, hero, product grid, stylist note, order panel, order
  confirmation, look board, editorial looks, fitting room, suggestions,
  authored in `brander/elements/`.

Everything above lives in `brander/` and is provisioned by the seed scripts.

Two patterns worth stealing:

- **The designed home is not a screenshot.** Its layout is a screen, its copy
  and picks are data, and the platform replays it on every landing without a
  model call. First paint is instant and never varies.
- **Elements can be full interactive apps.** The fitting room does
  drag-to-dress with instant image swaps entirely inside the element. Only
  "Order this look" becomes a question for the agent.

## Running locally

```bash
cp .env.example .env.local   # a project id and one publishable key
npm install
npm run dev                  # http://localhost:3001
npm run type-check:scripts   # the seed scripts and brander/data, which tsc skips
```

Two values are enough, because the agent is not in this repo:
`NEXT_PUBLIC_BRANDER_PROJECT_ID` and `NEXT_PUBLIC_BRANDER_API_KEY`
(`bux_pk_…`). Add `http://localhost:3001` to that key's allowed origins under
Projects, API Keys, or the key is refused.

To provision the BranderUX project from scratch (brand, settings, custom pages,
the nine elements and the screens, then the catalog and the shopper's orders,
the persona and policies, and the designed home):

```bash
BRANDER_REFRESH_TOKEN=… BRANDER_API_BASE=… SITE_URL=https://nova.branderux.app npm run seed
```

The seed is idempotent: re-runs update in place (settings merge over what the
project holds), append element versions only when the code changed, and insert
records only into an empty entity. `SITE_URL` is the origin serving
`public/products/`, so the seeded records carry image URLs a browser can reach.
Before a demo, `npm run seed:agent -- --refresh-orders` re-dates the three past
orders relative to today.

## Deploying

Any Next.js host works (this demo runs on Vercel):

1. Set `NEXT_PUBLIC_BRANDER_PROJECT_ID`, `NEXT_PUBLIC_BRANDER_API_KEY` and
   `NEXT_PUBLIC_SITE_URL`.
2. Add the deployed origin to the key's allowed origins.
3. `npm run build`, then deploy.

Nothing else: no model key, no rate limiter, no queue. Traffic protection is
part of the project, per-visitor caps and the owner's budget, set in the
BranderUX dashboard rather than in this code.

## The five demo moments

1. Load the site: the designed home appears at once, this week's picks chosen
   around Maya's wardrobe, with no model call.
2. Right-click the wrap dress and ask "Will this shrink in the wash?": a care
   card and that product's order panel, on the same screen.
3. Hover the Recommended ribbon: the reason, grounded in what Maya already owns.
4. Click a product: an order panel with size M preselected, and a complete-the-
   look modal. "Place order" is a click the visitor makes, and it writes a real
   order with its own number. "Track my order" reads that order back.
5. Ask "I'm flying to Lisbon for four days": a packing capsule built around
   pieces Maya already owns. Then "let me play with combinations": the fitting
   room.

And the sixth, on the other side of the glass: every one of those conversations
and every order placed is visible to the owner in the BranderUX dashboard.

## Using your own agent instead

Atelier Nova runs on the agent BranderUX hosts for it. A business that already
has an agent connects it instead, with one prop, and BranderUX never sees its
data. See the [@brander/sdk README](https://www.npmjs.com/package/@brander/sdk).

---

Built on [BranderUX](https://branderux.com). Build agentic applications, in
minutes.
