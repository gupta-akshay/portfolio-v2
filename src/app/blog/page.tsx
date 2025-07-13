import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import { getPosts } from '@/sanity/lib/client';
import BlogTile from '@/app/components/BlogTile';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import {
  InteractiveBackground,
  ScrollAnimation,
  StaggerAnimation,
} from '@/app/components';

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
      <StaggerAnimation staggerDelay={0.1} useIntersectionObserver={true}>
        <div className='row'>
          {posts.map((post) => (
            <BlogTile key={post._id} blog={post} />
          ))}
        </div>
      </StaggerAnimation>
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
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <InteractiveBackground
          variant='grid'
          count={12}
          color='#2fbf71'
          size={40}
          speed={0.8}
          intensity={0.9}
          interactive={true}
          className='blog-background'
        />
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <ScrollAnimation animation='fadeIn' duration={0.8}>
            <div className='title'>
              <h3>Latest Blogs.</h3>
            </div>
          </ScrollAnimation>
          <ScrollAnimation animation='slideUp' duration={0.8} delay={0.2}>
            <Suspense fallback={<LoadingIndicator />}>
              <BlogPosts />
            </Suspense>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}
