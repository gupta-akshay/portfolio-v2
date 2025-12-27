import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Layout from '@/app/components/Layout';
import EmojiReactions from '@/app/components/EmojiReactions';
import SocialShare from '@/app/components/SocialShare';
import ReadingProgressBar from '@/app/components/ReadingProgressBar';
import TableOfContentsMDX from './TableOfContentsMDX';
import { getBlogBySlug, getBlogSlugs, calculateReadingTime } from '@/lib/mdx';
import { formatDate } from '@/app/utils';

import styles from '../../styles/sections/blogSection.module.scss';

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Don't allow dynamic params - only pre-rendered slugs
export const dynamicParams = false;

const SingleBlogPage = async ({ params }: SingleBlogPageProps) => {
  const { slug } = await params;

  // Import the MDX file dynamically
  let Post;
  let metadata;

  try {
    const mdxModule = await import(`@/content/blog/${slug}.mdx`);
    Post = mdxModule.default;
    metadata = mdxModule.metadata;
  } catch {
    notFound();
  }

  if (!metadata) {
    notFound();
  }

  // Read raw MDX content for reading time calculation
  const contentPath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  const rawContent = fs.readFileSync(contentPath, 'utf-8');
  const readingTime = calculateReadingTime(rawContent);

  const imageUrl = metadata.coverImage || '/images/about-me.png';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metadata.title,
    description: metadata.excerpt || metadata.title,
    image: `https://akshaygupta.live${imageUrl}`,
    datePublished: metadata.publishedAt,
    dateModified: metadata.publishedAt,
    author: {
      '@type': 'Person',
      name: metadata.author.name,
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
      <TableOfContentsMDX slug={slug} />
      <SocialShare
        url={`https://akshaygupta.live/blog/${slug}`}
        title={metadata.title}
        description={metadata.excerpt || metadata.title}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        id={slug}
        className={styles.singleBlog}
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className={styles.blogFeatureImg}>
            {metadata.coverImage && (
              <Image
                src={metadata.coverImage}
                alt={metadata.coverImageAlt || metadata.title}
                width={1110}
                height={663}
                className={styles.blogImage}
                priority
              />
            )}
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className={styles.article}>
                <div className={styles.articleTitle}>
                  <div className={styles.hashtags}>
                    {metadata.categories.map((category: string) => (
                      <span
                        key={category}
                        className={styles.hashtag}
                      >
                        #{category}
                      </span>
                    ))}
                  </div>
                  <h2>{metadata.title}</h2>
                  <div className={styles.media}>
                    <div className={styles.avatar}>
                      <Image
                        src={metadata.author.avatar}
                        alt={metadata.author.name}
                        width={45}
                        height={45}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.mediaBody}>
                      <label>{metadata.author.name}</label>
                      <span>
                        {formatDate(metadata.publishedAt)} • {readingTime.text}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.articleContent}>
                  <Post />
                </div>
              </article>
            </div>
          </div>
        </div>
        <EmojiReactions blogSlug={slug} />
      </div>
    </Layout>
  );
};

export async function generateMetadata({
  params,
}: SingleBlogPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Akshay Gupta',
        description: `The blog post you're looking for does not exist`,
        metadataBase: new URL('https://akshaygupta.live'),
      };
    }

    const { metadata } = post;
    const imageUrl = metadata.coverImage || '/images/about-me.png';
    const description = metadata.excerpt || metadata.title;

    return {
      title: `${metadata.title} | Akshay Gupta's Blog`,
      description: description,
      metadataBase: new URL('https://akshaygupta.live'),
      openGraph: {
        type: 'article',
        title: metadata.title,
        description: description,
        url: `https://akshaygupta.live/blog/${slug}`,
        siteName: 'Akshay Gupta',
        locale: 'en_US',
        publishedTime: metadata.publishedAt,
        modifiedTime: metadata.publishedAt,
        authors: [metadata.author.name],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: metadata.title,
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
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
    };
  }
}

export default SingleBlogPage;
