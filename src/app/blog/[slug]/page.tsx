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

const SingleBlog = dynamic(() => import('@/app/components/SingleBlog'), {
  loading: () => <div className='loading-blog-content'>Loading content...</div>,
  ssr: true,
});

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

const SingleBlogPage = async ({ params }: SingleBlogPageProps) => {
  const slug = (await params).slug;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : 'https://akshaygupta.live/images/about-me.png';

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
        className='single-blog'
        style={{ position: 'relative', minHeight: '100vh' }}
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
          <ScrollAnimation animation='scale' duration={0.8}>
            <div className='blog-feature-img'>
              <BlogImage value={post.mainImage} isCoverImage />
            </div>
          </ScrollAnimation>
          <div className='row justify-content-center'>
            <div className='col-lg-8'>
              <article className='article'>
                <StaggerAnimation staggerDelay={0.2}>
                  <ScrollAnimation
                    animation='slideUp'
                    duration={0.8}
                    delay={0.2}
                  >
                    <div className='article-title'>
                      <div className='hashtags'>
                        {post.categories.map((category) => (
                          <span key={category.slug.current} className='hashtag'>
                            #{category.title}
                          </span>
                        ))}
                      </div>
                      <h2>{post.title}</h2>
                      <div className='media'>
                        <div className='avatar'>
                          <BlogImage value={post.author.image} isAuthor />
                        </div>
                        <div className='media-body'>
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
                    <div className='article-content'>
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
          title: 'Post Not Found',
          description: `The blog post you're looking for does not exist`,
          type: 'article',
          url: `https://akshaygupta.live/blog/${slug}`,
          images: [
            {
              url: 'https://akshaygupta.live/images/about-me.png',
              width: 1200,
              height: 630,
              alt: 'Blog Post Not Found',
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

    const imageUrl = urlFor(post.mainImage).width(1200).height(630).url();

    const description = post.excerpt || post.title;

    return {
      title: `${post.title} | Akshay Gupta's Blog`,
      description: description,
      metadataBase: new URL('https://akshaygupta.live'),
      openGraph: {
        title: post.title,
        description: description,
        type: 'article',
        url: `https://akshaygupta.live/blog/${slug}`,
        siteName: 'Akshay Gupta',
        publishedTime: post.publishedAt,
        modifiedTime: post.publishedAt,
        authors: [post.author.name],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
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
      openGraph: {
        title: 'Error',
        description: 'An error occurred while loading this blog post',
        type: 'article',
        url: 'https://akshaygupta.live/blog',
        images: [
          {
            url: 'https://akshaygupta.live/images/about-me.png',
            width: 1200,
            height: 630,
            alt: 'Error Loading Blog Post',
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
