import React, { KeyboardEvent } from 'react';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  onTrackSelect: (index: number) => void;
  searchQuery?: string;
  isMobile?: boolean;
}

// Helper function to highlight matching text
const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(`(${query.trim()})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    return regex.test(part) ? (
      <span key={i} className='highlight-match'>
        {part}
      </span>
    ) : (
      part
    );
  });
};

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackIndex,
  onTrackSelect,
  searchQuery = '',
  isMobile = false,
}) => {
  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, index: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ': // Space
        e.preventDefault();
        onTrackSelect(index);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          const prevTrack = document.querySelector(
            `[data-track-index="${index - 1}"]`
          ) as HTMLElement;
          prevTrack?.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < tracks.length - 1) {
          const nextTrack = document.querySelector(
            `[data-track-index="${index + 1}"]`
          ) as HTMLElement;
          nextTrack?.focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        const firstTrack = document.querySelector(
          '[data-track-index="0"]'
        ) as HTMLElement;
        firstTrack?.focus();
        break;
      case 'End':
        e.preventDefault();
        const lastTrack = document.querySelector(
          `[data-track-index="${tracks.length - 1}"]`
        ) as HTMLElement;
        lastTrack?.focus();
        break;
    }
  };

  const normalizedQuery = searchQuery.toLowerCase().trim();
  const hasNoTracks = tracks.length === 0;

  return (
    <div className={`trackList ${isMobile ? 'mobile' : ''}`}>
      {hasNoTracks ? null : (
        <ul
          role='listbox'
          aria-labelledby='playlist-heading'
          tabIndex={0}
          className='track-list-container'
        >
          {tracks.map((track, index) => {
            const displayName = track.name || track.title;

            return (
              <li
                key={track.id}
                className={`trackItem ${currentTrackIndex === index ? 'active' : ''} ${isMobile ? 'mobile' : ''}`}
                onClick={() => onTrackSelect(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role='option'
                aria-selected={currentTrackIndex === index}
                tabIndex={0}
                data-track-index={index}
              >
                <div className='trackInfo'>
                  <span className='trackTitle'>
                    {normalizedQuery
                      ? highlightMatch(displayName, normalizedQuery)
                      : displayName}
                  </span>
                  <div className='trackTags'>
                    {track.originalArtist && (
                      <span className='trackTag originalArtistTag'>
                        {normalizedQuery
                          ? highlightMatch(
                              track.originalArtist,
                              normalizedQuery
                            )
                          : track.originalArtist}
                      </span>
                    )}
                    {track.type && (
                      <span className='trackTag typeTag'>
                        {normalizedQuery
                          ? highlightMatch(track.type, normalizedQuery)
                          : track.type}
                      </span>
                    )}
                    <span className='trackTag artistTag'>{track.artist}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TrackList;
