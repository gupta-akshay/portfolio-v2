import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import AudioPlayer from '@/app/components/AudioPlayer';
import LoadingIndicator from '@/app/components/LoadingIndicator';
import { Track } from '@/app/components/AudioPlayer/types';

export const metadata: Metadata = {
  title: 'My Music | Akshay Gupta',
  description:
    'Listen to my latest remixes and music productions. Enjoy the beats!',
  openGraph: {
    title: 'My Music | Akshay Gupta',
    description:
      'Listen to my latest remixes and music productions. Enjoy the beats!',
    type: 'music.playlist',
    images: [
      {
        url: 'https://akshaygupta.dev/images/about-me.png',
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
    images: ['https://akshaygupta.dev/images/about-me.png'],
    creator: '@akshay_gupta_',
  },
};

// Separate component for music tracks to use with Suspense
async function MusicTracks() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://akshaygupta.live');

  const response = await fetch(`${baseUrl}/api/music`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tracks');
  }

  const tracks: Track[] = await response.json();

  return (
    <div className='music-container'>
      <AudioPlayer tracks={tracks} />
    </div>
  );
}

export default function Music() {
  return (
    <Layout>
      <section
        id='music'
        data-nav-tooltip='Music'
        className='pp-section pp-scrollable section'
        tabIndex={0}
        role='region'
        aria-label='Music Section'
      >
        <div className='container'>
          <div className='title'>
            <h3>My Music.</h3>
          </div>
          <div className='music-description mb-4'>
            <p>
              Hey there! 🎧 Welcome to my music collection! I love experimenting
              with different genres and crafting unique sounds that blend styles
              in unexpected ways. Whether it&apos;s a fresh remix or an original
              production, every track is a piece of my creative journey.
            </p>
            <p>Hit play, turn up the volume, and enjoy the beats! 🚀</p>
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <MusicTracks />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
