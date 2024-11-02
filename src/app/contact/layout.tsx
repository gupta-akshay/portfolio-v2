import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Akshay Gupta',
  description:
    'Get in touch with me for collaboration opportunities, project discussions, or just to say hello!',
  openGraph: {
    title: 'Contact Akshay Gupta',
    description:
      'Get in touch with me for collaboration opportunities or project discussions.',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
