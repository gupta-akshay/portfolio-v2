import type { TechIconName } from '@/app/components/Icon/techIcons';

// Core types that are actively used across the application

// Skills and Experience types
export interface Skill {
  id: string;
  name: string;
  /** Technology logo rendered by the Icon component */
  icon: TechIconName;
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

// Audio Player types
export interface Track {
  id: string;
  title: string;
  artist: string;
  path: string;
  /** Exact length in seconds, precomputed by scripts/generate-track-peaks.mjs */
  duration?: number;
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
}
