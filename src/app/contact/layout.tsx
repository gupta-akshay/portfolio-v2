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
        url: '/images/about-me.png',
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
    images: ['/images/about-me.png'],
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
  return children;
}
