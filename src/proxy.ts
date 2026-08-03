import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Agents that want the markdown rendition ask for it explicitly; browsers always
// send text/html, so a plain preference check is enough to tell them apart.
function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const lower = accept.toLowerCase();
  return lower.includes('text/markdown') && !lower.includes('text/html');
}

export function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  if (!prefersMarkdown(request.headers.get('accept'))) {
    const response = NextResponse.next();
    response.headers.append('Vary', 'Accept');
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const markdownPath =
    pathname === '/' ? '/api/markdown' : `/api/markdown${pathname}`;

  return NextResponse.rewrite(new URL(markdownPath, request.url));
}

export const config = {
  matcher: ['/', '/about', '/resume', '/blog/:path*', '/contact', '/music'],
};
