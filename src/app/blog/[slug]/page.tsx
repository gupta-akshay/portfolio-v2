import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/app/components/Layout';
import EmojiReactions from '@/app/components/EmojiReactions';
import SocialShare from '@/app/components/SocialShare';
import ReadingProgressBar from '@/app/components/ReadingProgressBar';
import MermaidRenderer from '@/app/components/MermaidRenderer';
import TableOfContentsMDX from './TableOfContentsMDX';
import { getBlogBySlug, getAllBlogs, getBlogHeadings } from '@/lib/mdx';
import { getSiteUrl } from '@/lib/site-url';
import { formatDate } from '@/app/utils';
import { logger } from '@/app/utils/logger';

import styles from '../../styles/sections/blogSection.module.scss';

interface SingleBlogPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for published blog posts only (excludes drafts in production)
export async function generateStaticParams() {
  const posts = await getAllBlogs();
  return posts.map((post) => ({ slug: post.slug }));
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

  const post = await getBlogBySlug(slug);

  if (process.env.NODE_ENV === 'production' && post?.metadata.draft === true) {
    notFound();
  }

  const readingTime = post?.readingTime ?? '';
  const headings = getBlogHeadings(slug);
  const siteUrl = getSiteUrl();

  const ogImageUrl = `${siteUrl}/blog/${slug}/opengraph-image`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metadata.title,
    description: metadata.excerpt || metadata.title,
    image: ogImageUrl,
    datePublished: metadata.publishedAt,
    dateModified: metadata.publishedAt,
    author: {
      '@type': 'Person',
      name: metadata.author.name,
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Akshay Gupta',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon?size=192`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <Layout isBlog>
      <ReadingProgressBar />
      <MermaidRenderer />
      <TableOfContentsMDX headings={headings} />
      <SocialShare
        url={`${siteUrl}/blog/${slug}`}
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
                width={1792}
                height={1024}
                className={styles.blogImage}
                sizes="(max-width: 991px) 100vw, 1110px"
                priority
              />
            )}
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className={`${styles.article} route-shell`}>
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
                        {formatDate(metadata.publishedAt)} • {readingTime}
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
  const siteUrl = getSiteUrl();

  try {
    const { slug } = await params;
    const post = await getBlogBySlug(slug);

    if (!post) {
      return {
        title: 'Post Not Found | Akshay Gupta',
        description: `The blog post you're looking for does not exist`,
        metadataBase: new URL(siteUrl),
      };
    }

    const { metadata } = post;
    const description = metadata.excerpt || metadata.title;

    return {
      title: `${metadata.title} | Akshay Gupta's Blog`,
      description,
      metadataBase: new URL(siteUrl),
      openGraph: {
        type: 'article',
        title: metadata.title,
        description,
        url: `${siteUrl}/blog/${slug}`,
        siteName: 'Akshay Gupta',
        locale: 'en_US',
        publishedTime: metadata.publishedAt,
        modifiedTime: metadata.publishedAt,
        authors: [metadata.author.name],
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description,
        creator: '@ashay_music',
      },
      alternates: {
        canonical: `${siteUrl}/blog/${slug}`,
      },
    };
  } catch (error) {
    logger.error('Error generating metadata:', error);
    return {
      title: 'Error | Akshay Gupta',
      description: 'An error occurred while loading this blog post',
      metadataBase: new URL(siteUrl),
    };
  }
}

export default SingleBlogPage;
