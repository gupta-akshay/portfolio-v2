import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import MusicTracks from '@/app/music/components/MusicTracks';
import {
  InteractiveBackground,
  TextAnimation,
  StaggerAnimation,
} from '@/app/components';

export const metadata: Metadata = {
  metadataBase: new URL('https://akshaygupta.live/music'),
  title: 'My Music | Akshay Gupta',
  description:
    'Listen to my latest remixes and music productions. Enjoy the beats!',
  openGraph: {
    type: 'music.playlist',
    title: 'My Music | Akshay Gupta',
    description:
      'Listen to my latest remixes and music productions. Enjoy the beats!',
    url: 'https://akshaygupta.live/music',
    siteName: 'Akshay Gupta Music',
    images: [
      {
        url: 'https://akshaygupta.live/music/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Akshay Gupta Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Music | Akshay Gupta',
    description:
      'Listen to my latest remixes and music productions. Enjoy the beats!',
    creator: '@ashay_music',
    images: ['https://akshaygupta.live/music/opengraph-image.png'],
  },
  alternates: {
    canonical: 'https://akshaygupta.live/music',
  },
};

export default function Music() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: 'Akshay Gupta Music Collection',
    description: 'Listen to my remixes and music productions. Enjoy the beats!',
    url: 'https://akshaygupta.live/music',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://akshaygupta.live/music',
    },
    creator: {
      '@type': 'Person',
      name: 'Akshay Gupta',
      url: 'https://akshaygupta.live',
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
        <InteractiveBackground
          variant='grid'
          count={20}
          color='#2fbf71'
          size={40}
          speed={0.6}
          intensity={0.5}
          interactive={true}
          className='music-background'
        />
        <div className='container' style={{ position: 'relative', zIndex: 10 }}>
          <TextAnimation duration={1.0} delay={0.1}>
            <div className='title'>
              <h3>My Music.</h3>
            </div>
          </TextAnimation>
          <StaggerAnimation staggerDelay={0.1} scrollReveal={true}>
            <div className='music-description mb-4'>
              <p>
                Hey there! 🎧 Welcome to my music collection! I love
                experimenting with different genres and crafting unique sounds
                that blend styles in unexpected ways. Whether it&apos;s a fresh
                remix or an original production, every track is a piece of my
                creative journey.
              </p>
              <p>Hit play, turn up the volume, and enjoy the beats! 🚀</p>
            </div>
          </StaggerAnimation>
          <Suspense fallback={<LoadingIndicator />}>
            <MusicTracks />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
