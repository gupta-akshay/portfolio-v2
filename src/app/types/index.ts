// Core types that are actively used across the application

// Skills and Experience types
export interface Skill {
  id: string;
  name: string;
  icon: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  logo?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Audio Player types
export interface Track {
  id: string;
  title: string;
  artist: string;
  path: string;
  duration?: string;
  originalArtist?: string;
  name?: string;
  type?: string;
  year?: number;
}

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  isLightMode: boolean;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}
