'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    Sentry.metrics.count('blog.post.view', 1, { attributes: { slug } });
  }, [slug]);
  return null;
}
