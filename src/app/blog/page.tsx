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
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Akshay Gupta',
    description:
      'Read my latest thoughts and insights about web development and technology.',
    images: ['https://akshaygupta.live/blog/opengraph-image'],
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
