import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a new nonce using Web Crypto API and convert to base64
  const array = new Uint8Array(16);
  self.crypto.getRandomValues(array);
  const nonce = btoa(String.fromCharCode.apply(null, Array.from(array)));

  // Clone the response
  const response = NextResponse.next();

  // Get existing CSP header
  const existingCsp = response.headers.get('Content-Security-Policy');

  // Replace NONCE placeholder with actual nonce
  if (existingCsp) {
    const newCsp = existingCsp.replace(/NONCE/g, nonce);
    response.headers.set('Content-Security-Policy', newCsp);
  }

  // Add nonce to response headers so we can access it in pages
  response.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: '/:path*',
};
