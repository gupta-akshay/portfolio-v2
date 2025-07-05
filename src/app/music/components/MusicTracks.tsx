'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MusicLoadingIndicator from './MusicLoadingIndicator';
import { Track } from '@/app/components/AudioPlayer/types';
import { getAudioFilesList } from '@/app/utils/aws';

const AudioPlayer = dynamic(() => import('@/app/components/AudioPlayer'), {
  loading: () => <MusicLoadingIndicator />,
  ssr: false,
});

function MusicTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const tracksList = await getAudioFilesList();
        setTracks(tracksList);
      } catch (err) {
        setError('Failed to load tracks. Please try again later.');
        console.error('Error fetching tracks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (isLoading) {
    return <MusicLoadingIndicator />;
  }

  return (
    <div className='music-container'>
      <AudioPlayer tracks={tracks} />
    </div>
  );
}

export default MusicTracks;
