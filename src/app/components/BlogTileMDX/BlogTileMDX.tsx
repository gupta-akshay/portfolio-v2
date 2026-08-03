'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/mdx/types';
import { formatDate } from '@/app/utils/helpers/format';
import { useLoading } from '@/app/context/LoadingContext';

import styles from '../BlogTile/BlogTile.module.scss';

const BlogTileMDX = ({ blog }: { blog: BlogPost }) => {
  const { metadata, slug, readingTime } = blog;
  const startLoading = useLoading();

  const blogHref = `/blog/${slug}`;

  const formattedDate = formatDate(metadata.publishedAt);

  const primaryCategory = metadata.categories[0];

  return (
    <article className={styles.card}>
      <Link
        href={blogHref}
        className={styles.cardLink}
        onClick={startLoading}
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
};

export default BlogTileMDX;
