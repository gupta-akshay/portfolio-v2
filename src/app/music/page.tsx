import type { Metadata } from 'next';
import { Suspense } from 'react';
import Layout from '@/app/components/Layout';
import AudioPlayer from '@/app/components/AudioPlayer';
import LoadingIndicator from '@/app/components/LoadingIndicator';

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

const musicTracks = [
  {
    id: 'Fitoor_-_Yeh_Fitoor_Mera_A-Shay_Remix_Ft._Yash_Kapoor_th4cme',
    title: 'Yeh Fitoor Mera - Remix',
    artist: 'A-Shay Ft. Yash Kapoor',
    cloudinaryPublicId:
      'Fitoor_-_Yeh_Fitoor_Mera_A-Shay_Remix_Ft._Yash_Kapoor_th4cme',
  },
  {
    id: 'RHTDM_-_Zara_Zara_A-Shay_Remix_Final_Mix_1_kwumvv',
    title: 'RHTDM: Zara Zara - Remix',
    artist: 'A-Shay',
    cloudinaryPublicId: 'RHTDM_-_Zara_Zara_A-Shay_Remix_Final_Mix_1_kwumvv',
  },
];

// Separate component for music tracks to use with Suspense
function MusicTracks() {
  return (
    <div className='music-container'>
      <AudioPlayer tracks={musicTracks} />
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
      >
        <div className='container'>
          <div className='title'>
            <h3>My Music.</h3>
          </div>
          <div className='music-description mb-4'>
            <p>
              Welcome to my music collection! Here you can listen to my latest
              remixes and productions. I love experimenting with different
              genres and creating unique sounds. Enjoy the beats!
            </p>
          </div>
          <Suspense fallback={<LoadingIndicator />}>
            <MusicTracks />
          </Suspense>
        </div>
      </section>
    </Layout>
  );
}
