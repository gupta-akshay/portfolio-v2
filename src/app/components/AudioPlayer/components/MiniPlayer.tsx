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
  faExpand,
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
  onPrevious?: () => void;
  onNext?: () => void;
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
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Check if title needs scrolling
  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement) {
      setIsScrolling(titleElement.scrollWidth > titleElement.clientWidth);
    }
  }, [currentTrack]);

  // Handle touch events for swipe to expand
  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartXRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    // If swiped up significantly, expand the player
    if (diffX > 50) {
      onExpand();
    }

    touchStartXRef.current = null;
  };

  // Prevent click propagation to avoid triggering parent elements
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="miniPlayer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Track Details */}
      <div className="miniPlayerContent">
        <div className="miniVisualizer">
          <canvas ref={miniCanvasRef} />
        </div>

        <div className="miniTrackInfo">
          <h4
            ref={titleRef}
            className={isScrolling ? 'scrolling' : ''}
          >
            <span
              className="scrollingText"
              data-content={currentTrack.name || currentTrack.title}
            >
              {currentTrack.name || currentTrack.title}
            </span>
          </h4>
          <p>{currentTrack.artist}</p>
          <div className="miniPlayerTags">
            {currentTrack.type && (
              <span className="miniTag typeTag">{currentTrack.type}</span>
            )}
            {currentTrack.originalArtist && (
              <span className="miniTag artistTag">{currentTrack.originalArtist}</span>
            )}
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="miniControls">
        {/* Play/Pause Button */}
        <button
          onClick={onPlayPause}
          className="controlButton"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          )}
        </button>
        
        {/* Expand Button */}
        <button
          onClick={onExpand}
          className="expandButton"
          aria-label="Expand player"
        >
          <FontAwesomeIcon icon={faExpand} />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
