'use client';

import React from 'react';
import Icon from '@/app/components/Icon/Icon';
import { Track } from '../types';
import { formatTime } from '../utils';
import WaveformSeeker from './WaveformSeeker';
import styles from '../AudioPlayer.module.scss';

interface PlayerBarProps {
  currentTrack: Track;
  /** Base64 peaks for the current track, delivered with its signed URL */
  peaks: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffleActive: boolean;
  isQueueVisible: boolean;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleQueue: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlayerBar: React.FC<PlayerBarProps> = ({
  currentTrack,
  peaks,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffleActive,
  isQueueVisible,
  onSeek,
  onPlayPause,
  onPrevious,
  onNext,
  onToggleShuffle,
  onToggleQueue,
  onToggleMute,
  onVolumeChange,
}) => {
  const title = currentTrack.name || currentTrack.title;
  const subtitle = [currentTrack.artist, currentTrack.type]
    .filter((part) => part && part.trim().length > 0)
    .join(' · ');

  return (
    <div className={styles.playerBar} role='region' aria-label='Player'>
      <WaveformSeeker
        peaks={peaks}
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
        variant='bar'
        label={`Seek within ${title}`}
      />

      <div className={styles.playerBarInner}>
        <div className={styles.playerBarTrack}>
          <div className={styles.playerBarTitle}>{title}</div>
          <div className={styles.playerBarMeta}>
            {subtitle && <>{subtitle} · </>}
            <span className={styles.playerBarElapsed}>
              {formatTime(currentTime)}
            </span>
            {' / '}
            <span className={styles.playerBarTotal}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className={styles.playerBarControls}>
          <button
            type='button'
            className={styles.playerBarSecondary}
            data-on={isShuffleActive || undefined}
            onClick={onToggleShuffle}
            title='Shuffle'
            aria-label='Toggle shuffle'
            aria-pressed={isShuffleActive}
          >
            <Icon name='shuffle' />
          </button>
          <button
            type='button'
            className={styles.playerBarSkip}
            onClick={onPrevious}
            title='Previous'
            aria-label='Previous track'
          >
            <Icon name='backward' />
          </button>
          <button
            type='button'
            className={styles.playerBarPlay}
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Icon name='spinner' spin />
            ) : (
              <Icon name={isPlaying ? 'pause' : 'play'} />
            )}
          </button>
          <button
            type='button'
            className={styles.playerBarSkip}
            onClick={onNext}
            title='Next'
            aria-label='Next track'
          >
            <Icon name='forward' />
          </button>
          <button
            type='button'
            className={styles.playerBarSecondary}
            data-on={isQueueVisible || undefined}
            onClick={onToggleQueue}
            title='Queue'
            aria-label='Toggle queue'
            aria-pressed={isQueueVisible}
          >
            <Icon name='list' />
          </button>
        </div>

        <div className={styles.playerBarVolume}>
          <button
            type='button'
            className={styles.playerBarMute}
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            <Icon name={isMuted ? 'volume-mute' : 'volume-high'} />
          </button>
          <input
            type='range'
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            aria-label='Volume'
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
