import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

// Define a schema for input validation
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

import { replaceMergeFields } from '@/app/utils/apiUtils/replaceMergeFields';
import userHtmlString from '@/app/utils/apiUtils/userEmailHTML';
import leadGenHtmlString from '@/app/utils/apiUtils/leadGenHTML';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input using Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: result.error.flatten().fieldErrors },
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

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (e) {
    console.error('Error in sending mail:', e);
    return NextResponse.json(
      { message: 'Error in sending mail' },
      { status: 500 }
    );
  }
}
