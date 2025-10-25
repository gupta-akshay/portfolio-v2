'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ThemeMode, ThemeContextType, ThemeProviderProps } from '@/app/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: ThemeProviderProps) {
  const [isLightMode, setIsLightMode] = useState(defaultTheme === 'light');

  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const isStoredThemeLight = storedTheme === 'theme-light';
    const setTheme = () => {
      setIsLightMode(isStoredThemeLight);
    };
    setTheme();

    // Apply theme to body
    const bodyClassList = document.querySelector('body')?.classList;
    if (isStoredThemeLight) {
      bodyClassList?.add('theme-light');
    } else {
      bodyClassList?.remove('theme-light');
    }
  }, []);

  // Update body class and localStorage when theme changes
  useEffect(() => {
    const bodyClassList = document.querySelector('body')?.classList;
    if (isLightMode) {
      bodyClassList?.add('theme-light');
      localStorage.setItem('theme', 'theme-light');
    } else {
      bodyClassList?.remove('theme-light');
      localStorage.setItem('theme', 'theme-dark');
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

// Custom hook for theme preferences
export function useThemePreference() {
  const { mode, setTheme } = useTheme();

  const setSystemTheme = useCallback(() => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, [setTheme]);

  return {
    mode,
    setTheme,
    setSystemTheme,
  };
}
