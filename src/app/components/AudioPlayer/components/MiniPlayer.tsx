import React, {
  RefObject,
  useEffect,
  useRef,
  useState,
  TouchEvent,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faChevronUp,
  faDownload,
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
  onDownload?: () => void;
  canDownload?: boolean;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying,
  isLoading,
  miniCanvasRef,
  onPlayPause,
  onExpand,
  onDownload,
  canDownload = false,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const displayTitle = currentTrack.name || currentTrack.title;

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        const isTextOverflowing =
          titleRef.current.scrollWidth > titleRef.current.clientWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();
    // Also check on window resize
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [displayTitle]); // Re-check when track title changes

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
      (e.target.closest('.controlButton') ||
        e.target.closest('.expandButton') ||
        e.target.closest('.downloadButton'))
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
              <span className='scrollingText' data-content={displayTitle}>
                {displayTitle}
              </span>
            ) : (
              displayTitle
            )}
          </h4>
          <div className='miniPlayerTags'>
            {currentTrack.type && (
              <span className='miniTag typeTag'>{currentTrack.type}</span>
            )}
            <span className='miniTag artistTag'>{currentTrack.artist}</span>
          </div>
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

        {canDownload && onDownload && (
          <button
            onClick={onDownload}
            className='controlButton downloadButton'
            aria-label='Download track'
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        )}

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
