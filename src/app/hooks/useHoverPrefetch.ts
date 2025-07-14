import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

interface UseHoverPrefetchOptions {
  delay?: number;
  enabled?: boolean;
}

export const useHoverPrefetch = (
  href: string,
  options: UseHoverPrefetchOptions = {}
) => {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { delay = 100, enabled = true } = options;

  const prefetch = useCallback(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to prefetch after the delay
    timeoutRef.current = setTimeout(() => {
      router.prefetch(href);
    }, delay);
  }, [router, href, delay, enabled]);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    prefetch();
  }, [prefetch]);

  const handleMouseLeave = useCallback(() => {
    cancelPrefetch();
  }, [cancelPrefetch]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    prefetch,
    cancelPrefetch,
  };
};
