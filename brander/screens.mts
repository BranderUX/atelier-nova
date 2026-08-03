/**
 * Custom screens for the Atelier Nova project, in SERVER WIRE format: custom
 * placements carry `elementType: null` + `customElementId` (the element key) +
 * pinned `version`; fixed elements use their enum string.
 *
 * Position/size follow the Screen Builder's normalized shape (mirrors screens
 * Lev corrected in the builder 2026-08-03):
 *  - position: { row, column, subRow } — ALL 0-BASED
 *  - size: responsive `{ md, xs }` percent widths with a matching flex string,
 *    height "auto"; maxWidth/alignSelf for centered single-element screens.
 */

interface WireElement {
  id: string;
  elementType: string | null;
  customElementId?: string;
  version?: number;
  position: { row: number; column: number; subRow: number };
  size: Record<string, unknown>;
  description?: string;
}

export interface WireCustomScreen {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  elements: WireElement[];
  created: string;
  modified: string;
  version: number;
}

const LAYOUT = {
  type: "flex",
  flexDirection: "column",
  gap: { xs: 2, md: 3 },
  padding: { xs: 2, md: 3 },
};

/** Percent-width size in the builder's normalized shape. */
function pctSize(
  mdPct: string,
  extra?: { minWidth?: string | number; maxWidth?: string; alignSelf?: string }
): Record<string, unknown> {
  return {
    width: { md: `${mdPct}%`, xs: "100%" },
    height: "auto",
    flex: { md: `1 1 ${mdPct}%`, xs: "1 1 100%" },
    minWidth: extra?.minWidth ?? null,
    maxWidth: extra?.maxWidth ? { md: extra.maxWidth, xs: "100%" } : null,
    alignSelf: extra?.alignSelf ?? null,
  };
}

function novaEl(
  id: string,
  key: string,
  row: number,
  column: number,
  size: Record<string, unknown>,
  description: string
): WireElement {
  return {
    id,
    elementType: null,
    customElementId: key,
    version: 1,
    position: { row, column, subRow: 0 },
    size,
    description,
  };
}

function headerEl(id: string, row: number, description: string): WireElement {
  return {
    id,
    elementType: "header",
    position: { row, column: 0, subRow: 0 },
    size: pctSize("100.00"),
    description,
  };
}

function screen(
  id: string,
  name: string,
  description: string,
  selectionConfig: { whenToUse: string; exampleQueries: string[]; clickedElements: string[] },
  elements: WireElement[]
): WireCustomScreen {
  const now = new Date().toISOString();
  return {
    id,
    name,
    description,
    config: { id, name, description, selectionConfig, layout: LAYOUT, elements },
    elements,
    created: now,
    modified: now,
    version: 1,
  };
}

