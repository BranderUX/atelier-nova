/**
 * Metadata for the Nova custom elements — everything the BranderUX
 * custom-element API needs beyond the TSX in brander/elements/. `__SITE__`
 * tokens in defaultProps are replaced with the storefront origin at seed time.
 *
 * Wiring notes (mirrors deriveElementInteraction in BranderUX):
 *  - interactionPropName = the element's single primary callback
 *  - onItemContextMenu is a generic shim name and is intentionally NOT listed
 *    as rightClickPropName (the frame injects it)
 *  - clickQueryTemplate: plain string = primary template; JSON map = per-action
 */

export interface ElementSeed {
  file: string;
  name: string;
  key: string;
  description: string;
  category: "data" | "media" | "interactive" | "custom";
  iconName: string;
  propsSchema: Record<string, unknown>;
  defaultProps: Record<string, unknown>;
  structurePrompt: string;
  clickQueryTemplate: string | null;
  interactionPropName: string | null;
}

const PRODUCT_ITEM_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", description: "Catalog product id" },
    name: { type: "string" },
    price: { type: "number" },
    salePrice: { type: "number", description: "Discounted price — show only for sale items" },
    imageUrl: { type: "string", description: "Absolute product image URL" },
    badge: { type: "string", description: "Corner ribbon text, e.g. 'Recommended' — at most one per grid" },
    badgeReason: {
      type: "string",
      description:
        "One-line personal reason shown as a tooltip on the badge, e.g. 'Pairs with the linen pants you bought last week'. Always provide it when badge is set.",
    },
    badgeImageUrl: {
      type: "string",
      description:
        "When badgeReason references ANOTHER product (a pairing piece), its catalog imageUrl — shown as a thumbnail inside the tooltip.",
    },
    sizeChip: { type: "string", description: "Small chip under the price, e.g. 'Size M'" },
  },
  required: ["id", "name", "price", "imageUrl"],
};

const LOOK_ITEM_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    price: { type: "number" },
    imageUrl: { type: "string", description: "Absolute product image URL" },
  },
  required: ["id", "name", "price", "imageUrl"],
};

