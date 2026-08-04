import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import BlogList from './BlogList';
import LoadingIndicator from '@/app/components/LoadingIndicator/LoadingIndicator';
import { getAllBlogs } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/site-url';
import { blogIntro } from '@/lib/site-content';
import { createPageMetadata } from '@/lib/metadata';

import styles from '@/app/styles/sections/blogSection.module.scss';

const siteUrl = getSiteUrl();

export const metadata = createPageMetadata({
  title: 'Blog',
  description: blogIntro,
  socialTitle: 'Blog | Akshay Gupta',
  path: '/blog',
  imageAlt: 'Akshay Gupta Blog - Engineering, Architecture, and Performance',
});

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
      <BlogList posts={posts} />
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
          <div className={styles.eyebrow}>Blog</div>
          <h1 className={styles.heading}>
            Writing<span>.</span>
          </h1>
          <div className='route-shell'>
            <p className={styles.intro}>{blogIntro}</p>
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <BlogPosts />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
