'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type ThemeContextType = {
  isLightMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isLightMode, setIsLightMode] = useState(false);

  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const isStoredThemeLight = storedTheme === 'theme-light';
    setIsLightMode(isStoredThemeLight);

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

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 