/**
 * The shopper and her order history: the demo world the hosted agent lives
 * in. The shopper's profile rides in the persona (brander/data/persona.mts);
 * the orders are seeded into the `orders` entity with ISO dates computed from
 * the seed date, so "ordered last week" is arithmetic the agent does against
 * the clock the platform gives it, never a stale label.
 */

export const SHOPPER = {
  name: "Maya",
  size: "M",
  shoeSize: "38",
  addresses: [
    { label: "Home, Dizengoff 12", detail: "Dizengoff 12, Tel Aviv", isDefault: true },
    { label: "Work, Rothschild 45", detail: "Rothschild 45, Tel Aviv", isDefault: false },
  ],
  styleProfile:
    "Warm neutrals (cream, terracotta, sage), natural fabrics, especially linen and silk, " +
    "elevated casual silhouettes. Prefers midi lengths, avoids loud prints and neon.",
};

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  price: number;
}

/** The shape of one `orders` record on the platform. */
export interface OrderRow {
  orderNumber: string;
  items: OrderItem[];
  total: number;
  address: string;
  /** ISO date, YYYY-MM-DD. */
  placedAt: string;
  /** ISO date, YYYY-MM-DD. */
  arrivalDate: string;
  status: "placed" | "in transit" | "delivered";
  _demo: true;
}

/** The local calendar date as YYYY-MM-DD (toISOString would shift it to UTC). */
function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysFrom(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Maya's three past orders, dated relative to `today`: last week, about a
 * month ago, two months ago. Re-run the seed with --refresh-orders before a
 * demo so the story stays fresh.
 */
export function buildOrderRows(today: Date = new Date()): OrderRow[] {
  const order = (
    orderNumber: string,
    item: OrderItem,
    placedDaysAgo: number,
    transitDays: number
  ): OrderRow => ({
    orderNumber,
    items: [item],
    total: item.price,
    address: SHOPPER.addresses[0].label,
    placedAt: isoDate(daysFrom(today, -placedDaysAgo)),
    arrivalDate: isoDate(daysFrom(today, -placedDaysAgo + transitDays)),
    status: "delivered",
    _demo: true,
  });
  return [
    order("AN-2408", { productId: "linen-wide-leg-pants", name: "Linen Wide-Leg Pants", size: "M", price: 110 }, 7, 5),
    order("AN-2311", { productId: "knit-cardigan", name: "Knit Cardigan", size: "M", price: 88 }, 34, 4),
    order("AN-2189", { productId: "silk-camisole", name: "Silk Camisole", size: "M", price: 49 }, 66, 8),
  ];
}
