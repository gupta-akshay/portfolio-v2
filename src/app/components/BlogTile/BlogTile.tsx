'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import BlogImage from '@/app/components/BlogImage';
import { Blog } from '@/sanity/types/blog';
import { formatDate, calculateReadingTime } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';
import { useCursor } from '@/app/context/CursorContext';

import styles from './BlogTile.module.scss';

// Global cache for text measurements to avoid recalculation across all BlogTile instances
const textMeasurementCache = new Map<string, number>();

// More accurate text measurement using temporary DOM element
const measureText = (
  text: string,
  fontSize = 12,
  fontFamily = 'inherit'
): number => {
  const cacheKey = `${text}-${fontSize}-${fontFamily}`;

  if (textMeasurementCache.has(cacheKey)) {
    return textMeasurementCache.get(cacheKey)!;
  }

  // Create a temporary element for more accurate measurement
  const tempElement = document.createElement('span');
  tempElement.style.visibility = 'hidden';
  tempElement.style.position = 'absolute';
  tempElement.style.fontSize = `${fontSize}px`;
  tempElement.style.fontFamily = fontFamily;
  tempElement.style.fontWeight = '600'; // Match hashtag font weight
  tempElement.style.whiteSpace = 'nowrap';
  tempElement.textContent = text;

  document.body.appendChild(tempElement);
  const width = tempElement.offsetWidth;
  document.body.removeChild(tempElement);

  // Cache result (limit cache size to prevent memory leaks)
  if (textMeasurementCache.size > 1000) {
    textMeasurementCache.clear();
  }
  textMeasurementCache.set(cacheKey, width);

  return width;
};

// Helper function to compare blog body content
const compareBody = (prevBody: any[], nextBody: any[]): boolean => {
  if (prevBody.length !== nextBody.length) return false;

  // Use JSON.stringify for deep comparison - efficient for small to medium content
  try {
    return JSON.stringify(prevBody) === JSON.stringify(nextBody);
  } catch {
    // Fallback to reference equality if JSON.stringify fails
    return prevBody === nextBody;
  }
};

