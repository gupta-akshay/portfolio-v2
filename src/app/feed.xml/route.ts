import { getAllBlogs } from '@/lib/mdx';

const SITE_URL = 'https://akshaygupta.live';

export async function GET() {
  const posts = await getAllBlogs();

  const items = posts
    .map((post) => {
      const { metadata, slug } = post;
      const url = `${SITE_URL}/blog/${slug}`;
      const pubDate = new Date(metadata.publishedAt).toUTCString();
      const description = metadata.excerpt
        ? `<![CDATA[${metadata.excerpt}]]>`
        : `<![CDATA[${metadata.title}]]>`;

      return `
    <item>
      <title><![CDATA[${metadata.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${metadata.categories.map((c) => `<category>${c}</category>`).join('\n      ')}
      <author>akshaygupta.live@gmail.com (Akshay Gupta)</author>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Akshay Gupta Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Long-form notes on engineering, architecture, performance, and practical lessons from shipping production software.</description>
    <language>en-US</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
