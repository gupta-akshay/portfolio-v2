import React, { RefObject, TouchEvent, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Track } from '../types';
import PlayerControls from './PlayerControls';
import Waveform from './Waveform';

interface FullScreenPlayerProps {
  isVisible: boolean;
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  canvasRef: RefObject<HTMLCanvasElement>;
  onClose: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onDownload?: () => void;
  canDownload?: boolean;
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  isVisible,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLoading,
  canvasRef,
  onClose,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onToggleMute,
  onDownload,
  canDownload,
}) => {
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;

    // If swipe down (positive deltaY) and the swipe is fast enough (less than 300ms)
    // or long enough (more than 100px)
    if (deltaY > 100 || (deltaY > 50 && deltaTime < 300)) {
      onClose();
    }
    touchStartY.current = null;
  };

  return (
    <div
      className={`fullScreenPlayer ${isVisible ? 'visible' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className='closeButton'
        aria-label='Close player'
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <div className='fullScreenContent'>
        <div className='trackDetails'>
          <h4>{currentTrack.name || currentTrack.title}</h4>
          <div className='fullScreenTags'>
            {currentTrack.originalArtist && (
              <span className='trackTag originalArtistTag'>
                {currentTrack.originalArtist}
              </span>
            )}
            {currentTrack.type && (
              <span className='trackTag typeTag'>{currentTrack.type}</span>
            )}
            <span className='trackTag artistTag'>{currentTrack.artist}</span>
          </div>
        </div>

        <div className='visualizerContainer'>
          <Waveform canvasRef={canvasRef} />
        </div>

        <PlayerControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isLoading={isLoading}
          onPlayPause={onPlayPause}
          onPrevious={onPrevious}
          onNext={onNext}
          onTimeChange={onTimeChange}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
          onDownload={onDownload}
          canDownload={canDownload}
        />
      </div>
    </div>
  );
};

export default FullScreenPlayer;
