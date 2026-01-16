import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import BlogTileMDX from '@/app/components/BlogTileMDX';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { getAllBlogs } from '@/lib/mdx';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live'),
  title: 'Blog | Akshay Gupta',
  description:
    'Read my latest thoughts and insights about web development, technology, and software engineering.',
  openGraph: {
    type: 'website',
    title: 'Blog | Akshay Gupta',
    description:
      'Read my latest thoughts and insights about web development, technology, and software engineering.',
    url: 'https://akshaygupta.live/blog',
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: '/blog/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta Blog - Web Development, Technology, and Software Engineering',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Akshay Gupta',
    description:
      'Read my latest thoughts and insights about web development, technology, and software engineering.',
    images: ['/blog/opengraph-image'],
    creator: '@ashay_music',
  },
  alternates: {
    canonical: 'https://akshaygupta.live/blog',
  },
};

async function BlogPosts() {
  const posts = await getAllBlogs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Akshay Gupta Blog',
    url: 'https://akshaygupta.live/blog',
    description:
      'Read my latest thoughts and insights about web development and technology.',
    author: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      url: 'https://akshaygupta.live',
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.metadata.title,
      url: `https://akshaygupta.live/blog/${post.slug}`,
      datePublished: post.metadata.publishedAt,
      dateModified: post.metadata.publishedAt,
      author: {
        '@type': 'Person',
        name: 'Akshay Gupta',
        url: 'https://akshaygupta.live',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://akshaygupta.live/blog/${post.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="row">
        {posts.map((post) => (
          <BlogTileMDX key={post.slug} blog={post} />
        ))}
      </div>
    </>
  );
}

export default function Blog() {
  return (
    <Layout>
      <section
        id="blog"
        data-nav-tooltip="Blog"
        className="pp-section pp-scrollable section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="title">
            <h3>Latest Blogs.</h3>
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <BlogPosts />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
