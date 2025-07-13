import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
import { ContactFormData, ContactAPIResponse } from '@/app/types/api';
import { replaceMergeFields } from '@/app/utils/apiUtils/replaceMergeFields';
import userHtmlString from '@/app/utils/apiUtils/userEmailHTML';
import leadGenHtmlString from '@/app/utils/apiUtils/leadGenHTML';
import { rateLimit } from '@/app/utils/apiUtils/rateLimit';

// Define a schema for input validation
const contactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().optional().default(''),
  message: z.string().min(1, { message: 'Message is required' }),
});

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Handle contact form submission
 * @param req - Next.js request object
 * @returns API response with success/error status
 */
export async function POST(
  req: NextRequest
): Promise<NextResponse<ContactAPIResponse>> {
  try {
    // Apply rate limiting (5 requests per 15 minutes)
    const rateLimitResult = await rateLimit(req, 5, 15 * 60 * 1000);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
      const response: ContactAPIResponse = {
        success: false,
        message: 'Too many requests. Please try again later.',
        statusCode: 429,
      };

      return NextResponse.json(response, {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
        },
      });
    }

    const body = await req.json();

    // Validate input using Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const response: ContactAPIResponse = {
        success: false,
        message: 'Invalid input',
        errors: result.error.flatten().fieldErrors,
        statusCode: 400,
      };

      return NextResponse.json(response, { status: 400 });
    }

    const { name, email, subject, message } = result.data;

    // Sanitize inputs
    const sanitizedData: ContactFormData = {
      name: sanitizeHtml(name.trim()),
      email: sanitizeHtml(email.trim()),
      subject: sanitizeHtml(subject?.trim() ?? ''),
      message: sanitizeHtml(message.trim()),
    };

    // Send emails
    await Promise.all([
      resend.emails.send({
        from: 'Akshay Gupta <contact@akshaygupta.live>',
        to: [sanitizedData.email],
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

    const successResponse: ContactAPIResponse = {
      success: true,
      message: 'Email sent successfully',
      data: {
        emailSent: true,
        timestamp: new Date(),
      },
      statusCode: 200,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (e) {
    console.error('Error in sending mail:', e);

    // Check for specific error types
    if (e instanceof Error) {
      if (e.message.includes('rate limit') || e.message.includes('429')) {
        const response: ContactAPIResponse = {
          success: false,
          message: 'Too many requests. Please try again later.',
          statusCode: 429,
        };
        return NextResponse.json(response, { status: 429 });
      }

      if (e.message.includes('invalid') || e.message.includes('validation')) {
        const response: ContactAPIResponse = {
          success: false,
          message: 'Invalid request data',
          statusCode: 400,
        };
        return NextResponse.json(response, { status: 400 });
      }
    }

    const errorResponse: ContactAPIResponse = {
      success: false,
      message: 'Error in sending mail',
      error: e instanceof Error ? e.message : 'Unknown error',
      statusCode: 500,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