const BlogTile = memo(
  ({ blog }: { blog: Blog }) => {
    const { mainImage } = blog;
    const router = useRouter();
    const { startLoading } = useLoading();
    const { addCursorInteraction } = useCursorInteractions();
    const { setCursorVariant, setCursorText } = useCursor();
    const metaRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const [visibleCategories, setVisibleCategories] = useState(
      blog.categories.length
    );

    // Memoize expensive calculations
    const readingTime = useMemo(
      () => calculateReadingTime(blog.body),
      [blog.body]
    );
    const formattedDate = useMemo(
      () => formatDate(blog.publishedAt),
      [blog.publishedAt]
    );

    // Optimize category calculation with memoization
    const calculateVisibleCategories = useCallback(
      (containerWidth: number) => {
        if (containerWidth === 0) return blog.categories.length;

        // Return 0 if there are no categories
        if (blog.categories.length === 0) return 0;

        // Get the actual font family from the container if available
        let fontFamily = 'inherit';
        if (metaRef.current) {
          const computedStyle = window.getComputedStyle(metaRef.current);
          fontFamily = computedStyle.fontFamily || 'inherit';
        }

        // Calculate base width (date + reading time + separators)
        const baseText = `${formattedDate} | ${readingTime.text} | `;
        const baseWidth = measureText(baseText, 12, fontFamily);

        let usedWidth = baseWidth;
        let fittingCategories = 0;

        // Calculate how many categories fit
        for (let i = 0; i < blog.categories.length; i++) {
          const category = blog.categories[i];
          if (!category) break;

          const categoryText = `#${category.title}`;
          const categoryWidth = measureText(categoryText, 12, fontFamily) + 8; // 8px for gap

          if (usedWidth + categoryWidth < containerWidth - 40) {
            usedWidth += categoryWidth;
            fittingCategories++;
          } else {
            break;
          }
        }

        // If we need to show +n, reserve space for it
        if (fittingCategories < blog.categories.length) {
          // Check if we need to reduce visible categories to fit +n
          while (fittingCategories > 0) {
            // Recalculate remaining count and plus width for current fitting categories
            const remainingCount = blog.categories.length - fittingCategories;
            const plusWidth =
              measureText(`+${remainingCount}`, 12, fontFamily) + 8;

            // If current layout fits, we're done
            if (usedWidth + plusWidth <= containerWidth - 40) {
              break;
            }

            // Remove the last category and try again
            const lastCategory = blog.categories[fittingCategories - 1];
            if (!lastCategory) {
              fittingCategories--;
              continue;
            }

            const lastCategoryText = `#${lastCategory.title}`;
            const lastCategoryWidth =
              measureText(lastCategoryText, 12, fontFamily) + 8;
            usedWidth -= lastCategoryWidth;
            fittingCategories--;
          }
        }

        return fittingCategories;
      },
      [blog.categories, formattedDate, readingTime.text]
    );

    // Add cursor interactions
    useEffect(() => {
      const cleanupFunctions: (() => void)[] = [];

      if (imageRef.current) {
        const cleanup = addCursorInteraction(imageRef.current, {
          onHover: 'hover',
          onText: 'Read this article',
          onClick: 'click',
        });
        if (cleanup) cleanupFunctions.push(cleanup);
      }

      if (titleRef.current) {
        const cleanup = addCursorInteraction(titleRef.current, {
          onHover: 'hover',
          onText: 'Read this article',
          onClick: 'click',
        });
        if (cleanup) cleanupFunctions.push(cleanup);
      }

      return () => {
        cleanupFunctions.forEach((cleanup) => cleanup());
      };
    }, [addCursorInteraction]);

    // Use ResizeObserver for better performance + initial calculation
    useEffect(() => {
      if (!metaRef.current) return;

      // Initial calculation with a small delay to ensure element is rendered
      const performInitialCalculation = () => {
        if (!metaRef.current) return;
        const initialWidth = metaRef.current.offsetWidth;
        if (initialWidth > 0) {
          const newVisibleCategories = calculateVisibleCategories(initialWidth);
          setVisibleCategories(newVisibleCategories);
        }
      };

      // Try immediate calculation
      performInitialCalculation();

      // Fallback with small delay if container width is 0
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

      setCursorVariant('default');
      setCursorText('');

      router.push(`/blog/${blog.slug.current}`);
    };

    return (
      <div className='col-md-6 m-15px-tb'>
        <article className={styles.blogGrid}>
          <div className={styles.blogImg}>
            <div ref={imageRef}>
              <Link
                href={`/blog/${blog.slug.current}`}
                prefetch={false}
                aria-label={`Read more about ${blog.title}`}
                onClick={handleClick}
              >
                <BlogImage value={mainImage} isTileImage alt={blog.title} />
              </Link>
            </div>
          </div>
          <div className={styles.blogInfo}>
            <div className={styles.meta} aria-label='Post metadata' ref={metaRef}>
              <time dateTime={blog.publishedAt}>{formattedDate}</time>
              <span aria-hidden='true'>|</span>
              <span className={styles.readingTime}>{readingTime.text}</span>
              <span aria-hidden='true'>|</span>
              {blog.categories.slice(0, visibleCategories).map((category) => (
                <span key={category.slug.current} className={styles.hashtag}>
                  #{category.title}
                </span>
              ))}
              {blog.categories.length > visibleCategories && (
                <span className={styles.hashtagMore}>
                  +{blog.categories.length - visibleCategories}
                </span>
              )}
            </div>
            <h2 className={styles.blogTitle}>
              <div ref={titleRef}>
                <Link
                  href={`/blog/${blog.slug.current}`}
                  prefetch={false}
                  onClick={handleClick}
                >
                  {blog.title}
                </Link>
              </div>
            </h2>
          </div>
        </article>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if blog content has actually changed
    return (
      prevProps.blog._id === nextProps.blog._id &&
      prevProps.blog.title === nextProps.blog.title &&
      prevProps.blog.publishedAt === nextProps.blog.publishedAt &&
      prevProps.blog.categories.length === nextProps.blog.categories.length &&
      compareBody(prevProps.blog.body, nextProps.blog.body)
    );
  }
);

BlogTile.displayName = 'BlogTile';

export default BlogTile;
