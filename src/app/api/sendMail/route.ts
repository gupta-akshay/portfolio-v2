import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import {
  escapeHtml,
  replaceMergeFields,
} from '@/app/utils/apiUtils/replaceMergeFields';
import userHtmlString from '@/app/utils/apiUtils/userEmailHTML';
import leadGenHtmlString from '@/app/utils/apiUtils/leadGenHTML';
import { logger } from '@/app/utils/logger';
import { rateLimit } from '@/app/utils/ratelimit';
import { serverEnv } from '@/env';

// Define a schema for input validation
const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().optional().default(''),
  message: z.string().min(1, { message: 'Message is required' }),
});

const resend = new Resend(serverEnv.RESEND_API_KEY);

/**
 * Handle contact form submission
 * @param req - Next.js request object
 * @returns API response with success/error status
 */
export async function POST(req: NextRequest) {
  const start = performance.now();
  let failed = false;
  try {
    const limit = rateLimit(req, {
      id: 'sendMail',
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!limit.ok) {
      Sentry.metrics.count('api.sendmail.rate_limited', 1);
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfterSec) },
        }
      );
    }

    const body = await req.json();

    // Validate input using Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // The envelope address must stay raw — ' and & are legal in a mailbox, and
    // escaping them would send the confirmation to an address that cannot
    // receive it. Only the copy interpolated into the HTML body is escaped.
    const recipient = email.trim();

    const sanitizedData = {
      name: escapeHtml(name.trim()),
      email: escapeHtml(recipient),
      subject: escapeHtml(subject?.trim() ?? ''),
      message: escapeHtml(message.trim()),
    };

    // Send emails
    await Promise.all([
      resend.emails.send({
        from: 'Akshay Gupta <contact@akshaygupta.live>',
        to: [recipient],
        subject: 'Thank you for contacting! I will reach out to you soon!',
        html: replaceMergeFields({
          messageString: userHtmlString,
          mergeFields: { name: sanitizedData.name },
        }),
      }),
      resend.emails.send({
        from: 'Contact Enquiry - Akshay Gupta <contact@akshaygupta.live>',
        to: ['contact@akshaygupta.live'],
        cc: ['akshaygupta.live@gmail.com'],
        subject: 'New Contact Enquiry',
        html: replaceMergeFields({
          messageString: leadGenHtmlString,
          mergeFields: sanitizedData,
        }),
      }),
    ]);

    Sentry.metrics.count('contact.email.sent', 1, {
      attributes: { status: 'success' },
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (e) {
    failed = true;
    logger.error('Error in sending mail:', e);
    Sentry.metrics.count('contact.email.sent', 1, {
      attributes: { status: 'error' },
    });

    // Check for specific error types
    if (e instanceof Error) {
      if (e.message.includes('rate limit') || e.message.includes('429')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Too many requests. Please try again later.',
          },
          { status: 429 }
        );
      }

      if (e.message.includes('invalid') || e.message.includes('validation')) {
        return NextResponse.json(
          { success: false, message: 'Invalid request data' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Error in sending mail' },
      { status: 500 }
    );
  } finally {
    Sentry.metrics.distribution(
      'api.sendmail.duration',
      performance.now() - start,
      {
        unit: 'millisecond',
        ...(failed && { attributes: { error: 'true' } }),
      }
    );
  }
}
