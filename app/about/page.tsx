import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Atelier Nova works, a storefront with no pages",
  description:
    "Every screen in Atelier Nova is generated live by the agent BranderUX hosts for the store: " +
    "the home, the catalog, the fitting room, the order flow. Here is how it is put together.",
  alternates: { canonical: "/about" },
};

const FAQ = [
  {
    q: "What is Atelier Nova?",
    a: "A demo womenswear store with no pages and no frontend code for its screens. The whole store is one BranderUX surface, and every screen is generated live from the question you just asked.",
  },
  {
    q: "What generates the screens?",
    a: "BranderUX. The store was described in the BranderUX builder and published, and the agent BranderUX hosts for it answers here. The answer arrives as data; BranderUX composes it into branded, interactive screens from certified and custom elements.",
  },
  {
    q: "Is the AI writing code on the fly?",
    a: "No. Screens compose from pre-built, brand-styled elements: the product grid, the order panel, the fitting room. The agent decides the composition and the data; the elements keep quality, safety and brand fidelity.",
  },
  {
    q: "What happens when I click something?",
    a: "Every click becomes the next question. Clicking a product asks for its order panel, right-clicking anything lets you ask about it. Real actions are never taken for you: placing the order is a click you make, and it writes a real order with its own number.",
  },
  {
    q: "Can I build this for my business?",
    a: "Yes, without writing the store. Describe your business in the BranderUX builder, publish, and your full site and MCP app are live. This repo is only the shell: the storefront is one component in a Next.js app, and everything you saw is generated. Businesses that already have an agent of their own connect it instead, with one prop.",
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

const FIGURES = [
  {
    src: "/about/home.jpg",
    caption:
      "The home screen, designed once and replayed on every landing: instant, and the same every time, with no model call.",
  },
  {
    src: "/about/fitting-room.jpg",
    caption:
      "The fitting room, a custom element: drag a piece onto the figure and it changes at once, with no model call.",
  },
  {
    src: "/about/trip-capsule.jpg",
    caption:
      "“I’m flying to Lisbon for four days” becomes a packing capsule composed around pieces already in the wardrobe.",
  },
];

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

const link: React.CSSProperties = { color: "#B4653F" };

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
        Every screen you saw, the home, the catalog, the fitting room, the order flow, was{" "}
        <strong>generated live</strong>: built at the moment of your question, in the brand. There is
        no frontend code for any of them. The whole storefront is one component.
      </p>

      <h2 style={sectionTitle}>The architecture</h2>
      <p style={body}>
        Atelier Nova is an agentic application built on BranderUX. Its catalog, its orders, its voice
        and its rules live in a BranderUX project, and the agent BranderUX hosts for that project
        answers every question with a branded, interactive screen composed from certified and custom
        elements. The site around it is a thin Next.js shell whose store surface is one{" "}
        <code>&lt;Brander /&gt;</code> component from{" "}
        <a href="https://www.npmjs.com/package/@brander/sdk" style={link}>
          @brander/sdk
        </a>
        . There is no agent here, no model key, no prompt. Clicks are questions, so the interface and
        the conversation are one loop.
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
  apiKey={API_KEY}
  projectId={PROJECT_ID}
  variant="chat"
  isFullscreen
/>`}
      </pre>
      <p style={body}>That is the entire integration.</p>

      <h2 style={sectionTitle}>Generated live, not built once</h2>
      <p style={body}>
        App builders generate pages once, the same app for everyone. A BranderUX application is
        generated live: every screen built at the moment of the question, with the right UX for that
        user and that action. And it publishes two-sided, a full site for people, an MCP app for AI
        agents.
      </p>

      <h2 style={sectionTitle}>By the owner&apos;s rules</h2>
      <p style={body}>
        Your website talks with your clients, by your rules. The AI can never act alone: every real
        action is a click the visitor makes. Placing an order here writes a real order and returns
        its number, &quot;Track my order&quot; reads it back, and the owner sees every conversation
        and every order in the BranderUX dashboard.
      </p>

      <h2 style={sectionTitle}>What it looks like</h2>
      {FIGURES.map((figure) => (
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
        This shell is open source:{" "}
        <a href="https://github.com/BranderUX/atelier-nova" style={link}>
          github.com/BranderUX/atelier-nova
        </a>
        . BranderUX, the platform Atelier Nova is built and hosted on, is at{" "}
        <a
          href="https://branderux.com?utm_source=atelier-nova&utm_medium=about&utm_campaign=demo"
          style={link}
        >
          branderux.com
        </a>
        . Build agentic applications, in minutes.
      </p>
    </div>
  );
}
