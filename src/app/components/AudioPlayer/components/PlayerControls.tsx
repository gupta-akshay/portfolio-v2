import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../utils';

interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onToggleMute
}) => {
  return (
    <>
      <div className="timeControls">
        <span className="currentTime">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={onTimeChange}
          className="progressBar"
          aria-label="Seek time"
        />
        <span className="totalTime">{formatTime(duration)}</span>
      </div>
      
      <div className="controls">
        <button 
          onClick={onPrevious} 
          className="controlButton"
          aria-label="Previous track"
        >
          <FontAwesomeIcon icon={faBackward as IconProp} />
        </button>
        <button 
          onClick={onPlayPause} 
          className={`controlButton playButton`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <FontAwesomeIcon icon={(isPlaying ? faPause : faPlay) as IconProp} />
        </button>
        <button 
          onClick={onNext} 
          className="controlButton"
          aria-label="Next track"
        >
          <FontAwesomeIcon icon={faForward as IconProp} />
        </button>
        <div className="volumeControl">
          <button 
            onClick={onToggleMute} 
            className="muteButton"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            <FontAwesomeIcon icon={(isMuted ? faVolumeMute : faVolumeHigh) as IconProp} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="volumeSlider"
            aria-label="Volume"
          />
        </div>
      </div>
    </>
  );
};

export default PlayerControls;
