import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface MediaRange {
  type: string;
  subtype: string;
  quality: number;
}

function parseAcceptHeader(acceptHeader: string): MediaRange[] {
  return acceptHeader.split(',').flatMap((entry) => {
    const [mediaType, ...parameters] = entry
      .trim()
      .toLowerCase()
      .split(';')
      .map((part) => part.trim());
    const [type, subtype] = mediaType?.split('/') ?? [];

    if (!type || !subtype || (type === '*' && subtype !== '*')) return [];

    const qualityParameter = parameters.find((parameter) =>
      parameter.startsWith('q=')
    );
    const parsedQuality = qualityParameter
      ? Number(qualityParameter.slice(2))
      : 1;
    const quality =
      Number.isFinite(parsedQuality) &&
      parsedQuality >= 0 &&
      parsedQuality <= 1
        ? parsedQuality
        : 0;

    return [{ type, subtype, quality }];
  });
}

function qualityFor(
  ranges: MediaRange[],
  type: string,
  subtype: string
): number {
  let bestSpecificity = -1;
  let quality = 0;

  for (const range of ranges) {
    const typeMatches = range.type === '*' || range.type === type;
    const subtypeMatches = range.subtype === '*' || range.subtype === subtype;
    if (!typeMatches || !subtypeMatches) continue;

    const specificity =
      range.type === '*' ? 0 : range.subtype === '*' ? 1 : 2;
    if (specificity > bestSpecificity) {
      bestSpecificity = specificity;
      quality = range.quality;
    }
  }

  return quality;
}

function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;

  const ranges = parseAcceptHeader(acceptHeader);
  const markdownQuality = qualityFor(ranges, 'text', 'markdown');
  const htmlQuality = qualityFor(ranges, 'text', 'html');

  return markdownQuality > 0 && markdownQuality > htmlQuality;
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
  const destination = new URL(markdownPath, request.url);

  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ['/', '/about', '/resume', '/blog/:path*', '/contact', '/music'],
};
