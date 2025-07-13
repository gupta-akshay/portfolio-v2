import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import BlogImage from '@/app/components/BlogImage';
import EmojiReactions from '@/app/components/EmojiReactions';
import SocialShare from '@/app/components/SocialShare';
import ReadingProgressBar from '@/app/components/ReadingProgressBar';
import TableOfContents from '@/app/components/TableOfContents';
import { getPostBySlug } from '@/sanity/lib/client';
import { formatDate, calculateReadingTime } from '@/app/utils';
import { urlFor } from '@/sanity/lib/image';
import {
  InteractiveBackground,
  ScrollAnimation,
  StaggerAnimation,
} from '@/app/components';

import styles from '../../styles/sections/blogSection.module.scss';

const SingleBlog = dynamic(() => import('@/app/components/SingleBlog'), {
  loading: () => <div className='loading-blog-content'>Loading content...</div>,
  ssr: true,
});

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// Helper function to get MIME type from image asset
const getImageMimeType = (mainImage: any): string => {
  if (!mainImage?.asset) return 'image/png';

  // If we have the mimeType from the asset, use it
  if (mainImage.asset.mimeType) {
    return mainImage.asset.mimeType;
  }

  // Fallback to PNG for dynamically generated OpenGraph images
  return 'image/png';
};

const SingleBlogPage = async ({ params }: SingleBlogPageProps) => {
  const slug = (await params).slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : `https://akshaygupta.live/blog/${post.slug.current}/opengraph-image.png`;

  const readingTime = calculateReadingTime(post.body);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: 'https://akshaygupta.live/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Akshay Gupta',
      logo: {
        '@type': 'ImageObject',
        url: 'https://akshaygupta.live/icon?size=192',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://akshaygupta.live/blog/${slug}`,
    },
  };

  return (
    <Layout isBlog>
      <ReadingProgressBar />
      <TableOfContents content={post.body} />
      <SocialShare
        url={`https://akshaygupta.live/blog/${slug}`}
        title={post.title}
        description={post.excerpt || post.title}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        id={post.slug.current}
        className={styles.singleBlog}
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <InteractiveBackground
          variant='grid'
          count={8}
          color='#2fbf71'
          size={40}
          speed={0.8}
          intensity={0.9}
          interactive={true}
          className='blog-post-background'
        />
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <ScrollAnimation
            animation='scale'
            duration={0.8}
            parallax={true}
            parallaxSpeed='slow'
          >
            <div className={styles.blogFeatureImg}>
              <BlogImage value={post.mainImage} isCoverImage />
            </div>
          </ScrollAnimation>
          <div className='row justify-content-center'>
            <div className='col-lg-8'>
              <article className={styles.article}>
                <StaggerAnimation
                  staggerDelay={0.2}
                  useIntersectionObserver={true}
                >
                  <ScrollAnimation
                    animation='slideUp'
                    duration={0.8}
                    delay={0.2}
                    scrollReveal={true}
                  >
                    <div className={styles.articleTitle}>
                      <div className={styles.hashtags}>
                        {post.categories.map((category) => (
                          <span
                            key={category.slug.current}
                            className={styles.hashtag}
                          >
                            #{category.title}
                          </span>
                        ))}
                      </div>
                      <h2>{post.title}</h2>
                      <div className={styles.media}>
                        <div className={styles.avatar}>
                          <BlogImage value={post.author.image} isAuthor />
                        </div>
                        <div className={styles.mediaBody}>
                          <label>{post.author.name}</label>
                          <span>
                            {formatDate(post.publishedAt)} • {readingTime.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                  <ScrollAnimation
                    animation='slideUp'
                    duration={0.8}
                    delay={0.4}
                  >
                    <div className={styles.articleContent}>
                      <Suspense
                        fallback={
                          <div className='loading-blog-content'>
                            Loading content...
                          </div>
                        }
                      >
                        <SingleBlog post={post} />
                      </Suspense>
                    </div>
                  </ScrollAnimation>
                </StaggerAnimation>
              </article>
            </div>
          </div>
        </div>
        <EmojiReactions blogSlug={post.slug.current} />
      </div>
    </Layout>
  );
};

export async function generateMetadata({
  params,
}: SingleBlogPageProps): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Akshay Gupta',
        description: `The blog post you're looking for does not exist`,
        metadataBase: new URL('https://akshaygupta.live'),
        openGraph: {
          type: 'article',
          title: 'Post Not Found',
          description: `The blog post you're looking for does not exist`,
          url: `https://akshaygupta.live/blog/${slug}`,
          siteName: 'Akshay Gupta',
          locale: 'en_US',
          images: [
            {
              url: 'https://akshaygupta.live/images/about-me.png',
              width: 1200,
              height: 630,
              alt: 'Blog Post Not Found',
              type: 'image/png',
              secureUrl: 'https://akshaygupta.live/images/about-me.png',
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Post Not Found',
          description: `The blog post you're looking for does not exist`,
          images: ['https://akshaygupta.live/images/about-me.png'],
          creator: '@ashay_music',
        },
        alternates: {
          canonical: `https://akshaygupta.live/blog/${slug}`,
        },
      };
    }

    const imageUrl = post.mainImage
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : `https://akshaygupta.live/blog/${slug}/opengraph-image.png`;

    const imageType = getImageMimeType(post.mainImage);
    const description = post.excerpt || post.title;

    return {
      title: `${post.title} | Akshay Gupta's Blog`,
      description: description,
      metadataBase: new URL('https://akshaygupta.live'),
      openGraph: {
        type: 'article',
        title: post.title,
        description: description,
        url: `https://akshaygupta.live/blog/${slug}`,
        siteName: 'Akshay Gupta',
        locale: 'en_US',
        publishedTime: post.publishedAt,
        modifiedTime: post.publishedAt,
        authors: [post.author.name],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: imageType,
            secureUrl: imageUrl,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: [imageUrl],
        creator: '@ashay_music',
      },
      alternates: {
        canonical: `https://akshaygupta.live/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error | Akshay Gupta',
      description: 'An error occurred while loading this blog post',
      metadataBase: new URL('https://akshaygupta.live'),
      openGraph: {
        type: 'article',
        title: 'Error',
        description: 'An error occurred while loading this blog post',
        url: 'https://akshaygupta.live/blog',
        siteName: 'Akshay Gupta',
        locale: 'en_US',
        images: [
          {
            url: 'https://akshaygupta.live/images/about-me.png',
            width: 1200,
            height: 630,
            alt: 'Error Loading Blog Post',
            type: 'image/png',
            secureUrl: 'https://akshaygupta.live/images/about-me.png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Error',
        description: 'An error occurred while loading this blog post',
        creator: '@ashay_music',
        images: ['https://akshaygupta.live/images/about-me.png'],
      },
      alternates: {
        canonical: 'https://akshaygupta.live/blog',
      },
    };
  }
}

export default SingleBlogPage;
