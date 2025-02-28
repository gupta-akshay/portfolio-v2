import React, { RefObject, useEffect, useRef, useState, TouchEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { Track } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MiniPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  isLoading: boolean;
  miniCanvasRef: RefObject<HTMLCanvasElement>;
  onPlayPause: () => void;
  onExpand: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying,
  isLoading,
  miniCanvasRef,
  onPlayPause,
  onExpand,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        const isTextOverflowing = titleRef.current.scrollWidth > titleRef.current.clientWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();
    // Also check on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [currentTrack.title]); // Re-check when track title changes

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartY.current === null) return;

    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY.current;

    // If swipe up (negative deltaY) and the swipe distance is more than 50px
    if (deltaY < -50) {
      onExpand();
    }
    touchStartY.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on control buttons
    if (
      e.target instanceof Element &&
      (e.target.closest('.controlButton') || e.target.closest('.expandButton'))
    ) {
      return;
    }
    onExpand();
  };

  return (
    <div 
      className='miniPlayer'
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className='miniPlayerContent'>
        <div className='miniVisualizer'>
          <canvas
            ref={miniCanvasRef}
            width={50}
            height={50}
            className={isPlaying ? 'pulsing' : ''}
          />
        </div>
        <div className='miniTrackInfo'>
          <h4 ref={titleRef} className={isOverflowing ? 'scrolling' : ''}>
            {isOverflowing ? (
              <span 
                className='scrollingText'
                data-content={currentTrack.title}
              >
                {currentTrack.title}
              </span>
            ) : (
              currentTrack.title
            )}
          </h4>
          <p>{currentTrack.artist}</p>
        </div>
      </div>
      <div className='miniControls'>
        <button
          onClick={onPlayPause}
          className='controlButton'
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
          onClick={onExpand}
          className='expandButton'
          aria-label='Show full player'
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
