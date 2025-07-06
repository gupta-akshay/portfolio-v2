import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import requestIp from 'request-ip';
import { RateLimitResult } from '@/app/types/api';

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

// Lua script for atomic rate limiting
// This eliminates race conditions by making the entire operation atomic
const rateLimitScript = `
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local expiry = tonumber(ARGV[2])
  local current_time = tonumber(ARGV[3])
  
  -- Get current count
  local current = redis.call('GET', key)
  if current == false then
      current = 0
  else
      current = tonumber(current)
  end
  
  -- Check if limit exceeded
  if current >= limit then
      -- Get TTL to calculate reset time
      local ttl = redis.call('TTL', key)
      local reset_time
      if ttl > 0 then
          reset_time = current_time + (ttl * 1000)
      else
          reset_time = current_time + (expiry * 1000)
      end
      
      -- Return: [success, limit, remaining, reset]
      return {0, limit, 0, reset_time}
  end
  
  -- Increment counter
  local new_count = redis.call('INCR', key)
  
  -- Set expiry if this is a new key
  if new_count == 1 then
      redis.call('EXPIRE', key, expiry)
  end
  
  -- Calculate reset time
  local ttl = redis.call('TTL', key)
  local reset_time = current_time + (ttl * 1000)
  
  -- Return: [success, limit, remaining, reset]
  return {1, limit, limit - new_count, reset_time}
`;

export async function rateLimit(
  req: NextRequest,
  limit: number = 5, // Max 5 requests
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
  const fakeRequest = {
    headers: Object.fromEntries(req.headers), // Convert Headers into plain object
  };

  const ip = requestIp.getClientIp(fakeRequest) || '127.0.0.1';

  const now = Date.now();

  // Create a fixed window key based on current time window
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `rate_limit:${ip}:${windowStart}`;

  try {
    if (redis) {
      // Calculate expiry time for the window
      const windowEndTime = windowStart + windowMs;
      const secondsUntilWindowEnd = Math.ceil((windowEndTime - now) / 1000);

      // Execute the atomic rate limiting script
      const result = (await redis.eval(
        rateLimitScript,
        [key], // KEYS
        [
          limit.toString(),
          Math.max(1, secondsUntilWindowEnd).toString(),
          now.toString(),
        ] // ARGV
      )) as number[];

      // Parse the result: [success, limit, remaining, reset]
      const [success, returnedLimit, remaining, reset] = result;

      return {
        success: success === 1,
        limit: returnedLimit ?? 0,
        remaining: remaining ?? 0,
        reset: reset ?? 0,
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
