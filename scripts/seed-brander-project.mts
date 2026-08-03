/**
 * Seeds the "Atelier Nova" BranderUX project directly through the Spring Boot
 * REST API: project + brand settings + flexible-mode settings + custom pages +
 * the six Nova custom elements (code from brander/elements/, metadata from
 * brander/manifest.mts). No Vibe Studio, no billed extract pass.
 *
 * Usage:
 *   BRANDER_COOKIE='SESSION=…' npm run seed
 *
 * Env:
 *   BRANDER_COOKIE    required — the session cookie of a signed-in BranderUX user
 *   BRANDER_API_BASE  default http://localhost:8080/api/v1 (point at prod to promote)
 *   SITE_URL          default http://localhost:3001 — origin serving /products images
 *   PROJECT_ID        optional — seed into an existing project instead of by-name lookup
 *
 * Idempotent: re-running updates the project in place and appends new element
 * versions rather than duplicating elements.
 */

import { readFile } from "node:fs/promises";
import { ELEMENTS } from "../brander/manifest.mts";
import { CUSTOM_SCREENS } from "../brander/screens.mts";

const API_BASE = process.env.BRANDER_API_BASE || "http://localhost:8080/api/v1";
const SITE_URL = (process.env.SITE_URL || "http://localhost:3001").replace(/\/$/, "");
const PROJECT_NAME = "Atelier Nova";

/**
 * Auth: prefer a long-lived refresh token (BRANDER_REFRESH_TOKEN) — the script
 * mints a fresh 1h access token via POST /auth/refresh. BRANDER_COOKIE
 * ('auth_token=…') still works for one-off runs.
 */
async function resolveCookie(): Promise<string> {
  const refresh = process.env.BRANDER_REFRESH_TOKEN;
  if (refresh) {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `refresh_token=${refresh}` },
    });
    if (!response.ok) {
      console.error(`auth refresh failed: ${response.status} ${(await response.text()).slice(0, 200)}`);
      process.exit(1);
    }
    const setCookies = response.headers.getSetCookie();
    const authCookie = setCookies
      .find((c) => c.startsWith("auth_token="))
      ?.split(";")[0];
    if (!authCookie) {
      console.error("auth refresh succeeded but no auth_token cookie in response");
      process.exit(1);
    }
    return authCookie;
  }
  if (process.env.BRANDER_COOKIE) return process.env.BRANDER_COOKIE;
  console.error("Set BRANDER_REFRESH_TOKEN (preferred) or BRANDER_COOKIE ('auth_token=…').");
  process.exit(1);
}

const COOKIE = await resolveCookie();

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Cookie: COOKIE,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${init?.method || "GET"} ${path} → ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.status === 204 ? (null as T) : ((await response.json()) as T);
}

const iconPng = await readFile(new URL("../public/brand/icon.png", import.meta.url));

const BRAND_SETTINGS = {
  brandName: "ATELIER NOVA",
  primaryColor: "#C06B4A",
  secondaryColor: "#97A883",
  accentColor: "#C9A46A",
  iconUrl: `data:image/png;base64,${iconPng.toString("base64")}`,
  fontStyle: { displayName: "classic", fontFamily: "'Times New Roman', serif", weight: 400 },
  layoutStyle: { displayName: "spacious", spacing: 4, elevation: 2 },
  borderRadius: 4,
  shadowIntensity: 2,
  darkMode: false,
  grayPalette: {
    gray50: "#FAF6EF",
    gray100: "#F1E8DC",
    gray200: "#E4D6C2",
    gray300: "#CDBBA4",
    gray400: "#A8977F",
    gray500: "#8A7B6E",
    gray600: "#5C4F43",
    gray700: "#3B2E25",
  },
  primaryTextColor: "#2E241D",
  secondaryTextColor: "#5C4F43",
  tertiaryTextColor: "#8A7B6E",
  backgroundColor: "#F1E8DC",
  secondaryBackgroundColor: "#FAF6EF",
};

