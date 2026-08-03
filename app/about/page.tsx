import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Atelier Nova works — a storefront with no pages",
  description:
    "Every screen in Atelier Nova is generated at runtime by BranderUX from an AI agent's answers: " +
    "the personalized home, the catalog, the fitting room, the checkout. Here's the architecture.",
  alternates: { canonical: "/about" },
};

const FAQ = [
  {
    q: "What is Atelier Nova?",
    a: "A demo fashion storefront with no pages and no frontend code for its screens. The entire site is one BranderUX surface: every screen is generated at runtime from an AI agent's answers.",
  },
  {
    q: "What generates the screens?",
    a: "BranderUX — AI-UX infrastructure that turns an agent into a full branded application. The agent answers in data; BranderUX composes branded, interactive screens from a catalog of certified and custom elements.",
  },
  {
    q: "Is the AI writing code on the fly?",
    a: "No. The screens are composed from pre-built, brand-styled elements (product grid, order panel, fitting room…). The AI decides composition and data; the elements guarantee quality, safety and brand fidelity.",
  },
  {
    q: "What happens when I click something?",
    a: "Every click becomes a new query — clicking a product asks the agent to open its order panel; right-clicking any item lets you ask a question about it. UI and conversation are the same loop.",
  },
  {
    q: "Can I build this for my product?",
    a: "Yes — this repo is a reference integration. The storefront is ~200 lines: a full-screen BranderUX component plus one API route hosting the agent. Everything else is generated.",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: 28,
  color: "#2E241D",
  margin: "48px 0 12px",
};

const body: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.65,
  color: "#4E4136",
  margin: "0 0 14px",
};

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: 860,
        margin: "0 auto",
        padding: "48px 24px 96px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />

      <a href="/" style={{ fontSize: 14, color: "#B4653F", textDecoration: "none" }}>
        ← Back to the store
      </a>

      <h1
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 42,
          lineHeight: 1.1,
          color: "#2E241D",
          margin: "24px 0 16px",
        }}
      >
        This store has no pages.
      </h1>
      <p style={{ ...body, fontSize: 18 }}>
        Every screen you saw — the personalized home, the catalog, the fitting room, the order flow —
        was <strong>generated at runtime by BranderUX</strong> from an AI agent&apos;s answers. There is no
        frontend code for any of those screens. The whole storefront is one component.
      </p>

      <h2 style={sectionTitle}>The architecture</h2>
      <p style={body}>
        The site is a thin Next.js shell: a full-screen <code>&lt;Brander /&gt;</code> component from{" "}
        <a href="https://www.npmjs.com/package/@brander/sdk" style={{ color: "#B4653F" }}>
          @brander/sdk
        </a>{" "}
        plus one API route hosting the agent — a plain Claude call whose system prompt carries the demo
        world: the shopper, her purchase history, the catalog. BranderUX supplies the other half: a
        catalog of brand-styled elements and the runtime that composes them into screens as the agent
        answers. Clicks flow back as new queries, so the UI and the conversation are one loop.
      </p>
      <pre
        style={{
          background: "#2E2A26",
          color: "#F7F1E8",
          borderRadius: 8,
          padding: 18,
          fontSize: 13,
          overflowX: "auto",
        }}
      >
        {`<Brander
  betaKey={TOKEN}
  projectId={PROJECT_ID}
  variant="chat"
  onQueryStream={(params) => sseStream("/api/agent/stream", { params })}
/>`}
      </pre>

      <h2 style={sectionTitle}>What it looks like</h2>
      {[
        {
          src: "/about/home.jpg",
          caption:
            "The home screen: generated on load — campaign hero, six picks, a recommendation that knows what she already owns.",
        },
        {
          src: "/about/fitting-room.jpg",
          caption:
            "The fitting room: an interactive custom element — drag a piece onto her and the figure changes instantly, no AI call.",
        },
        {
          src: "/about/trip-capsule.jpg",
          caption:
            "“I’m flying to Lisbon for four days” → a packing capsule composed around pieces she already owns.",
        },
      ].map((figure) => (
        <figure key={figure.src} style={{ margin: "0 0 28px" }}>
          <img
            src={figure.src}
            alt={figure.caption}
            style={{ width: "100%", borderRadius: 8, border: "1px solid #E4D6C2" }}
          />
          <figcaption style={{ fontSize: 13.5, color: "#8A7B6E", marginTop: 8 }}>
            {figure.caption}
          </figcaption>
        </figure>
      ))}

      <h2 style={sectionTitle}>Questions</h2>
      {FAQ.map((f) => (
        <div key={f.q} style={{ marginBottom: 18 }}>
          <p style={{ ...body, fontWeight: 600, marginBottom: 4, color: "#2E241D" }}>{f.q}</p>
          <p style={body}>{f.a}</p>
        </div>
      ))}

      <h2 style={sectionTitle}>Build one yourself</h2>
      <p style={body}>
        This demo is open source:{" "}
        <a href="https://github.com/BranderUX/atelier-nova" style={{ color: "#B4653F" }}>
          github.com/BranderUX/atelier-nova
        </a>
        . BranderUX — the engine generating everything you saw — is at{" "}
        <a
          href="https://branderux.com?utm_source=atelier-nova&utm_medium=about&utm_campaign=demo"
          style={{ color: "#B4653F" }}
        >
          branderux.com
        </a>
        .
      </p>
    </div>
  );
}
