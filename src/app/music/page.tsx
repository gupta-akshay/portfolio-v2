import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import MusicTracks from '@/app/music/components/MusicTracks';
import { getSiteUrl } from '@/lib/site-url';
import { musicContent } from '@/lib/site-content';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'My Music',
  description:
    'Listen to my latest remixes and music productions. Enjoy the beats!',
  openGraph: {
    type: 'music.playlist',
    title: 'My Music | Akshay Gupta',
    description:
      'Listen to my latest remixes and music productions. Enjoy the beats!',
    url: `${siteUrl}/music`,
    siteName: 'Akshay Gupta',
    locale: 'en_US',
    images: [
      {
        url: '/music/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta Music - Listen to my latest remixes and productions',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Music | Akshay Gupta',
    description:
      'Listen to my latest remixes and music productions. Enjoy the beats!',
    creator: '@ashay_music',
    images: ['/music/opengraph-image'],
  },
  alternates: {
    canonical: `${siteUrl}/music`,
  },
};

export default function Music() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Akshay Gupta Music Collection',
    description: 'Listen to my remixes and music productions. Enjoy the beats!',
    url: `${siteUrl}/music`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/music`,
    },
    creator: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      url: siteUrl,
    },
  };

  return (
    <Layout>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        id='music'
        data-nav-tooltip='Music'
        className='pp-section pp-scrollable section music-section'
        tabIndex={0}
        role='region'
        aria-label='Music Section'
        style={{
          position: 'relative',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <div className='title'>
            <h3>Music</h3>
          </div>
          <div className='music-description route-shell mb-4'>
            {musicContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <MusicTracks />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
