/**
 * Seeds the HOSTED AGENT of the "Atelier Nova" BranderUX project through the
 * Spring Boot REST API: the two data entities and their records, the persona
 * and policies, and the designed home page. Runs after seed-brander-project.mts
 * (which owns the project, brand, settings, elements and screens).
 *
 * Usage:
 *   BRANDER_REFRESH_TOKEN=... BRANDER_API_BASE=... npm run seed:agent
 *   npm run seed:agent -- --refresh-orders   # re-date the three past orders relative to today
 *
 * Env:
 *   BRANDER_REFRESH_TOKEN  preferred; BRANDER_COOKIE ('auth_token=...') also works
 *   BRANDER_API_BASE       default http://localhost:8080/api/v1 (point at prod to promote)
 *   SITE_URL               default https://nova.branderux.app, the origin serving /products images
 *   PROJECT_ID             optional, seed into an existing project instead of the by-name lookup
 *
 * Idempotent: entity definitions and the agent config are upserted; records are
 * inserted only when the entity is empty (there is no delete endpoint, so a
 * blind re-run would duplicate rows).
 */

import { buildProductRows } from "../brander/data/catalog.mts";
import { AGENT_POLICIES, ORDERS_ENTITY, PRODUCTS_ENTITY } from "../brander/data/entities.mts";
import { buildHomeScreen } from "../brander/data/home-screen.mts";
import { buildPersona } from "../brander/data/persona.mts";
import { buildOrderRows } from "../brander/data/world.mts";
import { createApi, findProjectId, resolveCookie, SITE_URL } from "./lib/api.mts";

const PROJECT_NAME = "Atelier Nova";
const REFRESH_ORDERS = process.argv.includes("--refresh-orders");

interface RecordsPage {
  rows: Array<Record<string, unknown> & { _id: string }>;
  /** The size of THIS page, not the entity total. */
  count: number;
}

const PAGE = 50;

/** "N" or "50 or more": the endpoint pages, it does not count. */
function describeCount(page: RecordsPage): string {
  return page.count >= PAGE ? `${PAGE} or more` : String(page.count);
}

interface AgentConfig {
  enabled?: boolean;
  persona?: string;
  policies?: Record<string, unknown>;
  homeScreen?: Record<string, unknown> | null;
}

const api = createApi(await resolveCookie());
const projectId = await findProjectId(api, PROJECT_NAME);
if (!projectId) {
  console.error(`No project named "${PROJECT_NAME}". Run npm run seed first, or set PROJECT_ID.`);
  process.exit(1);
}

async function defineEntity(entity: typeof PRODUCTS_ENTITY | typeof ORDERS_ENTITY): Promise<void> {
  await api(`/projects/${projectId}/entities/${entity.name}`, {
    method: "PUT",
    body: JSON.stringify({
      jsonSchema: entity.jsonSchema,
      accessPolicy: entity.accessPolicy,
      writePolicy: entity.writePolicy,
    }),
  });
  console.warn(`= entity ${entity.name} (${entity.writePolicy === "none" ? "read-only" : "writable"})`);
}

async function seedRecords(entityName: string, rows: unknown[]): Promise<void> {
  const page = await api<RecordsPage>(`/projects/${projectId}/entities/${entityName}/records?limit=${PAGE}`);
  if (page.count > 0) {
    console.warn(
      `= ${entityName}: already holds ${describeCount(page)} records, skipped (delete them in the Agent tab, Data, to reseed)`
    );
    return;
  }
  const result = await api<{ inserted: number; totalRecords: number }>(
    `/projects/${projectId}/entities/${entityName}/records/bulk`,
    { method: "POST", body: JSON.stringify({ rows }) }
  );
  console.warn(`+ ${entityName}: inserted ${result.inserted} records (${result.totalRecords} total)`);
}

/**
 * Re-date the three known past orders so "last week" stays last week. The
 * records endpoint pages without a filter, so once visitors have placed many
 * orders the seeded three may fall outside the first page: the script then
 * says so and fails, never "re-dated 0" with a green exit.
 */
async function refreshOrders(): Promise<void> {
  const page = await api<RecordsPage>(`/projects/${projectId}/entities/orders/records?limit=${PAGE}`);
  const fresh = new Map(buildOrderRows().map((row) => [row.orderNumber, row]));
  const missing = new Set(fresh.keys());
  for (const record of page.rows) {
    const row = fresh.get(String(record.orderNumber));
    if (!row) continue;
    await api(`/projects/${projectId}/entities/orders/records/${record._id}`, {
      method: "PATCH",
      body: JSON.stringify({ fields: { placedAt: row.placedAt, arrivalDate: row.arrivalDate } }),
    });
    missing.delete(row.orderNumber);
  }
  if (missing.size > 0) {
    console.error(
      `orders: ${[...missing].join(", ")} not in the first ${PAGE} records; re-date them in the Agent tab, Data`
    );
    process.exit(1);
  }
  console.warn(`~ orders: re-dated ${fresh.size} past orders relative to today`);
}

async function upsertAgent(): Promise<void> {
  const current = (await api<AgentConfig | null>(`/projects/${projectId}/agent-config`)) ?? {};
  // The endpoint replaces the policy bag, so merge key by key first.
  const policies = { ...(current.policies ?? {}), ...AGENT_POLICIES };
  const home = buildHomeScreen(SITE_URL);
  await api(`/projects/${projectId}/agent-config`, {
    method: "PUT",
    body: JSON.stringify({
      enabled: true,
      persona: buildPersona(),
      policies,
      homeScreen: home,
    }),
  });
  console.warn(`= agent config: enabled, persona ${buildPersona().length} chars, home on ${home.screenId}`);
}

await defineEntity(PRODUCTS_ENTITY);
await defineEntity(ORDERS_ENTITY);
await seedRecords("products", buildProductRows(SITE_URL));
await seedRecords("orders", buildOrderRows());
if (REFRESH_ORDERS) await refreshOrders();
await upsertAgent();

const config = await api<AgentConfig | null>(`/projects/${projectId}/agent-config`);
const products = await api<RecordsPage>(`/projects/${projectId}/entities/products/records?limit=${PAGE}`);
const orders = await api<RecordsPage>(`/projects/${projectId}/entities/orders/records?limit=${PAGE}`);
console.warn(
  `\nDone: agent ${config?.enabled ? "enabled" : "DISABLED"}, ${describeCount(products)} products, ` +
    `${describeCount(orders)} orders, home screen ${config?.homeScreen ? "set" : "MISSING"}.`
);
