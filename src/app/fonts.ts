import { Rubik } from 'next/font/google';

export const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal'],
  variable: '--font-rubik',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});
