import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@/app/styles/globals.scss';

config.autoAddCss = false;

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Akshay Gupta | Full-Stack Web Developer',
  description: `Akshay Gupta | Full-Stack Web Developer | I am a Staff Engineer at PeopleGrove, a company that provides online mentoring and networking solutions for students and professionals. I have over six years of experience in web development.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang='en'>
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
