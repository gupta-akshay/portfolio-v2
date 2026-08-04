// Core types that are actively used across the application

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
