import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import sanitizeHtml from 'sanitize-html';

import { replaceMergeFields } from '@/app/utils/apiUtils/replaceMergeFields';
import userHtmlString from '@/app/utils/apiUtils/userEmailHTML';
import leadGenHtmlString from '@/app/utils/apiUtils/leadGenHTML';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRegex = /\S+@\S+\.\S+/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, subject, message } = body;

    // Validating request body
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { message: 'Required params missing.' },
        { status: 400 }
      );
    }
    if (email.trim().length > 0 && !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { message: 'Not a valid email.' },
        { status: 400 }
      );
    }

    // sanitizing values before using
    const nameToSend = sanitizeHtml(name.trim());
    const messageToSend = sanitizeHtml(message.trim());
    const subjectToSend = sanitizeHtml(subject.trim());
    const sendToEmail = sanitizeHtml(email.trim());

    await Promise.all([
      // confirmation email to sender
      resend.emails.send({
        from: 'Akshay Gupta <contact@akshaygupta.live>',
        to: [sendToEmail],
        subject: 'Thank you for contacting! I will reach out to you soon!',
        html: replaceMergeFields({
          messageString: userHtmlString,
          mergeFields: {
            name: nameToSend,
          },
        }),
      }),
      // lead gen email to myself
      resend.emails.send({
        from: 'Contact Enquiry - Akshay Gupta <contact@akshaygupta.live>',
        to: ['contact@akshaygupta.live'],
        cc: ['akshaygupta.live@gmail.com'],
        subject: 'New Contact Enquiry',
        html: replaceMergeFields({
          messageString: leadGenHtmlString,
          mergeFields: {
            name: nameToSend,
            email: sendToEmail,
            subject: subjectToSend,
            message: messageToSend,
          },
        }),
      }),
    ]);

    return NextResponse.json({ message: 'email sent' }, { status: 200 });
  } catch (e) {
    console.log('Error in sending mail ---', e);
    return NextResponse.json(
      { message: 'Error in sending mail', error: e },
      { status: 500 }
    );
  }
}
