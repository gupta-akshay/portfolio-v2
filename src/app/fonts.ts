import { Rubik, Cookie } from 'next/font/google';

export const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  variable: '--font-rubik',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
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
