import { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faBackward,
  faForward,
  faVolumeHigh,
  faVolumeMute,
  faDownload,
  faShuffle,
  faList,
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
  isShuffleActive: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onDownload?: () => void;
  canDownload?: boolean;
  onToggleQueue: () => void;
  isQueueVisible: boolean;
}

const PlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLoading = false,
  isShuffleActive,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onDownload,
  canDownload = false,
  onToggleQueue,
  isQueueVisible,
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
          step={0.01}
        />
        <span className='totalTime'>{formatTime(duration)}</span>
      </div>

      <div className='controls'>
        <div className='queueControl'>
          <button
            onClick={onToggleQueue}
            className={`controlButton ${isQueueVisible ? 'active' : ''}`}
            aria-label={isQueueVisible ? 'Hide queue' : 'Show queue'}
            title={isQueueVisible ? 'Hide queue' : 'Show queue'}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>

        <div className='playbackControls'>
          <button
            onClick={onToggleShuffle}
            className={`controlButton ${isShuffleActive ? 'active' : ''}`}
            aria-label={isShuffleActive ? 'Disable shuffle' : 'Enable shuffle'}
            title={isShuffleActive ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <FontAwesomeIcon icon={faShuffle} />
          </button>
        </div>

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

        {canDownload && onDownload && (
          <div className='downloadControl'>
            <button
              onClick={onDownload}
              className='controlButton downloadButton'
              aria-label='Download track'
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        )}

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
