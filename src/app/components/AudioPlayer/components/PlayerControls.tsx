import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faBackward,
  faForward,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '../utils';
import LoadingSpinner from './LoadingSpinner';

export interface PlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading?: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

const PlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLoading = false,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onToggleMute,
}: PlayerControlsProps) => {
  return (
    <>
      <div className='timeControls'>
        <span className='currentTime'>{formatTime(currentTime)}</span>
        <input
          type='range'
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={onTimeChange}
          className='progressBar'
          aria-label='Seek time'
          disabled={isLoading}
        />
        <span className='totalTime'>{formatTime(duration)}</span>
      </div>

      <div className='controls'>
        <div className='mainControls'>
          <button
            onClick={onPrevious}
            className='controlButton'
            aria-label='Previous track'
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>

          <button
            onClick={onPlayPause}
            className='controlButton playButton'
            aria-label={isPlaying ? 'Pause' : 'Play'}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            )}
          </button>

          <button
            onClick={onNext}
            className='controlButton'
            aria-label='Next track'
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>

        <div className='volumeControl'>
          <button
            onClick={onToggleMute}
            className='muteButton'
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeHigh} />
          </button>
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeChange}
            className='volumeSlider'
            aria-label='Volume'
          />
        </div>
      </div>
    </>
  );
};

export default PlayerControls;
