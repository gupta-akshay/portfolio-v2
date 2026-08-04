'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BlogPost } from '@/lib/mdx/types';
import BlogTileMDX from '@/app/components/BlogTileMDX/BlogTileMDX';
import BlogFilter from './BlogFilter';

import styles from '@/app/styles/sections/blogSection.module.scss';

const PAGE_SIZE = 10;

/**
 * Owns the category selection, which lives in `?tag=a,b` so a filtered view is
 * shareable and survives back/refresh.
 */
export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const category of post.metadata.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  const sortedCounts = [...counts].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );

  // Unknown tags in the URL are dropped, so an OR filter can never produce an
  // empty grid and there is no empty state to design for.
  const selected = (searchParams.get('tag')?.split(',') ?? []).filter((tag) =>
    counts.has(tag)
  );

  const filtered = selected.length
    ? posts.filter((post) =>
        post.metadata.categories.some((c) => selected.includes(c))
      )
    : posts;

  const setSelected = (next: string[]) => {
    // `replace` so a multi-chip session does not bury the previous page under
    // one history entry per click.
    router.replace(next.length ? `${pathname}?tag=${next.join(',')}` : pathname, {
      scroll: false,
    });
  };

  return (
    <>
      <BlogFilter
        counts={sortedCounts}
        selected={selected}
        onToggle={(tag) =>
          setSelected(
            selected.includes(tag)
              ? selected.filter((t) => t !== tag)
              : [...selected, tag]
          )
        }
        onClear={() => setSelected([])}
      />
      {/* Remounting on selection change resets pagination without a
          setState-in-effect. */}
      <PostGrid key={selected.join(',')} posts={filtered} />
    </>
  );
}

/**
 * Renders the post grid a page at a time. Every post is already in the payload,
 * so "load more" is a pure client-side reveal with no extra request.
 */
function PostGrid({ posts }: { posts: BlogPost[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = posts.slice(0, visibleCount);
  const remaining = posts.length - visible.length;

  return (
    <>
      <div className={styles.postGrid}>
        {visible.map((post) => (
          <BlogTileMDX key={post.slug} blog={post} />
        ))}
      </div>

      {remaining > 0 && (
        <div className={styles.loadMoreRow}>
          <button
            type='button'
            className={`px-btn px-btn-theme ${styles.loadMore}`}
            onClick={() =>
              setVisibleCount((count) => count + PAGE_SIZE)
            }
          >
            Load more
            <span className={styles.loadMoreCount}>
              {remaining} left
            </span>
          </button>
        </div>
      )}

      <p className={styles.postCount} role='status' aria-live='polite'>
        Showing {visible.length} of {posts.length}
      </p>
    </>
  );
}
