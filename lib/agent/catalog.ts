/**
 * The Atelier Nova catalog — the single source of truth for every product the
 * agent may show. Image files live in /public/products; `imagePath` is turned
 * into an absolute URL at prompt-build time (the BranderUX embed renders on a
 * different origin, so relative URLs would break).
 */

export enum ProductCategory {
  NEW_IN = "new-in",
  DRESSES = "dresses",
  KNITWEAR = "knitwear",
  SALE = "sale",
  OCCASION = "occasion",
  ACCESSORIES = "accessories",
}

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  sizes: string[];
  fabric: string;
  care: string;
  fit: string;
  imagePath: string;
  tags: string[];
}

const SIZES = ["S", "M", "L", "XL"];
const ONE_SIZE = ["One size"];

export const CATALOG: Product[] = [
  // ——— The Summer Edit (home picks) ———
  {
    id: "terracotta-jacket",
    name: "Terracotta Jacket",
    price: 164,
    category: ProductCategory.NEW_IN,
    sizes: SIZES,
    fabric: "Linen-viscose blend",
    care: "Machine wash cold on a gentle cycle; line dry. Do not bleach; iron low.",
    fit: "True to size — tailored shoulder, relaxed body.",
    imagePath: "/products/terracotta-jacket.jpg",
    tags: ["summer-edit", "recommended-for-maya", "warm-neutrals", "linen"],
  },
  {
    id: "linen-wrap-dress",
    name: "Linen Wrap Dress",
    price: 128,
    category: ProductCategory.DRESSES,
    sizes: SIZES,
    fabric: "100% European linen",
    care: "Machine wash cold on a gentle cycle; line dry to keep its natural texture. Pre-washed — will not shrink when cared for cold.",
    fit: "True to size — adjustable wrap waist.",
    imagePath: "/products/linen-wrap-dress.jpg",
    tags: ["summer-edit", "warm-neutrals", "linen"],
  },
  {
    id: "sage-poplin-midi",
    name: "Sage Poplin Midi",
    price: 96,
    category: ProductCategory.DRESSES,
    sizes: SIZES,
    fabric: "Crisp cotton poplin",
    care: "Machine wash cold; tumble dry low. Iron medium for the crisp look.",
    fit: "True to size — puff sleeve, elastic back waist.",
    imagePath: "/products/sage-poplin-midi.jpg",
    tags: ["summer-edit", "pastel"],
  },
  {
    id: "silk-slip-dress",
    name: "Silk Slip Dress",
    price: 142,
    category: ProductCategory.DRESSES,
    sizes: SIZES,
    fabric: "19-momme mulberry silk",
    care: "Hand wash cold with silk detergent or dry clean; never tumble dry.",
    fit: "Runs slightly small — consider sizing up for a relaxed drape.",
    imagePath: "/products/silk-slip-dress.jpg",
    tags: ["summer-edit", "evening"],
  },
  {
    id: "cotton-sundress",
    name: "Cotton Sundress",
    price: 79,
    category: ProductCategory.DRESSES,
    sizes: SIZES,
    fabric: "Lightweight organic cotton",
    care: "Machine wash cold; line dry. Expect a soft, lived-in finish.",
    fit: "True to size — smocked bodice fits sizes between.",
    imagePath: "/products/cotton-sundress.jpg",
    tags: ["summer-edit"],
  },
  {
    id: "knit-cardigan",
    name: "Knit Cardigan",
    price: 88,
    category: ProductCategory.KNITWEAR,
    sizes: SIZES,
    fabric: "Cotton-merino knit",
    care: "Hand wash cold; dry flat. Fold, never hang.",
    fit: "Relaxed — Maya owns this in M and wears it oversized.",
    imagePath: "/products/knit-cardigan.jpg",
    tags: ["summer-edit", "warm-neutrals", "maya-owns"],
  },

  // ——— Occasion (soft pastels) ———
  {
    id: "lilac-silk-midi",
    name: "Lilac Silk Midi",
    price: 240,
    category: ProductCategory.OCCASION,
    sizes: SIZES,
    fabric: "Silk charmeuse",
    care: "Dry clean only.",
    fit: "True to size — bias cut, scoop neck.",
    imagePath: "/products/lilac-silk-midi.jpg",
    tags: ["occasion", "pastel"],
  },
  {
    id: "pale-blue-gown",
    name: "Pale Blue Gown",
    price: 280,
    category: ProductCategory.OCCASION,
    sizes: SIZES,
    fabric: "Chiffon over satin lining",
    care: "Dry clean only.",
    fit: "True to size — V-neck, front slit, floor length.",
    imagePath: "/products/pale-blue-gown.jpg",
    tags: ["occasion", "pastel"],
  },
  {
    id: "blush-maxi-dress",
    name: "Blush Maxi Dress",
    price: 220,
    category: ProductCategory.OCCASION,
    sizes: SIZES,
    fabric: "Crinkled georgette",
    care: "Dry clean recommended; cool hand wash possible.",
    fit: "True to size — tie shoulders, wrap bodice.",
    imagePath: "/products/blush-maxi-dress.jpg",
    tags: ["occasion", "pastel"],
  },
  {
    id: "sage-chiffon-gown",
    name: "Sage Chiffon Gown",
    price: 260,
    category: ProductCategory.OCCASION,
    sizes: SIZES,
    fabric: "Airy chiffon, flutter sleeve",
    care: "Dry clean only.",
    fit: "True to size — floaty A-line, forgiving through the waist.",
    imagePath: "/products/sage-chiffon-gown.jpg",
    tags: ["occasion", "pastel"],
  },
  {
    id: "strappy-heels",
    name: "Strappy Heels",
    price: 90,
    category: ProductCategory.ACCESSORIES,
    sizes: ["36", "37", "38", "39", "40"],
    fabric: "Vegan leather, 8cm heel",
    care: "Wipe clean with a damp cloth.",
    fit: "True to size — Maya wears 38.",
    imagePath: "/products/strappy-heels.jpg",
    tags: ["occasion", "complete-the-look"],
  },
  {
    id: "pearl-earrings",
    name: "Pearl Earrings",
    price: 50,
    category: ProductCategory.ACCESSORIES,
    sizes: ONE_SIZE,
    fabric: "Freshwater pearls, gold-plated drop",
    care: "Store in the pouch; keep away from perfume.",
    fit: "One size.",
    imagePath: "/products/pearl-earrings.jpg",
    tags: ["occasion", "complete-the-look"],
  },

  // ——— Maya's past orders ———
  {
    id: "linen-wide-leg-pants",
    name: "Linen Wide-Leg Pants",
    price: 110,
    category: ProductCategory.NEW_IN,
    sizes: SIZES,
    fabric: "100% European linen",
    care: "Machine wash cold; line dry.",
    fit: "True to size — high waist, wide leg.",
    imagePath: "/products/linen-wide-leg-pants.jpg",
    tags: ["maya-owns", "warm-neutrals", "linen"],
  },
  {
    id: "silk-camisole",
    name: "Silk Camisole",
    price: 68,
    category: ProductCategory.SALE,
    salePrice: 49,
    sizes: SIZES,
    fabric: "Mulberry silk",
    care: "Hand wash cold; dry flat.",
    fit: "True to size.",
    imagePath: "/products/silk-camisole.jpg",
    tags: ["maya-owns", "layering"],
  },

  // ——— New In fillers ———
  {
    id: "cream-linen-blazer",
    name: "Cream Linen Blazer",
    price: 172,
    category: ProductCategory.NEW_IN,
    sizes: SIZES,
    fabric: "Linen-cotton suiting",
    care: "Dry clean recommended.",
    fit: "Relaxed — drop shoulder, single button.",
    imagePath: "/products/cream-linen-blazer.jpg",
    tags: ["warm-neutrals", "linen", "summer-edit"],
  },
  {
    id: "striped-boat-tee",
    name: "Striped Boat Tee",
    price: 54,
    category: ProductCategory.NEW_IN,
    sizes: SIZES,
    fabric: "Heavy cotton jersey",
    care: "Machine wash cold; tumble dry low.",
    fit: "True to size — boxy crop.",
    imagePath: "/products/striped-boat-tee.jpg",
    tags: ["casual"],
  },
  {
    id: "canvas-tote",
    name: "Canvas Tote",
    price: 65,
    category: ProductCategory.ACCESSORIES,
    sizes: ONE_SIZE,
    fabric: "Washed cotton canvas, leather handles",
    care: "Spot clean.",
    fit: "One size.",
    imagePath: "/products/canvas-tote.jpg",
    tags: ["casual", "new-in"],
  },

  // ——— Knitwear fillers ———
  {
    id: "ribbed-turtleneck",
    name: "Ribbed Turtleneck",
    price: 92,
    category: ProductCategory.KNITWEAR,
    sizes: SIZES,
    fabric: "Ribbed merino",
    care: "Hand wash cold; dry flat.",
    fit: "Slim — size up for a looser roll.",
    imagePath: "/products/ribbed-turtleneck.jpg",
    tags: ["warm-neutrals"],
  },
  {
    id: "cashmere-crew",
    name: "Cashmere Crew",
    price: 180,
    category: ProductCategory.KNITWEAR,
    sizes: SIZES,
    fabric: "Grade-A Mongolian cashmere",
    care: "Hand wash cold with cashmere shampoo; dry flat.",
    fit: "True to size.",
    imagePath: "/products/cashmere-crew.jpg",
    tags: ["warm-neutrals", "premium"],
  },
  {
    id: "boucle-cardigan",
    name: "Bouclé Cardigan",
    price: 118,
    category: ProductCategory.KNITWEAR,
    sizes: SIZES,
    fabric: "Wool-blend bouclé",
    care: "Hand wash cold; dry flat.",
    fit: "Relaxed — cropped, gold buttons.",
    imagePath: "/products/boucle-cardigan.jpg",
    tags: ["texture"],
  },

  // ——— Sale fillers ———
  {
    id: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    price: 98,
    salePrice: 59,
    category: ProductCategory.SALE,
    sizes: SIZES,
    fabric: "Recycled poly satin",
    care: "Machine wash cold in a laundry bag; hang dry.",
    fit: "True to size — elastic waist.",
    imagePath: "/products/pleated-midi-skirt.jpg",
    tags: ["sale"],
  },
  {
    id: "belted-shirt-dress",
    name: "Belted Shirt Dress",
    price: 120,
    salePrice: 72,
    category: ProductCategory.SALE,
    sizes: SIZES,
    fabric: "Cotton twill",
    care: "Machine wash cold; hang dry; iron medium.",
    fit: "True to size — removable belt.",
    imagePath: "/products/belted-shirt-dress.jpg",
    tags: ["sale", "workwear"],
  },
];

export function getProduct(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}
