"use client";

import { useEffect, useState } from "react";
import { Brander, sseStream } from "@brander/sdk";

const BRANDER_TOKEN = process.env.NEXT_PUBLIC_BRANDER_TOKEN || "";
const BRANDER_PROJECT_ID = process.env.NEXT_PUBLIC_BRANDER_PROJECT_ID || "";

/**
 * The whole site is one full-screen Brander surface. Every screen — home,
 * store sections, order flow, occasion edits — is generated at runtime by
 * BranderUX from the agent's answers (see /api/agent/stream).
 *
 * Brander mounts client-side only: the SDK resolves its embed origin from
 * window.location at module scope, so an SSR-prerendered iframe would bake in
 * the production fallback URL (React hydration keeps server-rendered
 * attributes even when the client would compute a different one).
 */
export default function AtelierNovaPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main style={{ width: "100vw", height: "100dvh", overflow: "hidden", position: "relative" }}>
      {mounted ? (
        <Brander
          betaKey={BRANDER_TOKEN}
          projectId={BRANDER_PROJECT_ID}
          variant="chat"
          isFullscreen
          width="100%"
          height="100%"
          onQueryStream={(params) => sseStream("/api/agent/stream", { params })}
        />
      ) : null}
      {/* Attribution badge — server-rendered (crawlable backlink), always visible.
          [LEV: badge wording is yours to finalize] */}
      <a
        href="https://branderux.com?utm_source=atelier-nova&utm_medium=badge&utm_campaign=demo"
        target="_blank"
        rel="noopener"
        style={{
          position: "fixed",
          left: 14,
          bottom: 14,
          zIndex: 50,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 12px",
          borderRadius: 999,
          background: "rgba(46, 42, 38, 0.85)",
          color: "#F7F1E8",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 12.5,
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          backdropFilter: "blur(6px)",
        }}
      >
        <span aria-hidden style={{ fontSize: 11 }}>✦</span>
        Generated live by BranderUX
      </a>
      <a
        href="/about"
        style={{
          position: "fixed",
          right: 14,
          bottom: 14,
          zIndex: 50,
          padding: "7px 12px",
          borderRadius: 999,
          background: "rgba(251, 244, 233, 0.9)",
          color: "#3B2E25",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 12.5,
          textDecoration: "none",
          border: "1px solid rgba(62,47,40,0.15)",
        }}
      >
        How this works
      </a>
    </main>
  );
}
