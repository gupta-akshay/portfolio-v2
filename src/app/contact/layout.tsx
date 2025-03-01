import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Akshay Gupta',
  description:
    'Get in touch with me for collaboration opportunities, project discussions, or any questions you might have.',
  openGraph: {
    title: 'Contact Akshay Gupta',
    description:
      'Get in touch with me for collaboration opportunities, project discussions, or any questions you might have.',
    type: 'website',
    images: [
      {
        url: 'https://akshaygupta.live/images/about-me.png',
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
    images: ['https://akshaygupta.live/images/about-me.png'],
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
      '@type': 'Person',
      name: 'Akshay Gupta',
      email: 'contact@akshaygupta.live',
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
