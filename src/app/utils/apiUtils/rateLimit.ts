import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis'

// Upstash Redis client
let redis: Redis | null = null;

// Initialize Redis client only if environment variables are present
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    console.warn('Upstash Redis not available, falling back to in-memory storage');
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
  // Get client IP (handle various proxy scenarios)
  const ip = 
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    '127.0.0.1';

  const now = Date.now();
  const key = `rate_limit:${ip}`;
  const windowSeconds = Math.floor(windowMs / 1000);
  
  try {
    if (redis) {
      // Use Upstash Redis for production
      const current = await redis.incr(key);
      
      if (current === 1) {
        // First request in window, set expiration
        await redis.expire(key, windowSeconds);
      }
      
      const ttl = await redis.ttl(key);
      const resetTime = now + (ttl * 1000);
      
      if (current > limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: resetTime,
        };
      }
      
      return {
        success: true,
        limit,
        remaining: limit - current,
        reset: resetTime,
      };
    } else {
      // Fallback to in-memory storage (development)
      let rateLimitEntry = rateLimitMap.get(key);
      
      if (!rateLimitEntry) {
        rateLimitEntry = { count: 0, lastReset: now };
        rateLimitMap.set(key, rateLimitEntry);
      }
      
      // Reset if window has passed
      if (now - rateLimitEntry.lastReset > windowMs) {
        rateLimitEntry.count = 0;
        rateLimitEntry.lastReset = now;
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
  
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > windowMs) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every hour (only in development)
if (typeof window === 'undefined' && !redis) {
  setInterval(cleanupRateLimit, 60 * 60 * 1000);
}
