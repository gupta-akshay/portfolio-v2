import { getSiteUrl } from '@/lib/site-url';
import { contactContent } from '@/lib/site-content';
import { createPageMetadata } from '@/lib/metadata';

const siteUrl = getSiteUrl();
const contactDescription = contactContent.intro;

export const metadata = createPageMetadata({
  title: 'Contact',
  description: contactDescription,
  socialTitle: 'Contact Akshay Gupta',
  path: '/contact',
  imageAlt: 'Contact Akshay Gupta - Professional inquiries and collaboration',
});

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
