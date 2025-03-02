'use client';

import { useEffect, useState, useMemo } from 'react';
import AudioPlayer from '@/app/components/AudioPlayer';
import MusicLoadingIndicator from '@/app/music/components/MusicLoadingIndicator';
import { Track } from '@/app/components/AudioPlayer/types';
import { getAudioFilesList } from '@/app/utils/aws';
import TrackSearch from '@/app/music/components/TrackSearch';

function MusicTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter tracks based on search query
  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) {
      return tracks;
    }

    const query = searchQuery.toLowerCase().trim();

    return tracks.filter((track) => {
      // Search in track name
      const nameMatch = (track.name || track.title)
        .toLowerCase()
        .includes(query);

      // Search in original artist
      const originalArtistMatch =
        track.originalArtist?.toLowerCase().includes(query) || false;

      // Search in type
      const typeMatch = track.type?.toLowerCase().includes(query) || false;

      // Return true if any field matches
      return nameMatch || originalArtistMatch || typeMatch;
    });
  }, [tracks, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (isLoading) {
    return <MusicLoadingIndicator />;
  }

  return (
    <div className='music-container'>
      <TrackSearch onSearch={handleSearch} searchQuery={searchQuery} />
      <div className='search-results-info'>
        {searchQuery && (
          <p className='filter-info'>
            Showing {filteredTracks.length} of {tracks.length} tracks
          </p>
        )}
      </div>
      <AudioPlayer tracks={filteredTracks} searchQuery={searchQuery} />
    </div>
  );
}

export default MusicTracks;
