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

  const HOME_LOOKS: { id: string; title: string; note: string; itemIds: string[] }[] = [
    {
      id: "look-brunch",
      title: "The brunch look",
      note: "Two pieces you own, one to add.",
      itemIds: ["linen-wide-leg-pants", "silk-camisole", "terracotta-jacket"],
    },
    {
      id: "look-desk-dinner",
      title: "Desk to dinner",
      note: "Your cardigan, dressed up.",
      itemIds: ["sage-poplin-midi", "knit-cardigan", "pearl-earrings"],
    },
    {
      id: "look-golden-hour",
      title: "Golden hour",
      note: "For long evenings out.",
      itemIds: ["silk-slip-dress", "cream-linen-blazer", "strappy-heels"],
    },
  ];
  const ownedIds = new Set(["linen-wide-leg-pants", "knit-cardigan", "silk-camisole"]);

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
      component: "custom:nova-look-board",
      ...bind("home-looks", ["looks", "contextNote"]),
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
          looks: HOME_LOOKS.map((look) => ({
            id: look.id,
            title: look.title,
            note: look.note,
            items: look.itemIds
              .map((id) => getProduct(id))
              .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => Boolean(p))
              .map((p) => ({
                id: p.id,
                name: p.name,
                price: p.salePrice ?? p.price,
                imageUrl: `${siteOrigin}${p.imagePath}`,
                ...(ownedIds.has(p.id) ? { owned: true } : {}),
              })),
          })),
          contextNote: "Styled around pieces already in your wardrobe.",
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
