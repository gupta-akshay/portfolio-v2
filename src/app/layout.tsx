import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { config } from '@fortawesome/fontawesome-svg-core';
import { rubik } from './fonts';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import { CursorProvider } from './context/CursorContext';
import { EasterEggProvider } from './context/EasterEggContext';
import CustomCursor from './components/CustomCursor';
import MatrixRain from './components/MatrixRain';
import DiscoMode from './components/DiscoMode';
import DiscoModeGlobalStyles from './components/DiscoModeGlobalStyles/DiscoModeGlobalStyles';
import BlogTypewriterEffect from './components/BlogTypewriterEffect';
import EasterEggHints from './components/EasterEggHints';
import Metrics from './metrics';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'devicon/devicon.min.css';
import './styles/globals.scss';

config.autoAddCss = false;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live'),
  title: {
    default: 'Akshay Gupta | Full-Stack Web Developer',
    template: '%s | Akshay Gupta',
  },
  description:
    'Senior Staff Engineer at PeopleGrove with over 7 years of experience in web development.',
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
  twitter: {
    card: 'summary_large_image',
    creator: '@ashay_music',
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description:
      'Senior Staff Engineer at PeopleGrove with over 7 years of experience in web development.',
    images: ['https://akshaygupta.live/images/about-me.png'],
  },
  verification: {
    google: 'rcbqH3Qckh-CLqTHJHg3ze_tDDYoEMWKxrS4qWy1Bb0',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${rubik.variable}`}>
        <a href='#main-content' className='skip-link'>
          Skip to main content
        </a>
        <ThemeProvider>
          <CursorProvider>
            <EasterEggProvider>
              <LoadingProvider>{children}</LoadingProvider>
              <CustomCursor />
              <MatrixRain />
              <DiscoMode />
              <DiscoModeGlobalStyles />
              <BlogTypewriterEffect />
              <EasterEggHints />
            </EasterEggProvider>
          </CursorProvider>
        </ThemeProvider>
        <Metrics />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
