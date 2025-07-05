import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { RevalidationRequest, RevalidationResponse } from '@/app/types/api';

/**
 * Handle Sanity webhook for revalidation
 * @param req - Next.js request object
 * @returns API response with revalidation status
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<RevalidationResponse>> {
  try {
    const { body, isValidSignature } = await parseBody<RevalidationRequest>(
      req,
      process.env.NEXT_PUBLIC_SANITY_HOOK_SECRET
    );

    if (!isValidSignature) {
      const response: RevalidationResponse = {
        success: false,
        message: 'Invalid Signature',
        statusCode: 401,
      };
      return NextResponse.json(response, { status: 401 });
    }

    if (!body?._type) {
      const response: RevalidationResponse = {
        success: false,
        message: 'Bad Request - _type is required',
        statusCode: 400,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Revalidate the specified tag
    revalidateTag(body._type);

    // If there are additional tags, revalidate them too
    if (body.tags) {
      body.tags.forEach((tag) => revalidateTag(tag));
    }

    const successResponse: RevalidationResponse = {
      success: true,
      message: 'Revalidation successful',
      data: {
        revalidated: true,
        timestamp: Date.now(),
        tags: [body._type, ...(body.tags || [])],
      },
      statusCode: 200,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: unknown) {
    console.error('Revalidation error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorResponse: RevalidationResponse = {
      success: false,
      message: 'Revalidation failed',
      error: errorMessage,
      statusCode: 500,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
