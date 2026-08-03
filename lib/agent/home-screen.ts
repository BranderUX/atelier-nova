/**
 * The canned home screen. The home query is deterministic ("Show home page"),
 * and its structure is known — so the agent route answers it DIRECTLY with a
 * pre-built A2UI block, no LLM call: instant first paint, zero tokens.
 * Mirrors the two-phase A2UI wire format the model is taught (createSurface →
 * updateComponents with path bindings → one updateDataModel per component).
 */

import { getProduct } from "./catalog";
import { SHOPPER } from "./world";

const A2UI_START = "---A2UI_START---";
const A2UI_END = "---A2UI_END---";

const HOME_PICK_IDS = [
  "linen-wrap-dress",
  "terracotta-jacket",
  "sage-poplin-midi",
  "silk-slip-dress",
  "cotton-sundress",
  "knit-cardigan",
];

function bind(elementId: string, props: string[]): Record<string, { path: string }> {
  return Object.fromEntries(props.map((p) => [p, { path: `/${elementId}/${p}` }]));
}

export function isHomeQuery(rawQuery: string): boolean {
  return rawQuery.trim().toLowerCase().includes("show home page");
}

export function buildHomeResponseText(siteOrigin: string): string {
  const picks = HOME_PICK_IDS.map((id) => getProduct(id)).filter(
    (p): p is NonNullable<ReturnType<typeof getProduct>> => Boolean(p)
  );

  const components = [
    { id: "root", component: "Column", children: ["home-row", "home-looks", "home-suggestions"], spacing: 3 },
    { id: "home-row", component: "Row", children: ["home-hero", "home-picks"], spacing: 2 },
    {
      id: "home-hero",
      component: "custom:nova-hero",
      weight: 1,
      ...bind("home-hero", ["greeting", "subtitle", "campaignTitle", "campaignBody", "ctaLabel", "imageUrl"]),
    },
    {
      id: "home-picks",
      component: "custom:nova-product-grid",
      weight: 1,
      columns: 3,
      ...bind("home-picks", ["products"]),
    },
    {
      id: "home-looks",
      component: "custom:nova-look-editorial",
      ...bind("home-looks", ["headline", "subtitle", "provenance", "looks"]),
    },
    {
      id: "home-suggestions",
      component: "custom:nova-suggestions",
      ...bind("home-suggestions", ["suggestions"]),
    },
  ];

  const dataModels = [
    {
      updateDataModel: {
        surfaceId: "main",
        path: "/home-hero",
        value: {
          greeting: `Welcome back, ${SHOPPER.name}`,
          subtitle: "Picked for you from this week's arrivals.",
          campaignTitle: "The\nSummer\nEdit",
          campaignBody: "Effortless pieces for warm days and balmy nights.",
          ctaLabel: "Shop now",
          imageUrl: `${siteOrigin}/products/hero-summer-edit.jpg`,
        },
      },
    },
    {
      updateDataModel: {
        surfaceId: "main",
        path: "/home-picks",
        value: {
          products: picks.map((p, index) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            ...(p.salePrice ? { salePrice: p.salePrice } : {}),
            imageUrl: `${siteOrigin}${p.imagePath}`,
            ...(p.id === "terracotta-jacket"
              ? {
                  badge: "Recommended",
                  badgeReason: "Pairs with the linen pants you bought last week",
                  // The pre-rendered try-on shot of THIS combination: the jacket
                  // worn over her linen pants + camisole (fitting-room map).
                  badgeImageUrl: `${siteOrigin}/products/fitting/fit-pants-cami--terracotta-jacket.jpg`,
                  sizeChip: `Size ${SHOPPER.size}`,
                }
              : {}),
          })),
        },
      },
    },
    {
      updateDataModel: {
        surfaceId: "main",
        path: "/home-looks",
        value: {
          headline: "Worn by you",
          subtitle: "Looks styled on you, from pieces you own and this week's picks.",
          provenance: "From your Fit Profile",
          looks: [
            {
              id: "look-weekend-layers",
              title: "Weekend layers",
              caption: "Your linen pants + camisole, with the Terracotta Jacket",
              imageUrl: `${siteOrigin}/products/fitting/fit-pants-cami--terracotta-jacket.jpg`,
              priceLabel: "Add the jacket — $164",
            },
            {
              id: "look-golden-hour",
              title: "Golden hour",
              caption: "The Silk Slip Dress under your Knit Cardigan",
              imageUrl: `${siteOrigin}/products/fitting/fit-slip-dress--knit-cardigan.jpg`,
              priceLabel: "Add the dress — $142",
            },
            {
              id: "look-desk-dinner",
              title: "Desk to dinner",
              caption: "The Linen Wrap Dress with the Terracotta Jacket",
              imageUrl: `${siteOrigin}/products/fitting/fit-wrap-dress--terracotta-jacket.jpg`,
              priceLabel: "Both pieces — $292",
            },
          ],
        },
      },
    },
    {
      updateDataModel: {
        surfaceId: "main",
        path: "/home-suggestions",
        value: {
          suggestions: [
            { label: "What's new this week?", query: "Show me what's new in" },
            { label: "Three ways to wear the jacket", query: "Show me three ways to wear the Terracotta Jacket" },
            { label: "See it on me", query: "Show me how these pieces would look on me" },
            { label: "What's on sale?", query: "Show me what's on sale" },
          ],
        },
      },
    },
  ];

  const jsonl = [
    JSON.stringify({ createSurface: { surfaceId: "main", catalogId: "brander" } }),
    JSON.stringify({ updateComponents: { surfaceId: "main", components } }),
    ...dataModels.map((d) => JSON.stringify(d)),
  ].join("\n");

  return `${A2UI_START}\n${jsonl}\n${A2UI_END}`;
}

/** Streamed ~2s AFTER the screen — renders as the closing note under it. */
export function homeFollowUpText(): string {
  return `Welcome back, ${SHOPPER.name} — this week's picks, chosen around your wardrobe.`;
}
