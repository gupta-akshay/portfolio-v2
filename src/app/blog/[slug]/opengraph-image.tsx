import { ImageResponse } from 'next/og';
import { getBlogBySlug, getBlogSlugs } from '@/lib/mdx';

export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;

  if (!slug) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Invalid Blog Post
        </div>
      ),
      { ...size }
    );
  }

  const post = await getBlogBySlug(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Blog Post Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #000000, #1a1a1a, #2a2a2a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          color: 'white',
          padding: '60px 80px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            marginBottom: 30,
            maxWidth: '85%',
            lineHeight: 1.1,
            color: '#ffffff',
          }}
        >
          {post.metadata.title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#e0e0e0',
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          By {post.metadata.author.name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#2fbf71',
            fontWeight: 500,
          }}
        >
          akshaygupta.live
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;

  if (!slug) {
    return [
      {
        contentType: 'image/png',
        size: { width: 1200, height: 630 },
        id: 'og-image',
        alt: 'Blog Post',
      },
    ];
  }

  const post = await getBlogBySlug(slug);
  return [
    {
      contentType: 'image/png',
      size: { width: 1200, height: 630 },
      id: 'og-image',
      alt: post?.metadata.title || 'Blog Post',
    },
  ];
}
