/**
 * The project's data entities, the agent's policies and the screen-composition
 * rules, as the seed scripts store them on the BranderUX project.
 *
 * Field notes: `tags` is a comma-joined string and `ownedByShopper` a 0/1
 * number because the agent's query tool filters scalars (eq, neq, lt, lte, gt,
 * gte, contains); arrays are display only. Every description below rides into
 * the tool the agent reads, so it is written for the agent.
 */

export const PRODUCTS_ENTITY = {
  name: "products",
  accessPolicy: "public-read",
  writePolicy: "none",
  jsonSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description:
          "Catalog slug, the stable product id used in every screen element (for example terracotta-jacket). Use this, never the internal _id.",
      },
      name: { type: "string", description: "Product name as shown to the shopper." },
      price: { type: "number", description: "Full price in USD." },
      salePrice: {
        type: "number",
        description: "Sale price in USD. 0 means the product is NOT on sale. Filter on-sale items with salePrice gt 0.",
      },
      category: {
        type: "string",
        description: "Store section: new-in, dresses, knitwear, sale, occasion or accessories. Filter with eq.",
      },
      sizes: {
        type: "array",
        items: { type: "string" },
        description: "Available sizes, pass straight into the order panel size selector. Display only, never filter on it.",
      },
      fabric: { type: "string", description: "Fabric composition, the only source for fabric answers." },
      care: { type: "string", description: "Care instructions, the only source for washing answers." },
      fit: { type: "string", description: "Fit note, the only source for sizing answers." },
      imageUrl: {
        type: "string",
        format: "image-url",
        description: "Absolute product image URL, use it verbatim in every element.",
      },
      tags: {
        type: "string",
        description:
          "Comma separated tag slugs (summer-edit, recommended-for-maya, warm-neutrals, linen, pastel, evening, maya-owns, occasion, complete-the-look, layering, casual, new-in, texture, premium, workwear, sale). Filter with contains.",
      },
      ownedByShopper: {
        type: "number",
        description: "1 when Maya already owns this piece, 0 otherwise. Filter her wardrobe with ownedByShopper eq 1.",
      },
    },
  },
} as const;

export const ORDERS_ENTITY = {
  name: "orders",
  accessPolicy: "public-read",
  writePolicy: "open",
  jsonSchema: {
    type: "object",
    properties: {
      orderNumber: {
        type: "string",
        description: "Human order id in the AN-XXXX format, for example AN-2412. You assign it when you create an order.",
      },
      items: {
        type: "array",
        description: "The ordered pieces.",
        items: {
          type: "object",
          properties: {
            productId: { type: "string", description: "Catalog slug of the piece." },
            name: { type: "string", description: "Product name." },
            size: {
              type: "string",
              description: "Selected size, M for clothing and 38 for shoes unless the shopper chose otherwise.",
            },
            price: { type: "number", description: "Price charged in USD, the sale price when the piece is on sale." },
          },
          required: ["productId", "name", "size", "price"],
        },
      },
      total: { type: "number", description: "Order total in USD, the sum of the item prices." },
      address: { type: "string", description: "Delivery address label: Home, Dizengoff 12 or Work, Rothschild 45." },
      arrivalDate: { type: "string", description: "Promised or actual arrival date as an ISO date, YYYY-MM-DD." },
      status: { type: "string", description: "placed, in transit or delivered." },
      placedAt: { type: "string", description: "Date the order was placed as an ISO date, YYYY-MM-DD." },
    },
  },
} as const;

/**
 * The hosted agent's policies. No login (a public demo), no handoff email
 * (nothing to escalate to), and orders created in auto mode: an SDK embed on
 * the demo's own host cannot show the platform's confirm card, and the
 * visitor's "Place order" click is the confirmation.
 */
export const AGENT_POLICIES = {
  language: "en",
  timezone: "Asia/Jerusalem",
  loginRequirement: "none",
  writePolicies: { create_orders: "auto" },
  entityLabels: { products: "products", orders: "orders" },
} as const;

/** Screen-composition rules for flexible mode: one rule per demo moment. */
export const FLEXIBLE_MODE_RULES = [
  "This is the ATELIER NOVA storefront, compose screens like an elegant fashion e-commerce site.",
  "Home page: the Nova Hero beside a Nova Product Grid of SIX picks (columns: 3), badge ONLY the most recommended item, always with a personal badgeReason, and give it the shopper's size chip; below them a Nova Look Editorial strip of up to three pre-rendered looks.",
  "Category pages (New In, Dresses, Knitwear, Sale): a short header, then ONE Nova Product Grid. Show sale prices via salePrice.",
  "Opening or buying a specific product: a Nova Order Panel (her size preselected, default address, arrival promise), ALWAYS with completeTheLook filled with 2 to 4 genuinely pairing pieces and a personal note.",
  "Care, fit or styling questions about a product: the Nova Stylist Note AND that product's Nova Order Panel side by side on the SAME screen, the answer and the buy belong together.",
  "Right after an order is placed: show ONLY a Nova Order Confirmed.",
  "Tracking an existing order: a Nova Order Confirmed whose title carries the status and whose arrivalText carries the date.",
  "Occasion or event requests: a header naming the occasion, a Nova Product Grid of the matching pieces, and ONE Nova Look Board composing the outfit (pieces she owns marked owned and unpriced, gap pieces priced).",
  "Trip or packing requests: a short header naming the trip, then ONE Nova Look Board (3 to 4 looks; pieces she owns marked owned and unpriced; gap pieces priced; contextNote is the arrives-before-your-flight promise). No product grid on trip screens.",
  "Try-on requests (\"see it on me\"): ONLY a Nova Fitting Room element, with EXACTLY the pre-rendered figureMap, bases and layers supplied in the agent's context, never invented combinations.",
  "End EVERY screen with a Nova Suggestions row: 2 to 4 short follow-ups contextual to what the screen shows (on an order panel: \"Three ways to wear it\", \"Will it shrink?\"; on a confirmation: \"Track my order\", \"Keep shopping\"). Never generic, always tappable next steps.",
  "Keep layouts calm and editorial, at most three content blocks per screen (the suggestions row does not count). Always use the absolute image URLs the data tools return, never construct one.",
].join(" ");
