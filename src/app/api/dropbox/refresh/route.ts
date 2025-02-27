import { NextResponse } from 'next/server';

const DROPBOX_APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_API_KEY!;
const DROPBOX_APP_SECRET = process.env.NEXT_PUBLIC_DROPBOX_API_SECRET!;
const DROPBOX_REFRESH_TOKEN = process.env.NEXT_PUBLIC_DROPBOX_REFRESH_TOKEN!;

export async function GET() {
  try {
    const response = await fetch('https://api.dropbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: DROPBOX_REFRESH_TOKEN,
        client_id: DROPBOX_APP_KEY,
        client_secret: DROPBOX_APP_SECRET,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to refresh token');
    }

    return NextResponse.json({
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      expiresAt: Date.now() + data.expires_in * 1000,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh access token' },
      { status: 500 }
    );
  }
}
