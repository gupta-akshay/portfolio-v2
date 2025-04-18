import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import { getPosts } from '@/sanity/lib/client';
import BlogTile from '@/app/components/BlogTile';
import LoadingIndicator from '@/app/components/LoadingIndicator';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live/blog'),
  title: 'Blog | Akshay Gupta',
  description:
    'Read my latest thoughts and insights about web development, technology, and software engineering.',
  openGraph: {
    type: 'website',
    title: 'Blog | Akshay Gupta',
    description:
      'Read my latest thoughts and insights about web development and technology.',
    url: 'https://akshaygupta.live/blog',
    siteName: 'Akshay Gupta',
    images: [
      {
        url: 'https://akshaygupta.live/blog/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Akshay Gupta',
    description:
      'Read my latest thoughts and insights about web development and technology.',
    images: ['https://akshaygupta.live/blog/opengraph-image.png'],
    creator: '@ashay_music',
  },
  alternates: {
    canonical: 'https://akshaygupta.live/blog',
  },
};

export const revalidate = 3600;

async function BlogPosts() {
  const posts = await getPosts();

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
      headline: post.title,
      url: `https://akshaygupta.live/blog/${post.slug.current}`,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: {
        '@type': 'Person',
        name: 'Akshay Gupta',
        url: 'https://akshaygupta.live',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://akshaygupta.live/blog/${post.slug.current}`,
      },
    })),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className='row'>
        {posts.map((post) => (
          <BlogTile key={post._id} blog={post} />
        ))}
      </div>
    </>
  );
}

export default function Blog() {
  return (
    <Layout>
      <section
        id='blog'
        data-nav-tooltip='Blog'
        className='pp-section pp-scrollable section'
      >
        <div className='container'>
          <div className='title'>
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
