export const dynamic = "force-dynamic";

/** Deploy identity: which commit is serving, so fixes are verifiable. */
export function GET(): Response {
  return Response.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    ok: true,
  });
}
