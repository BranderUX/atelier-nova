/**
 * Shared plumbing for the seed scripts: the Spring API base, the site origin
 * that serves /public, cookie auth from a refresh token, a JSON fetch helper
 * and two small utilities.
 */

export const API_BASE = process.env.BRANDER_API_BASE || "http://localhost:8080/api/v1";
export const SITE_URL = (process.env.SITE_URL || "https://nova.branderux.app").replace(/\/$/, "");

/**
 * Auth: prefer a long-lived refresh token (BRANDER_REFRESH_TOKEN), which mints
 * a fresh 1h access token via POST /auth/refresh. BRANDER_COOKIE
 * ('auth_token=...') still works for one-off runs.
 */
export async function resolveCookie(): Promise<string> {
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
    const authCookie = response.headers
      .getSetCookie()
      .find((c) => c.startsWith("auth_token="))
      ?.split(";")[0];
    if (!authCookie) {
      console.error("auth refresh succeeded but no auth_token cookie in response");
      process.exit(1);
    }
    return authCookie;
  }
  if (process.env.BRANDER_COOKIE) return process.env.BRANDER_COOKIE;
  console.error("Set BRANDER_REFRESH_TOKEN (preferred) or BRANDER_COOKIE ('auth_token=...').");
  process.exit(1);
}

export type Api = <T>(path: string, init?: RequestInit) => Promise<T>;

/** A JSON fetch bound to the session cookie; throws on any non-2xx. */
export function createApi(cookie: string): Api {
  return async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        Cookie: cookie,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${init?.method || "GET"} ${path} -> ${response.status}: ${body.slice(0, 500)}`);
    }
    return response.status === 204 ? (null as T) : ((await response.json()) as T);
  };
}

/** Replace the __SITE__ placeholder in element defaultProps with the real origin. */
export function withSite(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value).replaceAll("__SITE__", SITE_URL));
}

/** Key-order-independent serialization: the server's JSONB storage reorders object keys. */
export function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stable(v)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

interface ProjectSummary {
  id: string;
  name: string;
}

/** The project id: PROJECT_ID, else the project named `name` (null when absent). */
export async function findProjectId(api: Api, name: string): Promise<string | null> {
  const explicit = process.env.PROJECT_ID;
  if (explicit) return explicit;
  const projects = await api<ProjectSummary[]>(`/projects`);
  return projects.find((p) => p.name === name)?.id ?? null;
}
