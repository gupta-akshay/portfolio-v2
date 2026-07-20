import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import BlogTileMDX from '@/app/components/BlogTileMDX';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { getAllBlogs } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/site-url';
import { blogIntro } from '@/lib/site-content';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Blog',
  description: blogIntro,
  openGraph: {
    type: 'website',
    title: 'Blog | Akshay Gupta',
    description: blogIntro,
    url: `${siteUrl}/blog`,
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: '/blog/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta Blog - Engineering, Architecture, and Performance',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Akshay Gupta',
    description: blogIntro,
    images: ['/blog/opengraph-image'],
    creator: '@ashay_music',
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

async function BlogPosts() {
  const posts = await getAllBlogs();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Akshay Gupta Blog',
    url: `${siteUrl}/blog`,
    description: blogIntro,
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Akshay Gupta',
      url: siteUrl,
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.metadata.title,
      url: `${siteUrl}/blog/${post.slug}`,
      description: post.metadata.excerpt ?? post.metadata.title,
      image: new URL(post.metadata.coverImage, siteUrl).toString(),
      datePublished: post.metadata.publishedAt,
      dateModified: post.metadata.modifiedAt ?? post.metadata.publishedAt,
      keywords: post.metadata.categories,
      articleSection: post.metadata.categories[0],
      author: {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: post.metadata.author.name,
        url: `${siteUrl}/about`,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blog/${post.slug}`,
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
        id='blog'
        data-nav-tooltip='Blog'
        className='pp-section pp-scrollable section'
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <div className='title'>
            <h3>Writing</h3>
          </div>
          <div className='route-shell mb-4'>
            <p className='section-intro'>{blogIntro}</p>
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <BlogPosts />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
