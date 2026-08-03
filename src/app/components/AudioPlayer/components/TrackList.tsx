'use client';

import React, { KeyboardEvent } from 'react';
import Icon from '@/app/components/Icon/Icon';
import { Track } from '../types';
import { formatTime } from '../utils';
import WaveformSeeker from './WaveformSeeker';
import styles from '../AudioPlayer.module.scss';

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /** Base64 peaks for the active track, delivered with its signed URL */
  activePeaks: string | null;
  queuedTrackIds: Set<string>;
  onTrackSelect: (index: number) => void;
  onPlayPause: () => void;
  onAddToQueue: (index: number) => void;
  onShare: (track: Track) => void;
  onDownload: (index: number) => void;
  onSeek: (time: number) => void;
}

const trackLabel = (track: Track) => track.name || track.title;

/** Meta line under the title — built only from metadata the S3 listing provides */
const trackMeta = (track: Track) =>
  [track.originalArtist, track.artist, track.year]
    .filter((part) => part !== undefined && String(part).trim().length > 0)
    .join(' · ');

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackIndex,
  isPlaying,
  currentTime,
  duration,
  activePeaks,
  queuedTrackIds,
  onTrackSelect,
  onPlayPause,
  onAddToQueue,
  onShare,
  onDownload,
  onSeek,
}) => {
  const focusTrack = (index: number) => {
    const el = document.querySelector<HTMLElement>(
      `[data-track-index="${index}"]`
    );
    el?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>, index: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onTrackSelect(index);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) focusTrack(index - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < tracks.length - 1) focusTrack(index + 1);
        break;
      case 'Home':
        e.preventDefault();
        focusTrack(0);
        break;
      case 'End':
        e.preventDefault();
        focusTrack(tracks.length - 1);
        break;
    }
  };

  return (
    <ul role='listbox' aria-label='Track list' className={styles.trackList}>
      {tracks.map((track, index) => {
        const isActive = currentTrackIndex === index;
        const isPlayingThis = isActive && isPlaying;
        const isQueued = queuedTrackIds.has(track.id);
        const label = trackLabel(track);
        const meta = trackMeta(track);
        // Originals get the accent badge; every other kind (remix, mashup,
        // cover, flip, edit …) shares the teal treatment.
        const isOriginal = /^original$/i.test((track.type ?? '').trim());
        // Live duration wins once the audio is loaded; otherwise fall back to
        // the value precomputed by the peaks script.
        const rowDuration =
          isActive && duration > 0 ? duration : track.duration;

        return (
          <li
            key={track.id}
            className={styles.trackRow}
            data-active={isActive || undefined}
            data-track-index={index}
            role='option'
            aria-selected={isActive}
            tabIndex={0}
            onClick={() => onTrackSelect(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <div className={styles.trackRowMain}>
              <button
                type='button'
                className={styles.trackPlayButton}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isActive) {
                    onPlayPause();
                  } else {
                    onTrackSelect(index);
                  }
                }}
                aria-label={`${isPlayingThis ? 'Pause' : 'Play'} ${label}`}
              >
                <Icon name={isPlayingThis ? 'pause' : 'play'} />
              </button>

              <div className={styles.trackInfo}>
                <div className={styles.trackTitleRow}>
                  <span className={styles.trackTitle}>{label}</span>
                  {track.type && track.type.trim().length > 0 && (
                    <span
                      className={styles.trackBadge}
                      data-tone={isOriginal ? 'original' : 'remix'}
                    >
                      {track.type}
                    </span>
                  )}
                </div>
                {meta && <div className={styles.trackMeta}>{meta}</div>}
              </div>

              {isPlayingThis && (
                <div className={styles.equalizer} aria-hidden='true'>
                  <span />
                  <span />
                  <span />
                </div>
              )}

              <div className={styles.trackActions}>
                <button
                  type='button'
                  className={styles.trackActionButton}
                  data-queued={isQueued || undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToQueue(index);
                  }}
                  title='Add to queue'
                  aria-label={`Add ${label} to queue`}
                >
                  <Icon name='plus' />
                </button>
                <button
                  type='button'
                  className={`${styles.trackActionButton} ${styles.hideOnMobile}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(track);
                  }}
                  title='Copy share link'
                  aria-label={`Copy share link for ${label}`}
                >
                  <Icon name='share-nodes' />
                </button>
                <button
                  type='button'
                  className={styles.trackActionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(index);
                  }}
                  title='Download'
                  aria-label={`Download ${label}`}
                >
                  <Icon name='download' />
                </button>
              </div>

              <span className={styles.trackDuration}>
                {rowDuration ? formatTime(rowDuration) : '--:--'}
              </span>
            </div>

            {isActive && (
              <div
                className={styles.trackSeeker}
                onClick={(e) => e.stopPropagation()}
              >
                <WaveformSeeker
                  trackId={track.id}
                  peaks={activePeaks}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={onSeek}
                  variant='row'
                  label={`Seek within ${label}`}
                />
                <div className={styles.trackSeekerTimes}>
                  <span className={styles.trackSeekerElapsed}>
                    {formatTime(currentTime)}
                  </span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default TrackList;
