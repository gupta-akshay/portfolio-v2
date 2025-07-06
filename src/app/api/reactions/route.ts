import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import requestIp from 'request-ip';
import { eq, and, count } from 'drizzle-orm';
import { db } from '../../../../db';
import { blogReactions, anonymousUsers } from '../../../../db/schema';

// Helper function to generate user fingerprint
function generateFingerprint(req: NextRequest): string {
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';

  const fingerprint = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
  return createHash('sha256').update(fingerprint).digest('hex');
}

// Helper function to hash IP address
function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

// GET: Get reactions for a blog post
export async function GET(request: NextRequest) {
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

    console.log('reactions', blogSlug, fingerprint, reactions);

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

    return NextResponse.json({
      reactions,
      userReactions,
    });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    );
  }
}

// POST: Add or update a reaction
export async function POST(request: NextRequest) {
  try {
    const {
      blogSlug,
      emoji,
      fingerprint: clientFingerprint,
    } = await request.json();

    if (!blogSlug || !emoji) {
      return NextResponse.json(
        { error: 'Blog slug and emoji are required' },
        { status: 400 }
      );
    }

    const fakeRequest = {
      headers: Object.fromEntries(request.headers), // Convert Headers into plain object
    };

    // Get client IP and generate server-side fingerprint as fallback
    const ip = requestIp.getClientIp(fakeRequest) || '127.0.0.1';
    const ipHash = hashIP(ip || 'unknown');
    const serverFingerprint = generateFingerprint(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Use client fingerprint if provided, otherwise fall back to server fingerprint
    const fingerprint = clientFingerprint || serverFingerprint || 'unknown';

    // Find or create anonymous user
    let user = await db
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

    if (existingReaction.length > 0 && existingReaction[0]?.id) {
      // User already reacted with this emoji, remove the reaction (toggle off)
      await db
        .delete(blogReactions)
        .where(eq(blogReactions.id, existingReaction[0].id));
    } else {
      // Create new reaction (user can have multiple different emoji reactions)
      await db.insert(blogReactions).values({
        blogSlug,
        emoji,
        userId: userId!,
      });
    }

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
      userReaction: existingReaction.length === 0 ? emoji : null, // null if removed, emoji if added
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    return NextResponse.json(
      { error: 'Failed to add reaction' },
      { status: 500 }
    );
  }
}
