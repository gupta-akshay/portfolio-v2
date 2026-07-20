import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { contactContent } from '@/lib/site-content';

const siteUrl = getSiteUrl();
const contactDescription = contactContent.intro;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Contact',
  description: contactDescription,
  openGraph: {
    type: 'website',
    title: 'Contact Akshay Gupta',
    description: contactDescription,
    url: `${siteUrl}/contact`,
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: '/contact/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Contact Akshay Gupta - Professional inquiries and collaboration',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Akshay Gupta',
    description: contactDescription,
    creator: '@ashay_music',
    images: ['/contact/opengraph-image'],
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Akshay Gupta',
    description: contactDescription,
    url: `${siteUrl}/contact`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/contact`,
    },
    author: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Akshay Gupta',
      url: siteUrl,
    },
    mainEntity: {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Akshay Gupta',
      url: siteUrl,
      email: contactContent.emails[0],
      contactPoint: {
        '@type': 'ContactPoint',
        email: contactContent.emails[0],
        contactType: 'professional inquiries',
      },
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
