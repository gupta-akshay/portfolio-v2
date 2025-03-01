import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import { getPosts } from '@/sanity/lib/client';
import BlogTile from '@/app/components/BlogTile';
import LoadingIndicator from '@/app/components/LoadingIndicator';

export const metadata: Metadata = {
  title: 'Blog | Akshay Gupta',
  description:
    'Read my latest thoughts and insights about web development, technology, and software engineering.',
  openGraph: {
    title: 'Blog | Akshay Gupta',
    description:
      'Read my latest thoughts and insights about web development and technology.',
    type: 'article',
    url: 'https://akshaygupta.live/blog',
    images: [
      {
        url: 'https://akshaygupta.live/images/about-me.png',
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
    images: ['https://akshaygupta.live/images/about-me.png'],
    creator: '@ashay_music',
  },
  alternates: {
    canonical: 'https://akshaygupta.live/blog',
  },
};

// Separate component for blog posts to use with Suspense
async function BlogPosts() {
  const posts = await getPosts();

  return (
    <div className='row'>
      {posts.map((post) => (
        <BlogTile key={post._id} blog={post} />
      ))}
    </div>
  );
}

export default function Blog() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Akshay Gupta Blog',
    description:
      'Read my latest thoughts and insights about web development, technology, and software engineering.',
    url: 'https://akshaygupta.live/blog',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://akshaygupta.live/blog',
    },
    author: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      url: 'https://akshaygupta.live',
    },
    publisher: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      url: 'https://akshaygupta.live',
    },
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
