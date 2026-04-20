'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode, ThemeContextType, ThemeProviderProps } from '@/app/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readInitialTheme(defaultTheme: ThemeMode): boolean {
  if (typeof document === 'undefined') return defaultTheme === 'light';
  // Inline script in layout.tsx sets `theme-light` on documentElement/body
  // before hydration, so this matches what the user already sees.
  return (
    document.documentElement.classList.contains('theme-light') ||
    document.body?.classList.contains('theme-light') ||
    false
  );
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const [isLightMode, setIsLightMode] = useState<boolean>(() =>
    readInitialTheme(defaultTheme),
  );

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    if (isLightMode) {
      body?.classList.add('theme-light');
      root.classList.add('theme-light');
      try {
        localStorage.setItem('theme', 'theme-light');
      } catch {
        /* localStorage unavailable */
      }
    } else {
      body?.classList.remove('theme-light');
      root.classList.remove('theme-light');
      try {
        localStorage.setItem('theme', 'theme-dark');
      } catch {
        /* localStorage unavailable */
      }
    }
  }, [isLightMode]);

  const toggleTheme = useCallback(() => {
    setIsLightMode((prev) => !prev);
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setIsLightMode(mode === 'light');
  }, []);

  const value: ThemeContextType = {
    isLightMode,
    mode: isLightMode ? 'light' : 'dark',
    toggleTheme,
    setTheme,
  };

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
