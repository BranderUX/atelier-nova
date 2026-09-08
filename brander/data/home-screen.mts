/**
 * The designed home page. Its layout is the `custom-nova-home` screen
 * (brander/screens.mts); its copy and picks are fixed here and stored on the
 * project with the agent config (set_home_screen in MCP terms). When a visitor
 * lands, the first custom page's query ("Show home page") auto-fires and the
 * platform replays this data with zero model calls: instant, identical every
 * time. The data is deliberately static, with no live bindings: a binding that
 * fails would send the whole landing to a paid agent turn.
 */

import { SHOPPER } from "./world.mts";

export const HOME_MATCH_QUERY = "Show home page";
export const HOME_SCREEN_ID = "custom-nova-home";

export interface HomeScreen {
  matchQuery: string;
  screenId: string;
  data: Record<string, Record<string, unknown>>;
  followUpText: string;
}

export function buildHomeScreen(siteOrigin: string): HomeScreen {
  const img = (path: string) => `${siteOrigin}${path}`;
  return {
    matchQuery: HOME_MATCH_QUERY,
    screenId: HOME_SCREEN_ID,
    followUpText: `Welcome back, ${SHOPPER.name}. This week's picks, chosen around what is already in your wardrobe.`,
    data: {
      "home-hero": {
        greeting: `Welcome back, ${SHOPPER.name}`,
        subtitle: "Picked for you from this week's arrivals.",
        campaignTitle: "The\nSummer\nEdit",
        campaignBody: "Effortless pieces for warm days and balmy nights.",
        ctaLabel: "Shop now",
        imageUrl: img("/products/hero-summer-edit.jpg"),
      },
      "home-picks": {
        columns: 3,
        products: [
          { id: "linen-wrap-dress", name: "Linen Wrap Dress", price: 128, imageUrl: img("/products/linen-wrap-dress.jpg") },
          {
            id: "terracotta-jacket",
            name: "Terracotta Jacket",
            price: 164,
            imageUrl: img("/products/terracotta-jacket.jpg"),
            badge: "Recommended",
            badgeReason: "Pairs with the linen wide-leg pants already in your wardrobe",
            badgeImageUrl: img("/products/fitting/fit-pants-cami--terracotta-jacket.jpg"),
            sizeChip: `Size ${SHOPPER.size}`,
          },
          { id: "sage-poplin-midi", name: "Sage Poplin Midi", price: 96, imageUrl: img("/products/sage-poplin-midi.jpg") },
          { id: "silk-slip-dress", name: "Silk Slip Dress", price: 142, imageUrl: img("/products/silk-slip-dress.jpg") },
          { id: "cotton-sundress", name: "Cotton Sundress", price: 79, imageUrl: img("/products/cotton-sundress.jpg") },
          { id: "knit-cardigan", name: "Knit Cardigan", price: 88, imageUrl: img("/products/knit-cardigan.jpg") },
        ],
      },
      "home-looks": {
        headline: "Styled together",
        subtitle: "This week's picks, combined with pieces you already own.",
        looks: [
          {
            id: "look-weekend-layers",
            title: "Weekend layers",
            caption: "Your linen pants and camisole, with the Terracotta Jacket",
            imageUrl: img("/products/fitting/fit-pants-cami--terracotta-jacket.jpg"),
            priceLabel: "Add the jacket, $164",
          },
          {
            id: "look-golden-hour",
            title: "Golden hour",
            caption: "The Silk Slip Dress under your Knit Cardigan",
            imageUrl: img("/products/fitting/fit-slip-dress--knit-cardigan.jpg"),
            priceLabel: "Add the dress, $142",
          },
          {
            id: "look-desk-dinner",
            title: "Desk to dinner",
            caption: "The Linen Wrap Dress with the Terracotta Jacket",
            imageUrl: img("/products/fitting/fit-wrap-dress--terracotta-jacket.jpg"),
            priceLabel: "Both pieces, $292",
          },
        ],
      },
      "home-suggestions": {
        suggestions: [
          { label: "What's new this week?", query: "Show me what's new in" },
          { label: "Three ways to wear the jacket", query: "Show me three ways to wear the Terracotta Jacket" },
          { label: "Play with combinations", query: "Let me play with combinations of these pieces" },
          { label: "What's on sale?", query: "Show me what's on sale" },
        ],
      },
    },
  };
}
