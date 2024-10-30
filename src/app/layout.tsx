import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import { rubik, playfair } from './fonts';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'devicon/devicon.min.css';
import './styles/globals.scss';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Akshay Gupta | Full-Stack Web Developer',
  description: `Akshay Gupta | Full-Stack Web Developer | I am a Staff Engineer at PeopleGrove, a company that provides online mentoring and networking solutions for students and professionals. I have over six years of experience in web development.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${playfair.variable}`}>{children}</body>
    </html>
  )
}
