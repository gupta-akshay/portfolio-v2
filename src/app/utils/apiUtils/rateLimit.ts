import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import requestIp from 'request-ip';

// Upstash Redis client
let redis: Redis | null = null;

// Initialize Redis client only if environment variables are present
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    console.warn(
      'Upstash Redis not available, falling back to in-memory storage'
    );
  }
}

// Fallback in-memory storage for development
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function rateLimit(
  req: NextRequest,
  limit: number = 5, // Max 5 requests
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
  // Convert NextRequest to request-ip compatible format
  const adaptedReq = {
    headers: Object.fromEntries(req.headers.entries()),
    connection: { remoteAddress: undefined },
    socket: { remoteAddress: undefined },
  };

  const ip = requestIp.getClientIp(adaptedReq) || '127.0.0.1';

  const now = Date.now();
  const windowSeconds = Math.floor(windowMs / 1000);

  // Create a fixed window key based on current time window
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `rate_limit:${ip}:${windowStart}`;

  try {
    if (redis) {
      // Use Upstash Redis for production with fixed window approach
      // Get current count
      const current = await redis.get(key);
      const currentCount = current
        ? typeof current === 'number'
          ? current
          : parseInt(current.toString(), 10)
        : 0;

      // Check if limit exceeded before incrementing
      if (currentCount >= limit) {
        const resetTime = windowStart + windowMs;
        return {
          success: false,
          limit,
          remaining: 0,
          reset: resetTime,
        };
      }

      // Increment count and set expiration only if key doesn't exist
      const pipe = redis.pipeline();
      pipe.incr(key);
      pipe.expire(key, windowSeconds);
      const results = await pipe.exec();

      const newCount = results[0] as number;
      const resetTime = windowStart + windowMs;

      return {
        success: true,
        limit,
        remaining: limit - newCount,
        reset: resetTime,
      };
    } else {
      // Fallback to in-memory storage (development)
      let rateLimitEntry = rateLimitMap.get(key);

      if (!rateLimitEntry) {
        rateLimitEntry = { count: 0, lastReset: windowStart };
        rateLimitMap.set(key, rateLimitEntry);
      }

      // Reset if window has passed (shouldn't happen with fixed window key, but keep for safety)
      if (now - rateLimitEntry.lastReset > windowMs) {
        rateLimitEntry.count = 0;
        rateLimitEntry.lastReset = windowStart;
      }

      // Check if limit exceeded
      if (rateLimitEntry.count >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: rateLimitEntry.lastReset + windowMs,
        };
      }

      // Increment count
      rateLimitEntry.count++;

      return {
        success: true,
        limit,
        remaining: limit - rateLimitEntry.count,
        reset: rateLimitEntry.lastReset + windowMs,
      };
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow the request (fail open)
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }
}

// Cleanup old entries periodically (only for in-memory fallback)
export function cleanupRateLimit() {
  if (redis) return; // Skip cleanup if using Redis

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes

  // Only cleanup if the map is getting large to avoid unnecessary work
  if (rateLimitMap.size > 100) {
    const keysToDelete: string[] = [];

    for (const [key, entry] of rateLimitMap.entries()) {
      // Extract window start time from the key format: rate_limit:IP:TIMESTAMP
      const keyParts = key.split(':');
      if (keyParts.length >= 3) {
        const windowStart = parseInt(keyParts[2], 10);
        if (!isNaN(windowStart) && now - windowStart > windowMs) {
          keysToDelete.push(key);
        }
      } else {
        // Old format fallback - check entry timestamp
        if (now - entry.lastReset > windowMs) {
          keysToDelete.push(key);
        }
      }
    }

    // Delete in batch to avoid iterator issues
    keysToDelete.forEach((key) => rateLimitMap.delete(key));

    if (keysToDelete.length > 0) {
      console.log(
        `Cleaned up ${keysToDelete.length} expired rate limit entries`
      );
    }
  }
}

// Run cleanup periodically (only in development and non-serverless environments)
if (
  typeof window === 'undefined' &&
  !redis &&
  process.env.NODE_ENV === 'development'
) {
  setInterval(cleanupRateLimit, 60 * 60 * 1000);
}
