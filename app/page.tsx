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
    <main className="nova-main" style={{ width: "100vw", height: "100dvh", overflow: "hidden", position: "relative" }}>
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
      {/* Attribution badges — server-rendered (crawlable backlink), always visible.
          Desktop: floating corner pills. Mobile: their own strip below the embed
          (the surface shrinks by the strip height, so nothing overlaps the composer). */}
      <div className="nova-badges">
        <a
          className="nova-attr"
          href="https://branderux.com?utm_source=atelier-nova&utm_medium=badge&utm_campaign=demo"
          target="_blank"
          rel="noopener"
        >
          <span aria-hidden style={{ fontSize: 11 }}>✦</span>
          Generated live by BranderUX
        </a>
        <a className="nova-how" href="/about">
          How this works
        </a>
      </div>
      <style>{`
        .nova-badges { display: contents; }
        .nova-attr, .nova-how {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 12.5px;
          text-decoration: none;
          border-radius: 999px;
          padding: 7px 12px;
          z-index: 50;
        }
        .nova-attr {
          position: fixed;
          left: 14px;
          bottom: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(46, 42, 38, 0.85);
          color: #F7F1E8;
          box-shadow: 0 4px 16px rgba(0,0,0,0.25);
          backdrop-filter: blur(6px);
        }
        .nova-how {
          position: fixed;
          right: 14px;
          bottom: 14px;
          background: rgba(251, 244, 233, 0.9);
          color: #3B2E25;
          border: 1px solid rgba(62,47,40,0.15);
        }
        @media (max-width: 767px) {
          .nova-main { height: calc(100dvh - 38px - env(safe-area-inset-bottom)) !important; }
          .nova-badges {
            display: flex;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: calc(38px + env(safe-area-inset-bottom));
            padding: 0 12px env(safe-area-inset-bottom);
            align-items: center;
            justify-content: space-between;
            background: #F1E8DC;
            border-top: 1px solid rgba(62,47,40,0.08);
            z-index: 50;
          }
          .nova-attr, .nova-how {
            position: static;
            font-size: 11px;
            padding: 4px 10px;
            box-shadow: none;
            backdrop-filter: none;
          }
          .nova-attr { gap: 5px; }
        }
      `}</style>
    </main>
  );
}
