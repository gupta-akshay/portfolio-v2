import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live/contact'),
  title: 'Contact | Akshay Gupta',
  description:
    'Get in touch with me for collaboration opportunities, project discussions, or any questions you might have.',
  openGraph: {
    type: 'website',
    title: 'Contact Akshay Gupta',
    description:
      'Get in touch with me for collaboration opportunities, project discussions, or any questions you might have.',
    url: 'https://akshaygupta.live/contact',
    siteName: 'Akshay Gupta',
    images: [
      {
        url: 'https://akshaygupta.live/contact/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Contact Akshay Gupta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Akshay Gupta',
    description:
      'Get in touch with me for collaboration opportunities, project discussions, or any questions you might have.',
    creator: '@ashay_music',
    images: ['https://akshaygupta.live/contact/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Akshay Gupta',
    description:
      'Get in touch with me for collaboration opportunities, project discussions, or any questions you might have.',
    url: 'https://akshaygupta.live/contact',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://akshaygupta.live/contact',
    },
    author: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      url: 'https://akshaygupta.live',
    },
    provider: {
      '@type': 'Organization',
      name: 'Akshay Gupta Portfolio',
      url: 'https://akshaygupta.live',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'contact@akshaygupta.live',
        contactType: 'customer support',
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