export const CUSTOM_SCREENS: WireCustomScreen[] = [
  screen(
    "custom-nova-home",
    "Nova Home",
    "Personalized storefront home: campaign hero beside this week's picks.",
    {
      whenToUse: "The shopper's home page, landing view, or 'show me my picks / what's new for me'.",
      exampleQueries: ["Show me my personalized home page", "Take me home", "What's new for me?"],
      clickedElements: ["product card → open its order panel", "hero CTA → open the campaign edit"],
    },
    [
      novaEl("home-hero", "nova-hero", 0, 0, pctSize("50.00"), "Campaign hero with personal greeting"),
      novaEl(
        "home-picks",
        "nova-product-grid",
        0,
        1,
        pctSize("50.00"),
        "This week's picks; badge + badgeReason on the single recommended item"
      ),
    ]
  ),
  screen(
    "custom-nova-category",
    "Nova Category",
    "A store section listing: title + product grid.",
    {
      whenToUse: "Browsing a catalog section: New In, Dresses, Knitwear, Sale, or search results.",
      exampleQueries: ["Show me all dresses", "What's on sale?", "Show the knitwear collection"],
      clickedElements: ["product card → open its order panel"],
    },
    [
      headerEl("category-title", 0, "Section name, e.g. 'Dresses'"),
      novaEl("category-grid", "nova-product-grid", 1, 0, pctSize("100.00"), "All products in the section"),
    ]
  ),
  screen(
    "custom-nova-order",
    "Nova Order",
    "Single-product order panel.",
    {
      whenToUse: "The shopper opened a specific product or asked to buy/order it.",
      exampleQueries: ["Show details and order options for the Terracotta Jacket", "I want to buy the wrap dress"],
      clickedElements: ["Place order → order confirmation"],
    },
    [
      novaEl(
        "order-panel",
        "nova-order-panel",
        0,
        0,
        pctSize("100.00", { maxWidth: "460px", alignSelf: "center" }),
        "Order panel with her size preselected and default address"
      ),
    ]
  ),
  screen(
    "custom-nova-order-confirmed",
    "Nova Order Confirmed",
    "Order confirmation.",
    {
      whenToUse: "Immediately after an order was placed successfully.",
      exampleQueries: ["Place my order: Terracotta Jacket, size M"],
      clickedElements: ["Track order → order status"],
    },
    [
      novaEl(
        "order-confirmed",
        "nova-order-confirmed",
        0,
        0,
        pctSize("100.00", { maxWidth: "480px", alignSelf: "center" }),
        "Confirmation with arrival date and order id"
      ),
    ]
  ),
  screen(
    "custom-nova-occasion",
    "Nova Occasion Edit",
    "Occasion shopping edit: title, matching pieces, a composed outfit for the event.",
    {
      whenToUse: "Dressing for an event or occasion (a party, dinner date) — a curated edit plus one composed outfit.",
      exampleQueries: ["What should I wear to a summer garden party?", "Dress me for a dinner event"],
      clickedElements: ["product card → order panel", "Add the missing pieces → outfit order"],
    },
    [
      headerEl("occasion-title", 0, "Occasion name, e.g. 'For the Garden Party'"),
      novaEl(
        "occasion-grid",
        "nova-product-grid",
        1,
        0,
        pctSize("50.00", { minWidth: 0 }),
        "Matching dresses and accessories"
      ),
      novaEl(
        "occasion-outfit",
        "nova-look-board",
        1,
        1,
        pctSize("50.00", { minWidth: "300px" }),
        "ONE composed outfit for the occasion; owned pieces marked; gap pieces priced"
      ),
    ]
  ),
  screen(
    "custom-nova-trip",
    "Nova Trip Capsule",
    "A packing capsule for a trip: composed looks mixing owned and new pieces.",
    {
      whenToUse: "Trips and packing: the shopper names a destination or asks what to pack.",
      exampleQueries: ["I'm flying to Lisbon for four days", "What should I pack for a weekend away?"],
      clickedElements: ["look item → its order panel", "Add the missing pieces → capsule order"],
    },
    [
      headerEl("trip-title", 0, "Trip name, e.g. 'Lisbon — four days'"),
      novaEl(
        "trip-capsule",
        "nova-look-board",
        1,
        0,
        pctSize("100.00"),
        "3–4 composed looks; owned pieces marked; gap pieces priced; delivery promise in contextNote"
      ),
    ]
  ),
  screen(
    "custom-nova-fitting-room",
    "Nova Fitting Room",
    "Interactive try-on: drag pieces onto her figure, the image swaps instantly.",
    {
      whenToUse: "The shopper wants to see pieces on herself: try on, visualize, 'how would it look on me'.",
      exampleQueries: ["Show me how these look on me", "Can I try the jacket on?"],
      clickedElements: ["Order this look → order panel / confirmation"],
    },
    [
      novaEl(
        "fitting-room",
        "nova-fitting-room",
        0,
        0,
        pctSize("100.00"),
        "Figure + draggable piece cards, pre-rendered combination map"
      ),
    ]
  ),
  screen(
    "custom-nova-stylist-answer",
    "Nova Stylist Answer",
    "The stylist's answer beside the product's order panel — the answer and the buy are one screen.",
    {
      whenToUse: "Care, fit, fabric or styling questions about a product; pairing/memory suggestions.",
      exampleQueries: ["Will this shrink in the wash?", "What goes with the linen pants I bought?"],
      clickedElements: ["Place order → order confirmation", "note with product reference → its order panel"],
    },
    [
      novaEl(
        "stylist-note",
        "nova-stylist-note",
        0,
        0,
        pctSize("49.88", { minWidth: "300px" }),
        "The stylist's answer card"
      ),
      novaEl(
        "answer-order-panel",
        "nova-order-panel",
        0,
        1,
        pctSize("50.13", { minWidth: "320px" }),
        "Order options for the product the question was about"
      ),
    ]
  ),
];
