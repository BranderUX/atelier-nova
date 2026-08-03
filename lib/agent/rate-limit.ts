import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Public-demo guardrails: per-IP sliding window + a global daily cap on LLM
 * calls (the canned home is never counted — most visits cost nothing). With no
 * Upstash env configured (local dev), everything passes.
 */

const PER_IP_LIMIT = 10; // LLM queries per IP per minute
const DAILY_GLOBAL_LIMIT = Number(process.env.AGENT_DAILY_LIMIT || 1500);

const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasUpstash ? Redis.fromEnv() : null;
const perIpLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(PER_IP_LIMIT, "60 s"), prefix: "nova:ip" })
  : null;

export interface RateVerdict {
  allowed: boolean;
  reason?: "ip" | "daily";
}

export async function checkRateLimit(ip: string): Promise<RateVerdict> {
  if (!redis || !perIpLimiter) return { allowed: true };

  const { success } = await perIpLimiter.limit(ip);
  if (!success) return { allowed: false, reason: "ip" };

  const day = new Date().toISOString().slice(0, 10);
  const dailyKey = `nova:daily:${day}`;
  const count = await redis.incr(dailyKey);
  if (count === 1) await redis.expire(dailyKey, 60 * 60 * 26);
  if (count > DAILY_GLOBAL_LIMIT) return { allowed: false, reason: "daily" };

  return { allowed: true };
}
