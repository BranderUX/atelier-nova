import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nova.branderux.com";

// [LEV: marketing copy — title/description wording is yours to finalize]
const TITLE = "Atelier Nova — a storefront generated live by BranderUX";
const DESCRIPTION =
  "Atelier Nova has no pages. Every screen — home, catalog, try-on, checkout — is generated at " +
  "runtime by BranderUX from an AI agent's answers. A complete, open-source example of an " +
  "agentic application.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "generative UI",
    "agentic commerce",
    "AI generated storefront",
    "runtime UI generation",
    "BranderUX",
    "AI UX infrastructure",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/icon.png" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Atelier Nova",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Atelier Nova — generated live by BranderUX" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Atelier Nova",
  url: SITE_URL,
  description: DESCRIPTION,
  creator: {
    "@type": "Organization",
    name: "BranderUX",
    url: "https://branderux.com",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100dvh",
          background: "#F1E8DC",
        }}
      >
        {/* Fast perceived first paint: the canned home's hero image starts downloading immediately */}
        <link rel="preload" as="image" href="/products/hero-summer-edit.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        {children}
      </body>
    </html>
  );
}
