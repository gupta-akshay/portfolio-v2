import type { NextRequest } from 'next/server';
import requestIp from 'request-ip';

// Per-instance in-memory rate limit. Does NOT coordinate across
// serverless instances — sufficient for casual abuse, not DDoS.

type Bucket = { count: number; resetAt: number };

const MAX_KEYS = 10_000;
const store = new Map<string, Bucket>();
let lastSweep = 0;

function sweep(now: number): void {
  if (now - lastSweep < 60_000 && store.size < MAX_KEYS) return;
  lastSweep = now;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
  if (store.size >= MAX_KEYS) {
    const extras = store.size - MAX_KEYS;
    let dropped = 0;
    for (const key of store.keys()) {
      if (dropped >= extras) break;
      store.delete(key);
      dropped++;
    }
  }
}

interface Options {
  id: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSec: number;
  remaining: number;
  limit: number;
}

function getIp(req: NextRequest): string {
  const fake = {
    headers: Object.fromEntries(req.headers) as Record<string, string>,
  };
  return requestIp.getClientIp(fake) || '127.0.0.1';
}

export function rateLimit(
  req: NextRequest,
  { id, limit, windowMs }: Options,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const ip = getIp(req);
  const key = `${id}:${ip}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0, remaining: limit - 1, limit };
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0,
      limit,
    };
  }

  existing.count += 1;
  return {
    ok: true,
    retryAfterSec: 0,
    remaining: limit - existing.count,
    limit,
  };
}
