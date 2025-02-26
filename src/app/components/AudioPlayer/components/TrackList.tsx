import React from 'react';
import { Track } from '../types';
import { formatTime } from '../utils';

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  onTrackSelect: (index: number) => void;
  trackDurations: {[id: string]: number};
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  currentTrackIndex, 
  onTrackSelect,
  trackDurations
}) => {
  // Get track duration - use cached value, provided value, or loading placeholder
  const getTrackDuration = (track: Track) => {
    if (trackDurations[track.id]) {
      return formatTime(trackDurations[track.id]);
    } else if (track.duration) {
      return track.duration;
    } else {
      return '...';
    }
  };

  return (
    <div className="trackList">
      <h4>Playlist</h4>
      <ul>
        {tracks.map((track, index) => (
          <li 
            key={track.id} 
            className={`trackItem ${currentTrackIndex === index ? 'active' : ''}`}
            onClick={() => onTrackSelect(index)}
          >
            <div className="trackInfo">
              <span className="trackTitle">{track.title}</span>
              <span className="trackArtist">{track.artist}</span>
            </div>
            <span className="trackDuration">{getTrackDuration(track)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
