'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { usePathname } from 'next/navigation';
import LoadingIndicator from '@/app/components/LoadingIndicator';

type LoadingContextType = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stop loading when pathname changes (navigation completes)
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [pathname, isLoading]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoize functions to prevent unnecessary re-renders
  const startLoading = useCallback(() => {
    setIsLoading(true);

    // Set a timeout to automatically stop loading after 5 seconds
    // This is a fallback in case navigation fails or takes too long
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      timeoutRef.current = null;
    }, 5000);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ isLoading, startLoading, stopLoading }),
    [isLoading, startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {isLoading && <LoadingIndicator />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
