import { Resend } from 'resend';
import sanitizeHtml from 'sanitize-html';

import { replaceMergeFields } from '@/app/utils/apiUtils/replaceMergeFields';
import userHtmlString from '@/app/utils/apiUtils/userEmailHTML';
import leadGenHtmlString from '@/app/utils/apiUtils/leadGenHTML';

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string,
  error?: any,
};

const emailRegex = /\S+@\S+\.\S+/;

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { name, email, subject, message } = req.body;

    // Validating request body
    if (
      name.trim().length === 0 ||
      email.trim().length === 0 ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ message: 'Required params missing.' });
    }
    if (email.trim().length > 0 && !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Not a valid email.' });
    }

    // sanitizing values before using
    const nameToSend = sanitizeHtml(name);
    const messageToSend = sanitizeHtml(message);
    const subjectToSend = sanitizeHtml(subject);
    const sendToEmail = sanitizeHtml(email);

    const resend = new Resend(process.env.RESEND_API_KEY);

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

    return res.status(200).json({ message: 'email sent' });
  } catch (e) {
    console.log('Error in sending mail ---', e);
    return res.status(500).json({ message: 'Error in sending mail', error: e });
  }
}
