import type { Metadata } from 'next';
import { getSiteUrl } from './site-url';

interface PageMetadataOptions {
  title: string;
  socialTitle: string;
  description: string;
  path: string;
  imageAlt: string;
  type?: 'website' | 'profile' | 'music.playlist';
}

export function createPageMetadata({
  title,
  socialTitle,
  description,
  path,
  imageAlt,
  type = 'website',
}: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const image = `${path}/opengraph-image`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      type,
      title: socialTitle,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'Akshay Gupta',
      locale: 'en_US',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      creator: '@ashay_music',
      images: [image],
    },
    alternates: { canonical: `${siteUrl}${path}` },
  };
}
