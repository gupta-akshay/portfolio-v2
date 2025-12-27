'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { BlogPost } from '@/lib/mdx/types';
import { formatDate } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';
import { useHoverPrefetch } from '@/app/hooks/useHoverPrefetch';

import styles from '../BlogTile/BlogTile.module.scss';

// Global cache for text measurements
const textMeasurementCache = new Map<string, number>();

const measureText = (
  text: string,
  fontSize = 12,
  fontFamily = 'inherit'
): number => {
  const cacheKey = `${text}-${fontSize}-${fontFamily}`;

  if (textMeasurementCache.has(cacheKey)) {
    return textMeasurementCache.get(cacheKey)!;
  }

  const tempElement = document.createElement('span');
  tempElement.style.visibility = 'hidden';
  tempElement.style.position = 'absolute';
  tempElement.style.fontSize = `${fontSize}px`;
  tempElement.style.fontFamily = fontFamily;
  tempElement.style.fontWeight = '600';
  tempElement.style.whiteSpace = 'nowrap';
  tempElement.textContent = text;

  document.body.appendChild(tempElement);
  const width = tempElement.offsetWidth;
  document.body.removeChild(tempElement);

  if (textMeasurementCache.size > 1000) {
    textMeasurementCache.clear();
  }
  textMeasurementCache.set(cacheKey, width);

  return width;
};

const BlogTileMDX = memo(
  ({ blog }: { blog: BlogPost }) => {
    const { metadata, slug, readingTime } = blog;
    const router = useRouter();
    const { startLoading } = useLoading();
    const metaRef = useRef<HTMLDivElement>(null);
    const [visibleCategories, setVisibleCategories] = useState(
      metadata.categories.length
    );

    const blogHref = `/blog/${slug}`;
    const { handleMouseEnter, handleMouseLeave } = useHoverPrefetch(blogHref, {
      delay: 150,
      enabled: true,
    });

    const formattedDate = useMemo(
      () => formatDate(metadata.publishedAt),
      [metadata.publishedAt]
    );

    const calculateVisibleCategories = useCallback(
      (containerWidth: number) => {
        if (containerWidth === 0) return metadata.categories.length;
        if (metadata.categories.length === 0) return 0;

        let fontFamily = 'inherit';
        if (metaRef.current) {
          const computedStyle = window.getComputedStyle(metaRef.current);
          fontFamily = computedStyle.fontFamily || 'inherit';
        }

        const baseText = `${formattedDate} | ${readingTime} | `;
        const baseWidth = measureText(baseText, 12, fontFamily);

        let usedWidth = baseWidth;
        let fittingCategories = 0;

        for (let i = 0; i < metadata.categories.length; i++) {
          const category = metadata.categories[i];
          if (!category) break;

          const categoryText = `#${category}`;
          const categoryWidth = measureText(categoryText, 12, fontFamily) + 8;

          if (usedWidth + categoryWidth < containerWidth - 40) {
            usedWidth += categoryWidth;
            fittingCategories++;
          } else {
            break;
          }
        }

        if (fittingCategories < metadata.categories.length) {
          while (fittingCategories > 0) {
            const remainingCount = metadata.categories.length - fittingCategories;
            const plusWidth =
              measureText(`+${remainingCount}`, 12, fontFamily) + 8;

            if (usedWidth + plusWidth <= containerWidth - 40) {
              break;
            }

            const lastCategory = metadata.categories[fittingCategories - 1];
            if (!lastCategory) {
              fittingCategories--;
              continue;
            }

            const lastCategoryText = `#${lastCategory}`;
            const lastCategoryWidth =
              measureText(lastCategoryText, 12, fontFamily) + 8;
            usedWidth -= lastCategoryWidth;
            fittingCategories--;
          }
        }

        return fittingCategories;
      },
      [metadata.categories, formattedDate, readingTime]
    );

    useEffect(() => {
      if (!metaRef.current) return;

      const performInitialCalculation = () => {
        if (!metaRef.current) return;
        const initialWidth = metaRef.current.offsetWidth;
        if (initialWidth > 0) {
          const newVisibleCategories = calculateVisibleCategories(initialWidth);
          setVisibleCategories(newVisibleCategories);
        }
      };

      performInitialCalculation();

      if (metaRef.current && metaRef.current.offsetWidth === 0) {
        setTimeout(performInitialCalculation, 10);
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = entry.contentRect.width;
          const newVisibleCategories = calculateVisibleCategories(newWidth);
          setVisibleCategories(newVisibleCategories);
        }
      });

      resizeObserver.observe(metaRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [calculateVisibleCategories]);

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
                  width={600}
                  height={400}
                  className={styles.tileImage}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              ) : (
                <div
                  className={styles.placeholderImage}
                  style={{
                    width: '100%',
                    height: '200px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
            <div
              className={styles.meta}
              aria-label="Post metadata"
              ref={metaRef}
            >
              <time dateTime={metadata.publishedAt}>{formattedDate}</time>
              <span aria-hidden="true">|</span>
              <span className={styles.readingTime}>{readingTime}</span>
              <span aria-hidden="true">|</span>
              {metadata.categories.slice(0, visibleCategories).map((category) => (
                <span key={category} className={styles.hashtag}>
                  #{category}
                </span>
              ))}
              {metadata.categories.length > visibleCategories && (
                <span className={styles.hashtagMore}>
                  +{metadata.categories.length - visibleCategories}
                </span>
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
