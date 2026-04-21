'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, memo } from 'react';
import { BlogPost } from '@/lib/mdx/types';
import { formatDate } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';
import { useHoverPrefetch } from '@/app/hooks/useHoverPrefetch';

import styles from '../BlogTile/BlogTile.module.scss';

const MAX_VISIBLE_CATEGORIES = 3;

const BlogTileMDX = memo(
  ({ blog }: { blog: BlogPost }) => {
    const { metadata, slug, readingTime } = blog;
    const router = useRouter();
    const { startLoading } = useLoading();

    const blogHref = `/blog/${slug}`;
    const { handleMouseEnter, handleMouseLeave } = useHoverPrefetch(blogHref, {
      delay: 150,
      enabled: true,
    });

    const formattedDate = useMemo(
      () => formatDate(metadata.publishedAt),
      [metadata.publishedAt]
    );

    const visibleCategories = metadata.categories.slice(0, MAX_VISIBLE_CATEGORIES);
    const remainingCount = Math.max(0, metadata.categories.length - MAX_VISIBLE_CATEGORIES);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      startLoading();
      router.push(blogHref);
    };

    return (
      <div className="col-md-6 m-15px-tb">
        <article className={styles.blogGrid}>
          <div className={styles.blogImg}>
            <Link
              href={blogHref}
              prefetch={false}
              aria-label={`Read more about ${metadata.title}`}
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {metadata.coverImage ? (
                <Image
                  src={metadata.coverImage}
                  alt={metadata.coverImageAlt || metadata.title}
                  width={1792}
                  height={1024}
                  className={styles.tileImage}
                  sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 540px"
                />
              ) : (
                <div
                  className={styles.placeholderImage}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '1.5rem',
                  }}
                >
                  {metadata.title.charAt(0)}
                </div>
              )}
            </Link>
          </div>
          <div className={styles.blogInfo}>
            <div className={styles.meta} aria-label="Post metadata">
              <time dateTime={metadata.publishedAt}>{formattedDate}</time>
              <span aria-hidden="true">|</span>
              <span className={styles.readingTime}>{readingTime}</span>
              <span aria-hidden="true">|</span>
              {visibleCategories.map((category) => (
                <span key={category} className={styles.hashtag}>
                  #{category}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className={styles.hashtagMore}>+{remainingCount}</span>
              )}
            </div>
            <h2 className={styles.blogTitle}>
              <Link
                href={blogHref}
                prefetch={false}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {metadata.title}
              </Link>
            </h2>
          </div>
        </article>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.blog.slug === nextProps.blog.slug &&
      prevProps.blog.metadata.title === nextProps.blog.metadata.title &&
      prevProps.blog.metadata.publishedAt === nextProps.blog.metadata.publishedAt
    );
  }
);

BlogTileMDX.displayName = 'BlogTileMDX';

export default BlogTileMDX;
