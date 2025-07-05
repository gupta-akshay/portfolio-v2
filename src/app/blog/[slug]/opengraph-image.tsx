import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/sanity/lib/client';

export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

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
          background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          color: 'white',
          padding: '40px 80px',
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            marginBottom: 20,
            maxWidth: '80%',
          }}
        >
          {post.title}
        </div>
        <div style={{ fontSize: 32, color: '#cccccc', marginBottom: 40 }}>
          By {post.author.name}
        </div>
        <div style={{ fontSize: 24, color: '#999999' }}>akshaygupta.live</div>
      </div>
    ),
    {
      ...size,
    }
  );
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  return [
    {
      contentType: 'image/png',
      size: { width: 1200, height: 630 },
      id: 'og-image',
      alt: post?.title || 'Blog Post',
    },
  ];
}
