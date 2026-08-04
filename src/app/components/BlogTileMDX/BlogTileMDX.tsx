'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/mdx/types';
import { formatDate } from '@/app/utils/helpers/format';

import styles from '../BlogTile/BlogTile.module.scss';

const BlogTileMDX = ({ blog }: { blog: BlogPost }) => {
  const { metadata, slug, readingTime } = blog;

  const blogHref = `/blog/${slug}`;

  const formattedDate = formatDate(metadata.publishedAt);

  const primaryCategory = metadata.categories[0];

  // Cards sit in a near-fixed-width grid, so a character budget approximates
  // "as many tags as fit on one line" without measuring the DOM.
  // ponytail: char budget, swap for a ResizeObserver if the tile stops being
  // a fixed-width grid cell.
  const shownTags: string[] = [];
  let budget = 26;
  for (const category of metadata.categories) {
    if (shownTags.length && category.length > budget) break;
    shownTags.push(category);
    budget -= category.length + 2;
  }
  const overflowTags = metadata.categories.length - shownTags.length;

  return (
    <article className={styles.card}>
      <Link
        href={blogHref}
        className={styles.cardLink}
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
          <div className={styles.tagRow} title={metadata.categories.join(', ')}>
            {shownTags.map((category) => (
              <span key={category} className={styles.tag}>
                {category}
              </span>
            ))}
            {overflowTags > 0 && (
              <span className={styles.tagMore}>+{overflowTags}</span>
            )}
          </div>
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
