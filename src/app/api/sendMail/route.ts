import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

// Define a schema for input validation
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional().default(''),
  message: z.string().min(1, 'Message is required'),
});

import { replaceMergeFields } from '@/app/utils/apiUtils/replaceMergeFields';
import userHtmlString from '@/app/utils/apiUtils/userEmailHTML';
import leadGenHtmlString from '@/app/utils/apiUtils/leadGenHTML';
import { rateLimit } from '@/app/utils/apiUtils/rateLimit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting (5 requests per 15 minutes)
    const rateLimitResult = await rateLimit(req, 5, 15 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          message: 'Too many requests. Please try again later.',
          retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    const body = await req.json();

    // Validate input using Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: 'Invalid input',
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // Sanitize inputs
    const sanitizedData = {
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

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error in sending mail:', e);
    
    // Check for specific error types
    if (e instanceof Error) {
      if (e.message.includes('rate limit') || e.message.includes('429')) {
        return NextResponse.json(
          { message: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (e.message.includes('invalid') || e.message.includes('validation')) {
        return NextResponse.json(
          { message: 'Invalid request data' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: 'Error in sending mail' },
      { status: 500 }
    );
  }
}
