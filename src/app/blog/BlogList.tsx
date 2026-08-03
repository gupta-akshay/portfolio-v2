'use client';

import { useState } from 'react';
import { BlogPost } from '@/lib/mdx/types';
import BlogTileMDX from '@/app/components/BlogTileMDX/BlogTileMDX';

import styles from '@/app/styles/sections/blogSection.module.scss';

const PAGE_SIZE = 10;

/**
 * Renders the post grid a page at a time. Every post is already in the payload,
 * so "load more" is a pure client-side reveal with no extra request.
 */
export default function BlogList({ posts }: { posts: BlogPost[] }) {
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
