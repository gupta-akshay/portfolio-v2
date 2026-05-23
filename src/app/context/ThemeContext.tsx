'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { ThemeMode, ThemeContextType, ThemeProviderProps } from '@/app/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- External store ---------------------------------------------------------
// The inline script in layout.tsx applies `theme-light` to the document pre-
// hydration. We treat that document state as the source of truth on the
// client via useSyncExternalStore so:
//   - SSR and first client render both return `getServerSnapshot` (derived
//     from `defaultTheme`), avoiding hydration mismatches.
//   - After hydration React reconciles to the real DOM-derived value in a
//     single commit driven by the store, not a chained setState in useEffect.

type Listener = () => void;

interface ThemeStore {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => boolean;
  setIsLight: (next: boolean) => void;
}

function createThemeStore(): ThemeStore {
  const listeners = new Set<Listener>();
  let current: boolean | null = null;

  const readDom = (): boolean =>
    document.documentElement.classList.contains('theme-light') ||
    document.body?.classList.contains('theme-light') ||
    false;

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot() {
      if (current === null) current = readDom();
      return current;
    },
    setIsLight(next) {
      if (current === next) return;
      current = next;
      const root = document.documentElement;
      const body = document.body;
      if (next) {
        root.classList.add('theme-light');
        body?.classList.add('theme-light');
      } else {
        root.classList.remove('theme-light');
        body?.classList.remove('theme-light');
      }
      try {
        localStorage.setItem('theme', next ? 'theme-light' : 'theme-dark');
      } catch {
        /* localStorage unavailable (private mode, quota, etc.) */
      }
      listeners.forEach((l) => l());
    },
  };
}

// Created lazily on the client only; server never touches it.
let themeStore: ThemeStore | null = null;
function getThemeStore(): ThemeStore {
  if (!themeStore) themeStore = createThemeStore();
  return themeStore;
}

const noopSubscribe: (listener: Listener) => () => void = () => () => {};
const isServer = typeof window === 'undefined';
const subscribe: (listener: Listener) => () => void = isServer
  ? noopSubscribe
  : (listener) => getThemeStore().subscribe(listener);
const getClientSnapshot = (): boolean => getThemeStore().getSnapshot();

// ---------------------------------------------------------------------------

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const getServerSnapshot = useCallback(
    () => defaultTheme === 'light',
    [defaultTheme],
  );

  const isLightMode = useSyncExternalStore(
    subscribe,
    isServer ? getServerSnapshot : getClientSnapshot,
    getServerSnapshot,
  );

  const toggleTheme = useCallback(() => {
    const store = getThemeStore();
    store.setIsLight(!store.getSnapshot());
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    getThemeStore().setIsLight(mode === 'light');
  }, []);

  const value = useMemo<ThemeContextType>(
    () => ({
      isLightMode,
      mode: isLightMode ? 'light' : 'dark',
      toggleTheme,
      setTheme,
    }),
    [isLightMode, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