const PROJECT_SETTINGS = {
  uiGenerationMode: "flexible",
  enableQueryEnhancement: true,
  autoQueryFirstPage: true,
  elementStyleVariant: "modern",
  customPages: [
    { id: "page-home", name: "Home", query: "Show home page" },
    { id: "page-new-in", name: "New In", query: "Show me what's new in" },
    { id: "page-dresses", name: "Dresses", query: "Show me all dresses" },
    { id: "page-knitwear", name: "Knitwear", query: "Show me the knitwear collection" },
    { id: "page-sale", name: "Sale", query: "Show me what's on sale" },
  ],
  flexibleModeRules: [
    "This is the ATELIER NOVA storefront — compose screens like an elegant fashion e-commerce site.",
    "Home page: the Nova Hero beside a Nova Product Grid of SIX picks (columns: 3) — badge ONLY the most recommended item, always with a personal badgeReason, and give it the shopper's size chip.",
    "Category pages (New In, Dresses, Knitwear, Sale): a short header, then ONE Nova Product Grid. Show sale prices via salePrice.",
    "Opening/buying a specific product: a Nova Order Panel (her size preselected, default address, arrival promise) — ALWAYS with completeTheLook filled with 2–4 genuinely pairing pieces and a personal note.",
    "Care, fit or styling questions about a product: the Nova Stylist Note AND that product's Nova Order Panel side by side on the SAME screen — the answer and the buy belong together.",
    "Right after an order is placed: show ONLY a Nova Order Confirmed.",
    "Occasion or event requests: a header naming the occasion, a Nova Product Grid of the matching pieces, and a Nova Complete Look bundle with a bundleNote explaining the reasoning.",
    "Trip or packing requests: a short header naming the trip, then ONE Nova Look Board (3–4 looks; pieces she owns marked owned and unpriced; gap pieces priced; contextNote = the arrives-before-your-flight promise). No product grid on trip screens.",
    "Try-on requests ('see it on me'): ONLY a Nova Fitting Room element, with EXACTLY the pre-rendered figureMap/bases/layers supplied in the agent's context — never invented combinations.",
    "End EVERY screen with a Nova Suggestions row: 2–4 short follow-ups contextual to what the screen shows (e.g. on an order panel: 'Three ways to wear it', 'Will it shrink?'; on a confirmation: 'Track my order', 'Keep shopping'). Never generic, always tappable next steps.",
    "Keep layouts calm and editorial — at most three content blocks per screen (the suggestions row does not count). Always use absolute image URLs supplied in the context.",
  ].join(" "),
};

interface ProjectResponse {
  id: string;
  name: string;
}

interface ElementResponse {
  id: string;
  elementKey: string;
  name: string;
  currentVersion: number;
  currentVersionPayload: {
    code: string;
    skeletonCode: string | null;
    propsSchema: Record<string, unknown> | null;
    defaultProps: Record<string, unknown> | null;
    structurePrompt: string | null;
    clickQueryTemplate: string | null;
  } | null;
}

async function upsertProject(): Promise<ProjectResponse> {
  const body = {
    name: PROJECT_NAME,
    description:
      "Atelier Nova — demo storefront for the full agentic-app example (github.com/BranderUX/atelier-nova).",
    brandSettings: BRAND_SETTINGS,
    settings: PROJECT_SETTINGS,
  };

  const explicitId = process.env.PROJECT_ID;
  if (explicitId) {
    const updated = await api<ProjectResponse>(`/projects/${explicitId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    console.warn(`↻ Updated existing project ${explicitId}`);
    return updated;
  }

  const projects = await api<ProjectResponse[]>(`/projects`);
  const existing = projects.find((p) => p.name === PROJECT_NAME);
  if (existing) {
    const updated = await api<ProjectResponse>(`/projects/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    console.warn(`↻ Updated existing project ${existing.id}`);
    return updated;
  }

  const created = await api<ProjectResponse>(`/projects`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  console.warn(`✚ Created project ${created.id}`);
  return created;
}

function withSite(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value).replaceAll("__SITE__", SITE_URL));
}

