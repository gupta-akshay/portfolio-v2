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
  isShuffleActive?: boolean;
  canvasRef: RefObject<HTMLCanvasElement>;
  onClose: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
  onToggleShuffle?: () => void;
  onDownload?: () => void;
  canDownload?: boolean;
  isQueueVisible?: boolean;
  onToggleQueue?: () => void;
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
  isShuffleActive = false,
  canvasRef,
  onClose,
  onPlayPause,
  onPrevious,
  onNext,
  onTimeChange,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onDownload,
  canDownload = false,
  isQueueVisible = false,
  onToggleQueue,
}) => {
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartYRef.current === null) return;

    const touchEndY = e.changedTouches[0]?.clientY;
    if (touchEndY === undefined) return;

    const diffY = touchEndY - touchStartYRef.current;

    // If swiped down significantly, close the player
    if (diffY > 100) {
      onClose();
    }

    touchStartYRef.current = null;
  };

  return (
    <div
      className={`fullScreenPlayer ${isVisible ? 'visible' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className='closeButton'
        onClick={onClose}
        aria-label='Close full screen player'
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <div className='fullScreenContent'>
        <div className='fullScreenTrackInfo'>
          <h2>{currentTrack.name || currentTrack.title}</h2>
          <h3>{currentTrack.artist}</h3>
          <div className='fullScreenTags'>
            {currentTrack.originalArtist && (
              <span className='trackTag originalArtistTag'>
                {currentTrack.originalArtist}
              </span>
            )}
            {currentTrack.type && (
              <span className='trackTag typeTag'>{currentTrack.type}</span>
            )}
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
          isShuffleActive={isShuffleActive}
          onPlayPause={onPlayPause}
          onPrevious={onPrevious}
          onNext={onNext}
          onTimeChange={onTimeChange}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
          onToggleShuffle={onToggleShuffle || (() => {})}
          onDownload={onDownload || (() => {})}
          canDownload={canDownload}
          onToggleQueue={onToggleQueue || (() => {})}
          isQueueVisible={isQueueVisible}
        />
      </div>
    </div>
  );
};

export default FullScreenPlayer;
