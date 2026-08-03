import { getAllBlogs, getBlogBySlug } from '@/lib/mdx';
import { OG_SIZE, renderOg } from '@/lib/og';

// Force Node.js runtime since getBlogBySlug uses fs to read MDX files
export const runtime = 'nodejs';

export const contentType = 'image/png';
export const size = OG_SIZE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = slug ? await getBlogBySlug(slug) : null;

  if (!post) {
    return renderOg({
      title: 'Blog Post Not Found',
      footer: 'akshaygupta.live/blog',
    });
  }

  return renderOg({
    title: post.metadata.title,
    plainTitle: true,
    subtitle: `By ${post.metadata.author.name}`,
    footer: 'akshaygupta.live',
    align: 'bottom-left',
  });
}

export async function generateStaticParams() {
  const posts = await getAllBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = slug ? await getBlogBySlug(slug) : null;

  return [
    {
      contentType: 'image/png',
      size: OG_SIZE,
      id: 'og-image',
      alt: post?.metadata.title || 'Blog Post',
    },
  ];
}
