import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { rubik, cookie } from './fonts';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import DeviconCSSLoader from './components/DeviconCSSLoader';
import Metrics from './metrics';
import { getSiteUrl } from '@/lib/site-url';
import { getYearsOfExperience } from './utils/helpers/format';

import './styles/globals.scss';

const siteUrl = getSiteUrl();
const experienceDesc = `Senior Staff Engineer at PeopleGrove with over ${getYearsOfExperience()} years of experience in web development.`;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Akshay Gupta | Full-Stack Web Developer',
    template: '%s | Akshay Gupta',
  },
  description:
    experienceDesc,
  keywords: [
    'web development',
    'full-stack developer',
    'akshay gupta',
    'portfolio',
    'senior staff engineer',
    'javascript',
    'react',
    'next.js',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Akshay Gupta',
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description:
      experienceDesc,
    url: siteUrl,
    locale: 'en_US',
    images: [
      {
        url: '/images/about-me.webp',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta - Full-Stack Web Developer',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@ashay_music',
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description:
      experienceDesc,
    images: ['/images/about-me.webp'],
  },
  verification: {
    google: 'rcbqH3Qckh-CLqTHJHg3ze_tDDYoEMWKxrS4qWy1Bb0',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
};

const themeInitScript = `try{var t=localStorage.getItem('theme');if(t==='theme-light'){document.documentElement.classList.add('theme-light');if(document.body)document.body.classList.add('theme-light')}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${rubik.variable} ${cookie.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <a href='#main-content' className='skip-link'>
          Skip to main content
        </a>
        <ThemeProvider>
          <LoadingProvider>{children}</LoadingProvider>
          <DeviconCSSLoader />
        </ThemeProvider>
        <Metrics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
