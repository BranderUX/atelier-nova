/**
 * Everything the agent "knows" beyond the catalog: the shopper, her history,
 * and the event context. Dates are computed relative to now so the demo always
 * says "last week" / "arrives Sunday" no matter when it runs.
 */

export interface PastOrder {
  orderId: string;
  productId: string;
  productName: string;
  size: string;
  orderedAt: string; // human-readable, e.g. "Jul 9"
  relative: string; // e.g. "last week"
  status: "delivered" | "in-transit";
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatShort(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/** Next Sunday strictly after today — the standard delivery promise. */
export function nextSunday(): string {
  const d = new Date();
  const offset = 7 - d.getDay() || 7;
  d.setDate(d.getDate() + offset);
  return `Sunday, ${formatShort(d)}`;
}

export function buildPastOrders(): PastOrder[] {
  return [
    {
      orderId: "AN-2408",
      productId: "linen-wide-leg-pants",
      productName: "Linen Wide-Leg Pants",
      size: "M",
      orderedAt: formatShort(daysAgo(7)),
      relative: "last week",
      status: "delivered",
    },
    {
      orderId: "AN-2311",
      productId: "knit-cardigan",
      productName: "Knit Cardigan",
      size: "M",
      orderedAt: formatShort(daysAgo(34)),
      relative: "about a month ago",
      status: "delivered",
    },
    {
      orderId: "AN-2189",
      productId: "silk-camisole",
      productName: "Silk Camisole",
      size: "M",
      orderedAt: formatShort(daysAgo(66)),
      relative: "two months ago",
      status: "delivered",
    },
  ];
}

export const SHOPPER = {
  name: "Maya",
  size: "M",
  shoeSize: "38",
  addresses: [
    { label: "Home — Dizengoff 12", detail: "Dizengoff 12, Tel Aviv", isDefault: true },
    { label: "Work — Rothschild 45", detail: "Rothschild 45, Tel Aviv", isDefault: false },
  ],
  styleProfile:
    "Warm neutrals (cream, terracotta, sage), natural fabrics — especially linen and silk — " +
    "elevated-casual silhouettes. Prefers midi lengths, avoids loud prints and neon.",
  fitProfile:
    "Set up during onboarding about three months ago: Maya uploaded a full-body photo and her " +
    "measurements. Every try-on render — the fitting room and the 'worn by you' looks — is " +
    "generated from that Fit Profile, never from a live camera or guesswork.",
};

