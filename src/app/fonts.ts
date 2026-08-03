import { Space_Grotesk, Space_Mono, Cookie } from 'next/font/google';

// Neo-brutalism runs on a single dominant grotesk: 700-900 for all display,
// 400-500 for body. Space Mono carries numerals, badges and metadata.
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-grotesk',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
});

export const cookie = Cookie({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--font-cookie',
  display: 'swap',
  preload: true,
  fallback: ['cursive'],
});
