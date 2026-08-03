'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import LoadingIndicator from '@/app/components/LoadingIndicator';

const LoadingContext = createContext<() => void>(() => {});

export function LoadingProvider({ children }: { children: ReactNode }) {
  // The route we started navigating away from. Once the pathname differs the
  // navigation has landed, so the overlay clears itself without an effect.
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const pathname = usePathname();
  const isLoading = pendingFrom !== null && pendingFrom === pathname;

  // Fallback for a navigation that never lands, so the overlay can't strand
  // the page behind it.
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setPendingFrom(null), 5000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={() => setPendingFrom(pathname)}>
      {isLoading && (
        <div className='global-loading-overlay'>
          <LoadingIndicator />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): () => void {
  return useContext(LoadingContext);
}