/** Key-order-independent serialization — the server's JSONB storage reorders object keys. */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

async function seedElements(projectId: string): Promise<void> {
  const existing = await api<ElementResponse[]>(
    `/projects/${projectId}/elements?includeDrafts=true`
  );

  for (const seed of ELEMENTS) {
    const code = await readFile(new URL(`../brander/elements/${seed.file}`, import.meta.url), "utf8");
    const skeletonCode = await readFile(
      new URL(`../brander/elements/skeletons/${seed.file}`, import.meta.url),
      "utf8"
    ).catch(() => null);
    const version = {
      code,
      skeletonCode,
      prompt: "Hand-authored for the Atelier Nova demo (seeded via API).",
      propsSchema: seed.propsSchema,
      defaultProps: withSite(seed.defaultProps),
      toolSchema: { description: seed.description, input_schema: seed.propsSchema },
      structurePrompt: seed.structurePrompt,
      clickQueryTemplate: seed.clickQueryTemplate,
      interactionPropName: seed.interactionPropName,
      rightClickPropName: null,
      clickArgIsObject: true,
      extractionStatus: "succeeded",
    };

    const match = existing.find((e) => e.elementKey === seed.key || e.name === seed.name);
    const unchanged =
      match?.currentVersionPayload &&
      match.currentVersionPayload.code === version.code &&
      (match.currentVersionPayload.skeletonCode ?? null) === version.skeletonCode &&
      stable(match.currentVersionPayload.propsSchema) === stable(version.propsSchema) &&
      stable(match.currentVersionPayload.defaultProps) === stable(version.defaultProps) &&
      match.currentVersionPayload.structurePrompt === version.structurePrompt &&
      match.currentVersionPayload.clickQueryTemplate === version.clickQueryTemplate;
    if (match && unchanged) {
      console.warn(`= ${seed.name}: unchanged (v${match.currentVersion})`);
      continue;
    }
    if (match) {
      const appended = await api<{ version: number }>(
        `/projects/${projectId}/elements/${match.id}/versions`,
        { method: "POST", body: JSON.stringify(version) }
      );
      await api(`/projects/${projectId}/elements/${match.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "published", description: seed.description, iconName: seed.iconName, category: seed.category }),
      });
      console.warn(`↻ ${seed.name}: appended v${appended.version} (element ${match.id})`);
    } else {
      const created = await api<ElementResponse>(`/projects/${projectId}/elements`, {
        method: "POST",
        body: JSON.stringify({
          name: seed.name,
          description: seed.description,
          category: seed.category,
          iconName: seed.iconName,
          status: "published",
          version,
        }),
      });
      console.warn(`✚ ${seed.name}: created as ${created.elementKey} (element ${created.id})`);
    }
  }
}

/** Screens pin the CURRENT version of each element, resolved after element seeding. */
async function seedScreens(projectId: string): Promise<void> {
  const elements = await api<ElementResponse[]>(
    `/projects/${projectId}/elements?includeDrafts=true`
  );
  const versionByKey = new Map(elements.map((e) => [e.elementKey, e.currentVersion]));

  const screens = CUSTOM_SCREENS.map((s) => {
    const pin = (els: typeof s.elements) =>
      els.map((el) =>
        el.customElementId
          ? { ...el, version: versionByKey.get(el.customElementId) ?? el.version }
          : el
      );
    const elementsPinned = pin(s.elements);
    return { ...s, elements: elementsPinned, config: { ...s.config, elements: elementsPinned } };
  });

  await api(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify({ customScreens: screens }),
  });
  console.warn(`↻ Seeded ${screens.length} custom screens (element versions pinned to current)`);
}

const project = await upsertProject();
await seedElements(project.id);
await seedScreens(project.id);

console.warn("\nDone. Wire the storefront with:");
console.warn(`  NEXT_PUBLIC_BRANDER_PROJECT_ID=${project.id}`);
console.warn("  NEXT_PUBLIC_BRANDER_TOKEN=<a bux_ beta/API key valid on this environment>");
