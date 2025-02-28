import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (
      !process.env.NEXT_PUBLIC_DROPBOX_API_KEY ||
      !process.env.NEXT_PUBLIC_DROPBOX_API_SECRET ||
      !process.env.NEXT_PUBLIC_DROPBOX_REFRESH_TOKEN
    ) {
      throw new Error('Missing required Dropbox environment variables');
    }

    const response = await fetch('https://api.dropbox.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.NEXT_PUBLIC_DROPBOX_REFRESH_TOKEN,
        client_id: process.env.NEXT_PUBLIC_DROPBOX_API_KEY,
        client_secret: process.env.NEXT_PUBLIC_DROPBOX_API_SECRET,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Dropbox token refresh failed:', data);
      throw new Error(data.error_description || 'Failed to refresh token');
    }

    return new NextResponse(
      JSON.stringify({
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        expiresAt: Date.now() + data.expires_in * 1000,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Error refreshing token:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to refresh access token' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
}
