import React, { KeyboardEvent } from 'react';
import { Track } from '../types';

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  onTrackSelect: (index: number) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackIndex,
  onTrackSelect,
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

  return (
    <div className='trackList'>
      <h4 id='playlist-heading'>Playlist</h4>
      <ul
        role='listbox'
        aria-labelledby='playlist-heading'
        tabIndex={0}
        className='track-list-container'
      >
        {tracks.map((track, index) => (
          <li
            key={track.id}
            className={`trackItem ${currentTrackIndex === index ? 'active' : ''}`}
            onClick={() => onTrackSelect(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role='option'
            aria-selected={currentTrackIndex === index}
            tabIndex={0}
            data-track-index={index}
          >
            <div className='trackInfo'>
              <span className='trackTitle'>{track.title}</span>
              <span className='trackArtist'>{track.artist}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
