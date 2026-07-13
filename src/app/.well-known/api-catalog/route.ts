import { getSiteUrl } from '@/lib/site-url';

const PROFILE = 'https://www.rfc-editor.org/info/rfc9727';
const CONTENT_TYPE = `application/linkset+json; profile="${PROFILE}"`;

function responseHeaders(siteUrl: string): HeadersInit {
  return {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    'Content-Type': CONTENT_TYPE,
    Link: `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  };
}

export function GET() {
  const siteUrl = getSiteUrl();
  const catalogUrl = `${siteUrl}/.well-known/api-catalog`;

  return Response.json(
    {
      linkset: [
        {
          anchor: catalogUrl,
          item: [{ href: `${siteUrl}/api/music/tracks` }],
        },
      ],
    },
    {
      headers: responseHeaders(siteUrl),
    }
  );
}

export function HEAD() {
  const siteUrl = getSiteUrl();

  return new Response(null, {
    headers: responseHeaders(siteUrl),
  });
}
