/**
 * Seeds the "Atelier Nova" BranderUX project directly through the Spring Boot
 * REST API: project + brand settings + flexible-mode settings + custom pages +
 * the nine Nova custom elements (code from brander/elements/, metadata from
 * brander/manifest.mts) + the custom screens (brander/screens.mts). The hosted
 * agent, its data and its home page are seeded by seed-hosted-agent.mts, which
 * `npm run seed` runs right after this script.
 *
 * Usage:
 *   BRANDER_REFRESH_TOKEN=... BRANDER_API_BASE=... npm run seed
 *
 * Env:
 *   BRANDER_REFRESH_TOKEN  preferred; BRANDER_COOKIE ('auth_token=...') also works
 *   BRANDER_API_BASE       default http://localhost:8080/api/v1 (point at prod to promote)
 *   SITE_URL               default https://nova.branderux.app, the origin serving /products images
 *   PROJECT_ID             optional, seed into an existing project instead of the by-name lookup
 *
 * Idempotent: re-running updates the project in place and appends new element
 * versions rather than duplicating elements.
 */

import { readFile } from "node:fs/promises";
import { FLEXIBLE_MODE_RULES } from "../brander/data/entities.mts";
import { ELEMENTS } from "../brander/manifest.mts";
import { CUSTOM_SCREENS } from "../brander/screens.mts";
import { createApi, resolveCookie, stable, withSite } from "./lib/api.mts";

const PROJECT_NAME = "Atelier Nova";

const api = createApi(await resolveCookie());

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
  flexibleModeRules: FLEXIBLE_MODE_RULES,
};

interface ProjectResponse {
  id: string;
  name: string;
  settings?: Record<string, unknown> | null;
}

/** PATCH replaces `settings` wholesale, so merge over what the project holds (elementVisibility, ...). */
async function updateProject(id: string, body: Record<string, unknown>): Promise<ProjectResponse> {
  const current = await api<ProjectResponse>(`/projects/${id}`);
  return api<ProjectResponse>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ ...body, settings: { ...(current.settings ?? {}), ...PROJECT_SETTINGS } }),
  });
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
      "Atelier Nova, the demo storefront of the full agentic-app example (github.com/BranderUX/atelier-nova).",
    brandSettings: BRAND_SETTINGS,
    settings: PROJECT_SETTINGS,
  };

  const explicitId = process.env.PROJECT_ID;
  if (explicitId) {
    const updated = await updateProject(explicitId, body);
    console.warn(`~ Updated existing project ${explicitId}`);
    return updated;
  }

  const projects = await api<ProjectResponse[]>(`/projects`);
  const existing = projects.find((p) => p.name === PROJECT_NAME);
  if (existing) {
    const updated = await updateProject(existing.id, body);
    console.warn(`~ Updated existing project ${existing.id}`);
    return updated;
  }

  const created = await api<ProjectResponse>(`/projects`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  console.warn(`+ Created project ${created.id}`);
  return created;
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
      console.warn(`~ ${seed.name}: appended v${appended.version} (element ${match.id})`);
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
      console.warn(`+ ${seed.name}: created as ${created.elementKey} (element ${created.id})`);
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
  console.warn(`~ Seeded ${screens.length} custom screens (element versions pinned to current)`);
}

const project = await upsertProject();
await seedElements(project.id);
await seedScreens(project.id);

console.warn("\nDone. Wire the storefront with:");
console.warn(`  NEXT_PUBLIC_BRANDER_PROJECT_ID=${project.id}`);
console.warn("  NEXT_PUBLIC_BRANDER_API_KEY=<a bux_pk_ key whose allowed origins include this site>");
console.warn("Then seed the hosted agent: npm run seed:agent");
