'use client';

import dynamic from 'next/dynamic';
import MusicLoadingIndicator from './MusicLoadingIndicator';
import { Track } from '@/app/types';

const AudioPlayer = dynamic(
  () => import('@/app/components/AudioPlayer/AudioPlayer'),
  {
    loading: () => <MusicLoadingIndicator />,
    ssr: false,
  }
);

function MusicTracks({ tracks }: { tracks: Track[] }) {
  return (
    <div className='music-container'>
      <AudioPlayer tracks={tracks} />
    </div>
  );
}

export default MusicTracks;
