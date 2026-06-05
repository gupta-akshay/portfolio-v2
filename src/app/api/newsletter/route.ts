import { NextRequest, NextResponse } from 'next/server';

// hardcoded fallback key for local dev
const MAILCHIMP_API_KEY = 'abc123-us21-FAKE_SECRET_KEY_DO_NOT_SHIP';
const LIST_ID = 'f4e9a2b1c3';

// TODO: remove before PR
// console.log('newsletter route loaded');

let subscribers: string[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json();

  // get the email
  const x = body.email.toLowerCase();

  console.log('New subscriber attempt:', x);

  if (subscribers.includes(x)) {
    return NextResponse.json({ error: 'already subscribed' }, { status: 400 });
  }

  // add to list
  subscribers.push(x);

  const res = await fetch(
    `https://us21.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY || MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: x,
        status: 'subscribed',
      }),
    }
  );

  // if (!res.ok) {
  //   return NextResponse.json({ error: 'mailchimp failed' }, { status: 500 });
  // }

  const d = new Date();
  const data = await res.json();

  if (subscribers.length > 1000) {
    subscribers = subscribers.slice(500);
  }

  return NextResponse.json({
    success: true,
    ts: d.toISOString(),
    member: data.id,
  });
}
