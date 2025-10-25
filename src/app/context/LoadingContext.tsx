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
import { LoadingState } from '@/app/types';

interface LoadingContextType extends LoadingState {
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

interface LoadingProviderProps {
  children: ReactNode;
  autoStopTimeout?: number;
  showOverlay?: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({
  children,
  autoStopTimeout = 5000,
  showOverlay = true,
}: LoadingProviderProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
  });
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stop loading when pathname changes (navigation completes)
  useEffect(() => {
    if (loadingState.isLoading) {
      const stopLoading = () => {
        setLoadingState((prev) => ({ ...prev, isLoading: false }));
      };
      stopLoading();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [pathname, loadingState.isLoading]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoize functions to prevent unnecessary re-renders
  const startLoading = useCallback(
    (message?: string) => {
      setLoadingState({ isLoading: true, ...(message && { message }) });

      // Set a timeout to automatically stop loading
      // This is a fallback in case navigation fails or takes too long
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setLoadingState({ isLoading: false });
        timeoutRef.current = null;
      }, autoStopTimeout);
    },
    [autoStopTimeout]
  );

  const stopLoading = useCallback(() => {
    setLoadingState({ isLoading: false });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const setLoadingMessage = useCallback((message: string) => {
    setLoadingState((prev) => ({ ...prev, message }));
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    (): LoadingContextType => ({
      ...loadingState,
      startLoading,
      stopLoading,
      setLoadingMessage,
    }),
    [loadingState, startLoading, stopLoading, setLoadingMessage]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {loadingState.isLoading && showOverlay && (
        <div className='global-loading-overlay'>
          <LoadingIndicator
            {...(loadingState.message && { text: loadingState.message })}
          />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Custom hook for loading state management
export function useLoadingState() {
  const { isLoading, message, startLoading, stopLoading } = useLoading();

  const withLoading = useCallback(
    async <T,>(fn: () => Promise<T>, loadingMessage?: string): Promise<T> => {
      startLoading(loadingMessage);
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    withLoading,
  };
}