export const ELEMENTS: ElementSeed[] = [
  {
    file: "nova-look-board.tsx",
    name: "Nova Look Board",
    key: "nova-look-board",
    description:
      "A capsule of composed outfits ('looks'): each look stacks its pieces, marks what the shopper ALREADY OWNS, prices only the gaps, and one CTA adds all missing pieces.",
    category: "interactive",
    iconName: "Shirt",
    propsSchema: {
      type: "object",
      properties: {
        looks: {
          type: "array",
          description: "2–4 composed outfits",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string", description: "e.g. 'Day one — old town'" },
              note: { type: "string", description: "One line on why this look works" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    price: { type: "number" },
                    imageUrl: { type: "string", description: "Absolute product image URL" },
                    owned: {
                      type: "boolean",
                      description: "true when the shopper already owns this piece (purchase history)",
                    },
                  },
                  required: ["id", "name", "price", "imageUrl"],
                },
              },
            },
            required: ["id", "title", "items"],
          },
        },
        contextNote: {
          type: "string",
          description: "Bottom-bar context, e.g. 'Everything arrives before your flight'",
        },
        ctaLabel: { type: "string", description: "Override for the add-all CTA label" },
      },
      required: ["looks"],
    },
    defaultProps: {
      looks: [
        {
          id: "look-day",
          title: "Daytime wandering",
          note: "Light linen for warm streets",
          items: [
            { id: "linen-wide-leg-pants", name: "Linen Wide-Leg Pants", price: 110, imageUrl: "__SITE__/products/linen-wide-leg-pants.jpg", owned: true },
            { id: "striped-boat-tee", name: "Striped Boat Tee", price: 54, imageUrl: "__SITE__/products/striped-boat-tee.jpg" },
            { id: "canvas-tote", name: "Canvas Tote", price: 65, imageUrl: "__SITE__/products/canvas-tote.jpg" },
          ],
        },
        {
          id: "look-evening",
          title: "Golden-hour dinner",
          note: "Silk that catches the light",
          items: [
            { id: "silk-slip-dress", name: "Silk Slip Dress", price: 142, imageUrl: "__SITE__/products/silk-slip-dress.jpg" },
            { id: "knit-cardigan", name: "Knit Cardigan", price: 88, imageUrl: "__SITE__/products/knit-cardigan.jpg", owned: true },
            { id: "strappy-heels", name: "Strappy Heels", price: 90, imageUrl: "__SITE__/products/strappy-heels.jpg" },
          ],
        },
      ],
      contextNote: "Everything arrives before your flight.",
    },
    structurePrompt:
      "Use for trips, packing capsules and multi-outfit plans. Compose 2–4 looks mixing pieces the shopper OWNS (owned: true, from purchase history — never price those) with gap pieces to buy; give each look a short title + note; contextNote carries the delivery-before-the-trip promise.",
    clickQueryTemplate: JSON.stringify({
      $primary: "Show details and order options for {name} (ID: {id})",
      onShopCapsule: "Order all the missing pieces from my capsule: {itemNames} (total ${total})",
    }),
    interactionPropName: "onSelectItem",
  },
  {
    file: "nova-look-editorial.tsx",
    name: "Nova Look Editorial",
    key: "nova-look-editorial",
    description:
      "Editorial 'worn by you' strip: up to three large pre-rendered try-on photos of the shopper wearing composed outfits, each with a look title, a caption naming the pieces and a price chip for what's missing.",
    category: "media",
    iconName: "Camera",
    propsSchema: {
      type: "object",
      properties: {
        headline: { type: "string", description: "Section headline, e.g. 'Worn by you'" },
        subtitle: { type: "string", description: "One line under the headline" },
        looks: {
          type: "array",
          description: "1–3 looks, each backed by a REAL pre-rendered try-on image",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string", description: "Short look name, e.g. 'Golden hour'" },
              caption: {
                type: "string",
                description: "One line naming the pieces, e.g. 'The Silk Slip Dress under your Knit Cardigan'",
              },
              imageUrl: {
                type: "string",
                description:
                  "Absolute URL of a pre-rendered try-on shot from the fitting-room assets — NEVER a plain product image or an invented URL",
              },
              priceLabel: { type: "string", description: "Price chip for the missing pieces, e.g. 'Add the jacket — $164'" },
            },
            required: ["id", "title", "caption", "imageUrl"],
          },
        },
      },
      required: ["looks"],
    },
    defaultProps: {
      headline: "Worn by you",
      subtitle: "Looks styled on you, from pieces you own and this week's picks.",
      looks: [
        {
          id: "look-weekend-layers",
          title: "Weekend layers",
          caption: "Your linen pants + camisole, with the Terracotta Jacket",
          imageUrl: "__SITE__/products/fitting/fit-pants-cami--terracotta-jacket.jpg",
          priceLabel: "Add the jacket — $164",
        },
        {
          id: "look-golden-hour",
          title: "Golden hour",
          caption: "The Silk Slip Dress under your Knit Cardigan",
          imageUrl: "__SITE__/products/fitting/fit-slip-dress--knit-cardigan.jpg",
          priceLabel: "Add the dress — $142",
        },
        {
          id: "look-desk-dinner",
          title: "Desk to dinner",
          caption: "The Linen Wrap Dress with the Terracotta Jacket",
          imageUrl: "__SITE__/products/fitting/fit-wrap-dress--terracotta-jacket.jpg",
          priceLabel: "Both pieces — $292",
        },
      ],
    },
    structurePrompt:
      "Editorial try-on strip for home and lookbook moments. Use ONLY combinations that exist in the fitting-room asset map in context — imageUrl must be one of those pre-rendered try-on URLs. Caption names the pieces (mark owned ones as 'your …'); priceLabel prices only what's missing.",
    clickQueryTemplate: "Shop the '{title}' look: {caption}",
    interactionPropName: "onSelectLook",
  },
  {
    file: "nova-fitting-room.tsx",
    name: "Nova Fitting Room",
    key: "nova-fitting-room",
    description:
      "Interactive try-on: her full-body figure on the left, clothing cards on the right — drag a piece onto her (or tap it) and the figure swaps instantly from a pre-rendered image map. No queries during play; one CTA orders the styled look.",
    category: "interactive",
    iconName: "Shirt",
    propsSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "e.g. 'See it on you'" },
        figureMap: {
          type: "object",
          description:
            "Pre-rendered try-on images keyed '{baseId}--{layerId}' ('none' = no layer). Pass EXACTLY the map provided in context — never invent keys or URLs.",
          additionalProperties: { type: "string" },
        },
        bases: {
          type: "array",
          description: "Base outfits (each id must exist in figureMap keys)",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              price: { type: "number" },
              imageUrl: { type: "string" },
              owned: { type: "boolean" },
            },
            required: ["id", "name", "price", "imageUrl"],
          },
        },
        layers: {
          type: "array",
          description: "Layer pieces (each id must exist in figureMap keys)",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              price: { type: "number" },
              imageUrl: { type: "string" },
              owned: { type: "boolean" },
            },
            required: ["id", "name", "price", "imageUrl"],
          },
        },
        initialBaseId: { type: "string", description: "Base to show first" },
      },
      required: ["figureMap", "bases", "layers", "initialBaseId"],
    },
    defaultProps: {
      title: "See it on you",
      figureMap: {
        "pants-cami--none": "__SITE__/products/fitting/fit-pants-cami--none.jpg",
        "pants-cami--terracotta-jacket": "__SITE__/products/fitting/fit-pants-cami--terracotta-jacket.jpg",
        "pants-cami--knit-cardigan": "__SITE__/products/fitting/fit-pants-cami--knit-cardigan.jpg",
        "wrap-dress--none": "__SITE__/products/fitting/fit-wrap-dress--none.jpg",
        "wrap-dress--terracotta-jacket": "__SITE__/products/fitting/fit-wrap-dress--terracotta-jacket.jpg",
        "wrap-dress--knit-cardigan": "__SITE__/products/fitting/fit-wrap-dress--knit-cardigan.jpg",
        "slip-dress--none": "__SITE__/products/fitting/fit-slip-dress--none.jpg",
        "slip-dress--terracotta-jacket": "__SITE__/products/fitting/fit-slip-dress--terracotta-jacket.jpg",
        "slip-dress--knit-cardigan": "__SITE__/products/fitting/fit-slip-dress--knit-cardigan.jpg",
      },
      bases: [
        { id: "pants-cami", name: "Linen Pants + Camisole", price: 178, imageUrl: "__SITE__/products/linen-wide-leg-pants.jpg", owned: true },
        { id: "wrap-dress", name: "Linen Wrap Dress", price: 128, imageUrl: "__SITE__/products/linen-wrap-dress.jpg" },
        { id: "slip-dress", name: "Silk Slip Dress", price: 142, imageUrl: "__SITE__/products/silk-slip-dress.jpg" },
      ],
      layers: [
        { id: "terracotta-jacket", name: "Terracotta Jacket", price: 164, imageUrl: "__SITE__/products/terracotta-jacket.jpg" },
        { id: "knit-cardigan", name: "Knit Cardigan", price: 88, imageUrl: "__SITE__/products/knit-cardigan.jpg", owned: true },
      ],
      initialBaseId: "pants-cami",
    },
    structurePrompt:
      "Use when the shopper wants to SEE pieces on herself (try on, 'how would it look on me'). Pass EXACTLY the figureMap, bases and layers from the fitting-room assets in context — the images are pre-rendered for those combinations only.",
    clickQueryTemplate: "Order the look I styled on myself: {lookNames} (total ${total})",
    interactionPropName: "onOrderLook",
  },
  {
    file: "nova-suggestions.tsx",
    name: "Nova Suggestions",
    key: "nova-suggestions",
    description:
      "A row of 2–4 tappable follow-up chips that keep the conversation going — each carries a short label and the full query it fires.",
    category: "interactive",
    iconName: "Sparkles",
    propsSchema: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          description: "2–4 contextual follow-ups for the CURRENT screen",
          items: {
            type: "object",
            properties: {
              label: { type: "string", description: "Short chip text, 2–5 words" },
              query: {
                type: "string",
                description: "The full query the chip fires; omit to fire the label itself",
              },
            },
            required: ["label"],
          },
        },
      },
      required: ["suggestions"],
    },
    defaultProps: {
      suggestions: [
        { label: "Three ways to wear it", query: "Show me three ways to wear the Terracotta Jacket" },
        { label: "Will it shrink?", query: "Will the Terracotta Jacket shrink in the wash?" },
        { label: "What's new this week?", query: "Show me what's new in" },
      ],
    },
    structurePrompt:
      "Follow-up chips: 2–4 short prompts the shopper would plausibly tap NEXT, contextual to what the current screen shows (never generic).",
    clickQueryTemplate: "{query}",
    interactionPropName: "onSelectSuggestion",
  },
  {
    file: "nova-hero.tsx",
    name: "Nova Hero",
    key: "nova-hero",
    description:
      "Full-width welcome hero: personalized greeting, campaign title and copy, CTA button and a lifestyle image.",
    category: "media",
    iconName: "Image",
    propsSchema: {
      type: "object",
      properties: {
        greeting: { type: "string", description: "Personal greeting, e.g. 'Welcome back, Maya'" },
        subtitle: { type: "string", description: "One line under the greeting" },
        campaignTitle: {
          type: "string",
          description: "Short campaign name; use \\n for stacked line breaks, e.g. 'The\\nSummer\\nEdit'",
        },
        campaignBody: { type: "string", description: "One–two sentence campaign description" },
        ctaLabel: { type: "string", description: "Button label, e.g. 'Shop now'" },
        imageUrl: { type: "string", description: "Absolute URL of the hero lifestyle image" },
      },
      required: ["greeting", "subtitle", "campaignTitle", "campaignBody", "ctaLabel", "imageUrl"],
    },
    defaultProps: {
      greeting: "Welcome back, Maya",
      subtitle: "Picked for you from this week's arrivals.",
      campaignTitle: "The\nSummer\nEdit",
      campaignBody: "Effortless pieces for warm days and balmy nights.",
      ctaLabel: "Shop now",
      imageUrl: "__SITE__/products/hero-summer-edit.jpg",
    },
    structurePrompt:
      "The welcome banner for the home experience: personalized greeting, current campaign copy, CTA label and the absolute imageUrl of the campaign lifestyle photo.",
    clickQueryTemplate: "{ctaLabel}: {campaignTitle}",
    interactionPropName: "onShopNow",
  },
  {
    file: "nova-product-grid.tsx",
    name: "Nova Product Grid",
    key: "nova-product-grid",
    description:
      "Editorial product card grid with prices, optional sale pricing, a single 'Recommended' corner ribbon and a size chip.",
    category: "data",
    iconName: "LayoutGrid",
    propsSchema: {
      type: "object",
      properties: {
        products: { type: "array", items: PRODUCT_ITEM_SCHEMA, description: "Products to display, 2–6 typically" },
        columns: { type: "integer", minimum: 2, maximum: 4, description: "Desktop column count (default 3)" },
      },
      required: ["products"],
    },
    defaultProps: {
      products: [
        {
          id: "terracotta-jacket",
          name: "Terracotta Jacket",
          price: 164,
          imageUrl: "__SITE__/products/terracotta-jacket.jpg",
          badge: "Recommended",
          badgeReason: "Pairs with the linen pants you bought last week",
          sizeChip: "Size M",
        },
        {
          id: "linen-wrap-dress",
          name: "Linen Wrap Dress",
          price: 128,
          imageUrl: "__SITE__/products/linen-wrap-dress.jpg",
        },
        {
          id: "sage-poplin-midi",
          name: "Sage Poplin Midi",
          price: 96,
          imageUrl: "__SITE__/products/sage-poplin-midi.jpg",
        },
      ],
      columns: 3,
    },
    structurePrompt:
      "The standard product listing block for home picks, categories, search results and occasion edits. Pass products[] with absolute imageUrls; badge ONLY the single most recommended item, ALWAYS with a personal one-line badgeReason (why it suits this shopper — style profile or purchase history); add sizeChip with the shopper's size on the recommended item.",
    clickQueryTemplate: "Show details and order options for {name} (ID: {id})",
    interactionPropName: "onSelectProduct",
  },
  {
    file: "nova-stylist-note.tsx",
    name: "Nova Stylist Note",
    key: "nova-stylist-note",
    description:
      "The stylist's answer card: fabric-care/fit explanations with care icons and a highlighted fit note, or a compact pairing suggestion with a product thumbnail.",
    category: "interactive",
    iconName: "Info",
    propsSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short headline, e.g. 'Machine-washable, cold'" },
        bodyText: { type: "string", description: "The answer or suggestion, 1–3 sentences" },
        careIcons: {
          type: "array",
          items: {
            type: "string",
            enum: ["machine-wash-cold", "hand-wash", "no-bleach", "line-dry", "iron-low", "dry-clean"],
          },
          description: "Fabric-care symbols to display — only for care answers",
        },
        thumbnailUrl: { type: "string", description: "Product thumbnail — switches to the compact pairing-note layout" },
        metaLine: { type: "string", description: "Small meta line, e.g. 'Ordered Jul 9'" },
        footerHighlight: { type: "string", description: "Highlighted footer, e.g. 'Fit: true to size — your usual M'" },
        productId: { type: "string", description: "Catalog id of the referenced product" },
        productName: { type: "string", description: "Name of the referenced product" },
      },
      required: ["bodyText"],
    },
    defaultProps: {
      title: "Machine-washable, cold",
      careIcons: ["machine-wash-cold", "no-bleach", "line-dry", "iron-low"],
      bodyText:
        "Our linen blend is designed for easy care. Machine wash cold on a gentle cycle and line dry to maintain its natural texture and longevity.",
      footerHighlight: "Fit: true to size — your usual M",
    },
    structurePrompt:
      "Use to ANSWER a question or voice a suggestion. Care/fit answers: title + careIcons + bodyText + footerHighlight. Pairing/memory suggestions: thumbnailUrl + bodyText + metaLine + productId/productName.",
    clickQueryTemplate: "Show details and order options for {productName} (ID: {productId})",
    interactionPropName: "onViewProduct",
  },
  {
    file: "nova-order-panel.tsx",
    name: "Nova Order Panel",
    key: "nova-order-panel",
    description:
      "Single-product order panel: product image, price, size selector, delivery-address picker, arrival promise and a place-order CTA.",
    category: "interactive",
    iconName: "ShoppingBag",
    propsSchema: {
      type: "object",
      properties: {
        product: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            imageUrl: { type: "string", description: "Absolute product image URL" },
          },
          required: ["id", "name", "price", "imageUrl"],
        },
        sizes: { type: "array", items: { type: "string" }, description: "Available sizes" },
        preselectedSize: { type: "string", description: "The shopper's size — preselect it" },
        addresses: { type: "array", items: { type: "string" }, description: "The shopper's delivery addresses" },
        preselectedAddress: { type: "string", description: "Default delivery address" },
        arrivalText: { type: "string", description: "Delivery promise, e.g. 'Arrives Sunday, Jul 26'" },
        completeTheLook: {
          type: "object",
          description:
            "ALWAYS include: 2–4 catalog pieces that genuinely pair with the product. Shown as a tasteful teaser that opens a full bundle modal before ordering.",
          properties: {
            title: { type: "string", description: "e.g. 'Complete the look'" },
            note: { type: "string", description: "One-line reason these pieces pair, personal to the shopper" },
            items: { type: "array", items: LOOK_ITEM_SCHEMA },
          },
          required: ["items"],
        },
      },
      required: ["product", "sizes", "preselectedSize", "addresses", "preselectedAddress", "arrivalText"],
    },
    defaultProps: {
      product: {
        id: "terracotta-jacket",
        name: "Terracotta Jacket",
        price: 164,
        imageUrl: "__SITE__/products/terracotta-jacket.jpg",
      },
      sizes: ["S", "M", "L", "XL"],
      preselectedSize: "M",
      addresses: ["Home — Dizengoff 12", "Work — Rothschild 45"],
      preselectedAddress: "Home — Dizengoff 12",
      arrivalText: "Arrives Sunday, Jul 26",
      completeTheLook: {
        title: "Complete the look",
        note: "Pairs with the linen pants you bought last week",
        items: [
          { id: "linen-wide-leg-pants", name: "Linen Wide-Leg Pants", price: 110, imageUrl: "__SITE__/products/linen-wide-leg-pants.jpg" },
          { id: "silk-camisole", name: "Silk Camisole", price: 68, imageUrl: "__SITE__/products/silk-camisole.jpg" },
          { id: "canvas-tote", name: "Canvas Tote", price: 65, imageUrl: "__SITE__/products/canvas-tote.jpg" },
        ],
      },
    },
    structurePrompt:
      "Use when the shopper opens a specific product or wants to buy. Preselect her size and default address; arrivalText carries the delivery promise. ALWAYS fill completeTheLook with 2–4 genuinely pairing catalog pieces and a personal note.",
    clickQueryTemplate: JSON.stringify({
      onPlaceOrder: "Place my order: {name} (ID: {id}), size {size}, deliver to {address}",
      onAddCompleteLook:
        "Add the complete look to my order: {bundleNames} (bundle total ${total}, base product {baseProductId})",
    }),
    interactionPropName: null,
  },
  {
    file: "nova-order-confirmed.tsx",
    name: "Nova Order Confirmed",
    key: "nova-order-confirmed",
    description: "Order confirmation: checkmark, arrival promise, order id and a track-order CTA.",
    category: "interactive",
    iconName: "CheckCircle2",
    propsSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "e.g. 'Order placed'" },
        arrivalText: { type: "string", description: "e.g. 'Arriving Sunday, Jul 26'" },
        orderId: { type: "string", description: "Order id in the AN-XXXX format" },
      },
      required: ["title", "arrivalText", "orderId"],
    },
    defaultProps: {
      title: "Order placed",
      arrivalText: "Arriving Sunday, Jul 26",
      orderId: "AN-2412",
    },
    structurePrompt:
      "Use immediately after an order is placed: confirm with the arrival date and the new order id.",
    clickQueryTemplate: "Track my order {orderId}",
    interactionPropName: "onTrackOrder",
  },
];
