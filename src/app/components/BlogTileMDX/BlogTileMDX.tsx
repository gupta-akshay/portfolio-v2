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

const BlogTileMDX = memo(
  ({ blog }: { blog: BlogPost }) => {
    const { metadata, slug, readingTime } = blog;
    const router = useRouter();
    const startLoading = useLoading();

    const blogHref = `/blog/${slug}`;
    const { handleMouseEnter, handleMouseLeave } = useHoverPrefetch(blogHref, {
      delay: 150,
      enabled: true,
    });

    const formattedDate = useMemo(
      () => formatDate(metadata.publishedAt),
      [metadata.publishedAt]
    );

    const primaryCategory = metadata.categories[0];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      startLoading();
      router.push(blogHref);
    };

    return (
      <article className={styles.card}>
        <Link
          href={blogHref}
          prefetch={false}
          className={styles.cardLink}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label={`Read ${metadata.title}`}
        >
          <div className={styles.cover}>
            {metadata.coverImage ? (
              <Image
                src={metadata.coverImage}
                alt={metadata.coverImageAlt || metadata.title}
                width={1792}
                height={1024}
                className={styles.coverImage}
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px'
              />
            ) : (
              primaryCategory && (
                <span className={styles.coverBadge}>{primaryCategory}</span>
              )
            )}
          </div>

          <div className={styles.body}>
            {primaryCategory && (
              <div className={styles.category}>{primaryCategory}</div>
            )}
            <h2 className={styles.title}>{metadata.title}</h2>
            {metadata.excerpt && (
              <p className={styles.excerpt}>{metadata.excerpt}</p>
            )}
            <div className={styles.meta}>
              <time dateTime={metadata.publishedAt}>{formattedDate}</time>
              <span aria-hidden='true'> · </span>
              <span>{readingTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.blog.slug === nextProps.blog.slug &&
      prevProps.blog.metadata.title === nextProps.blog.metadata.title &&
      prevProps.blog.metadata.publishedAt ===
        nextProps.blog.metadata.publishedAt
    );
  }
);

BlogTileMDX.displayName = 'BlogTileMDX';

export default BlogTileMDX;
