import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { eq, and, count } from 'drizzle-orm';
import * as Sentry from '@sentry/nextjs';
import { db } from '../../../../db';
import { blogReactions, anonymousUsers } from '../../../../db/schema';
import { logger } from '@/app/utils/logger';
import { rateLimit, getClientIp } from '@/app/utils/ratelimit';

function reportDuration(
  method: 'GET' | 'POST',
  start: number,
  failed: boolean
) {
  Sentry.metrics.distribution(
    'api.reactions.duration',
    performance.now() - start,
    {
      unit: 'millisecond',
      attributes: failed ? { method, error: 'true' } : { method },
    }
  );
}

function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

// GET: Get reactions for a blog post
export async function GET(request: NextRequest) {
  const start = performance.now();
  let failed = false;
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get('blogSlug');
    const fingerprint = searchParams.get('fingerprint');

    if (!blogSlug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    // Get all reactions for this blog post with counts
    const reactions = await db
      .select({
        emoji: blogReactions.emoji,
        count: count(),
      })
      .from(blogReactions)
      .where(eq(blogReactions.blogSlug, blogSlug))
      .groupBy(blogReactions.emoji);

    // If fingerprint is provided, get the user's reactions for this blog post
    let userReactions: string[] = [];
    if (fingerprint) {
      const user = await db
        .select()
        .from(anonymousUsers)
        .where(eq(anonymousUsers.fingerprint, fingerprint))
        .limit(1);

      if (user.length > 0 && user[0]?.id) {
        const userReactionData = await db
          .select({
            emoji: blogReactions.emoji,
          })
          .from(blogReactions)
          .where(
            and(
              eq(blogReactions.blogSlug, blogSlug),
              eq(blogReactions.userId, user[0].id)
            )
          );

        userReactions = userReactionData.map((r) => r.emoji);
      }
    }

    const response = NextResponse.json({
      reactions,
      userReactions,
    });

    // Aggregate counts (no fingerprint) are safe to share via CDN.
    // Fingerprint-scoped responses include per-user data, so keep them private.
    if (fingerprint) {
      response.headers.set(
        'Cache-Control',
        'private, max-age=0, must-revalidate'
      );
    } else {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=300'
      );
    }

    return response;
  } catch (error) {
    failed = true;
    logger.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  } finally {
    reportDuration('GET', start, failed);
  }
}

// POST: Add or update a reaction
export async function POST(request: NextRequest) {
  const start = performance.now();
  let failed = false;
  try {
    const limit = rateLimit(request, {
      id: 'reactions',
      limit: 30,
      windowMs: 60_000,
    });
    if (!limit.ok) {
      Sentry.metrics.count('api.reactions.rate_limited', 1);
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSec) },
        }
      );
    }

    const { blogSlug, emoji, fingerprint } = await request.json();

    // The client always sends one: getOrCreateFingerprint() returns a UUID even
    // when localStorage is unavailable.
    if (!blogSlug || !emoji || !fingerprint) {
      return NextResponse.json(
        { error: 'Blog slug, emoji and fingerprint are required' },
        { status: 400 }
      );
    }

    const ipHash = hashIP(getClientIp(request));
    const userAgent = request.headers.get('user-agent') || '';

    // Find or create anonymous user
    const user = await db
      .select()
      .from(anonymousUsers)
      .where(eq(anonymousUsers.fingerprint, fingerprint))
      .limit(1);

    let userId: string | undefined;

    if (user.length === 0) {
      // Create new anonymous user
      const newUser = await db
        .insert(anonymousUsers)
        .values({
          fingerprint,
          ipHash,
          userAgent,
        })
        .returning();
      userId = newUser[0]?.id;
      if (!userId) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    } else {
      // Update existing user's last seen
      userId = user[0]?.id;
      if (!userId) {
        return NextResponse.json(
          { error: 'Invalid user data' },
          { status: 500 }
        );
      }
      await db
        .update(anonymousUsers)
        .set({ lastSeen: new Date() })
        .where(eq(anonymousUsers.id, userId));
    }

    // Check if user already reacted with this specific emoji to this blog post
    const existingReaction = await db
      .select()
      .from(blogReactions)
      .where(
        and(
          eq(blogReactions.blogSlug, blogSlug),
          eq(blogReactions.userId, userId),
          eq(blogReactions.emoji, emoji)
        )
      )
      .limit(1);

    const isRemoving = existingReaction.length > 0 && !!existingReaction[0]?.id;
    if (isRemoving) {
      // User already reacted with this emoji, remove the reaction (toggle off)
      await db
        .delete(blogReactions)
        .where(eq(blogReactions.id, existingReaction[0]!.id));
    } else {
      // Create new reaction (user can have multiple different emoji reactions)
      await db.insert(blogReactions).values({
        blogSlug,
        emoji,
        userId: userId!,
      });
    }

    Sentry.metrics.count('blog.reaction.toggle', 1, {
      attributes: {
        emoji,
        blog_slug: blogSlug,
        action: isRemoving ? 'removed' : 'added',
      },
    });

    // Return updated reaction counts
    const reactions = await db
      .select({
        emoji: blogReactions.emoji,
        count: count(),
      })
      .from(blogReactions)
      .where(eq(blogReactions.blogSlug, blogSlug))
      .groupBy(blogReactions.emoji);

    return NextResponse.json({
      success: true,
      reactions,
      userReaction: isRemoving ? null : emoji,
    });
  } catch (error) {
    failed = true;
    logger.error('Error adding reaction:', error);
    return NextResponse.json(
      { error: 'Failed to add reaction' },
      { status: 500 }
    );
  } finally {
    reportDuration('POST', start, failed);
  }
}
