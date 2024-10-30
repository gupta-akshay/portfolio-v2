import { Rubik, Playfair_Display } from 'next/font/google';

export const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-rubik',
});

// export const playfair = Playfair_Display({
//   subsets: ['latin'],
//   variable: '--font-playfair',
// });
