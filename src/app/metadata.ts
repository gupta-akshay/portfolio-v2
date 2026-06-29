import type { Metadata } from 'next';
import { getYearsOfExperience } from './utils/helpers/format';

const years = getYearsOfExperience();
const experienceDesc = `Senior Staff Engineer at PeopleGrove with over ${years} years of experience in web development. Specialized in building user-friendly and powerful web applications.`;

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live'),
  title: 'Akshay Gupta | Full-Stack Web Developer',
  description: experienceDesc,
  openGraph: {
    type: 'website',
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description: experienceDesc,
    url: 'https://akshaygupta.live',
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: 'https://akshaygupta.live/images/home-banner.webp',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta - Senior Staff Engineer at PeopleGrove',
        type: 'image/webp',
        secureUrl: 'https://akshaygupta.live/images/home-banner.webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akshay Gupta | Full-Stack Web Developer',
    description: experienceDesc,
    creator: '@ashay_music',
    images: ['https://akshaygupta.live/images/home-banner.webp'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live',
  },
};
