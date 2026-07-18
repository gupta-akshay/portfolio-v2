import { generateMarkdownDocument } from '@/lib/markdown';

interface MarkdownRouteContext {
  params: Promise<{ path?: string[] }>;
}

async function createResponse(
  context: MarkdownRouteContext,
  includeBody: boolean
): Promise<Response> {
  const { path } = await context.params;
  const document = await generateMarkdownDocument(path);

  if (!document) {
    return new Response(includeBody ? '# Not Found\n' : null, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
      },
    });
  }

  return new Response(includeBody ? document.content : null, {
    headers: {
      'Cache-Control': document.cacheControl,
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
      'X-Robots-Tag': 'noindex',
    },
  });
}

export function GET(_request: Request, context: MarkdownRouteContext) {
  return createResponse(context, true);
}

export function HEAD(_request: Request, context: MarkdownRouteContext) {
  return createResponse(context, false);
}
