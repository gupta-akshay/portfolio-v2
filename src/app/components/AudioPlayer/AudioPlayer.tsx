'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AudioPlayerProps, Track } from './types';
import {
  useAudioContext,
  useAudioPlayback,
  useQueueManager,
  useKeyboardShortcuts,
} from './hooks';
import { TrackList, PlayerBar, QueuePanel, Toast } from './components';
import { logger } from '@/app/utils/logger';
import styles from './AudioPlayer.module.scss';

const PREFS_KEY = 'audioPlayerPrefs';
/** Pressing previous past this point restarts the track instead of going back */
const RESTART_THRESHOLD_SECONDS = 3;

function loadPrefs(): { trackIndex: number | null; volume: number } {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { trackIndex: null, volume: 0.7 };
    return JSON.parse(raw);
  } catch {
    return { trackIndex: null, volume: 0.7 };
  }
}

function savePrefs(trackIndex: number | null, volume: number) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ trackIndex, volume }));
  } catch {
    // localStorage unavailable (private browsing etc.)
  }
}

const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [currentPeaks, setCurrentPeaks] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [isPlayable, setIsPlayable] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const shouldAutoPlayRef = useRef(false);
  const playAttemptInProgressRef = useRef(false);
  const restoringFromStorageRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasTracks = useMemo(() => tracks && tracks.length > 0, [tracks]);

  const { audioContextRef, setupAudioContext, gainNodeRef } = useAudioContext(
    audioRef,
    false
  );

  const {
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTime,
    duration,
    setDuration,
    currentTrack,
    handlePlayPause: baseHandlePlayPause,
    handleNext: baseHandleNext,
    handlePrevious: baseHandlePrevious,
    seekTo,
    handleVolumeChange,
    toggleMute,
  } = useAudioPlayback(
    audioRef,
    hasTracks ? tracks : [],
    audioContextRef,
    gainNodeRef
  );

  const {
    queue,
    queuedTrackIds,
    isShuffleActive,
    isQueueVisible,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    toggleShuffle,
    toggleQueueVisibility,
    clearQueue,
    getNextTrackIndex,
    getPreviousTrackIndex,
  } = useQueueManager(hasTracks ? tracks : []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(
    () => () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    },
    []
  );

  // Restore persisted volume on mount
  useEffect(() => {
    const prefs = loadPrefs();
    if (prefs.volume !== 0.7) {
      setVolume(prefs.volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore persisted track index once tracks are available
  useEffect(() => {
    if (!hasTracks || currentTrackIndex !== null) return;
    const prefs = loadPrefs();
    if (prefs.trackIndex !== null && prefs.trackIndex < tracks.length) {
      restoringFromStorageRef.current = true;
      setCurrentTrackIndex(prefs.trackIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTracks]);

  // Persist volume + track index whenever they change
  useEffect(() => {
    savePrefs(currentTrackIndex, volume);
  }, [currentTrackIndex, volume]);

  // Enhanced next/previous handlers that use queue management.
  // These are intentionally metric-free — handleEnded calls handleNext for
  // natural track completion, which should not register as a user skip.
  const handleNext = useCallback(() => {
    if (currentTrackIndex !== null) {
      const nextIndex = getNextTrackIndex(currentTrackIndex);
      if (nextIndex !== null) {
        setCurrentTrackIndex(nextIndex);
      }
    } else {
      baseHandleNext();
    }
  }, [
    currentTrackIndex,
    getNextTrackIndex,
    setCurrentTrackIndex,
    baseHandleNext,
  ]);

  const handlePrevious = useCallback(() => {
    // Restart the current track when we're past the threshold, matching the
    // behaviour of every other music player.
    const audio = audioRef.current;
    if (audio && audio.currentTime > RESTART_THRESHOLD_SECONDS) {
      seekTo(0);
      return;
    }

    if (currentTrackIndex !== null) {
      const prevIndex = getPreviousTrackIndex(currentTrackIndex);
      if (prevIndex !== null) {
        setCurrentTrackIndex(prevIndex);
      }
    } else {
      baseHandlePrevious();
    }
  }, [
    currentTrackIndex,
    getPreviousTrackIndex,
    setCurrentTrackIndex,
    baseHandlePrevious,
    seekTo,
  ]);

  // Wrappers used only for explicit user actions (button / keyboard).
  // handleEnded keeps calling handleNext directly so natural completions
  // are not counted as skips.
  const handleNextUser = useCallback(() => {
    Sentry.metrics.count('audio.track.skip', 1, {
      attributes: { direction: 'next' },
    });
    handleNext();
  }, [handleNext]);

  const handlePreviousUser = useCallback(() => {
    Sentry.metrics.count('audio.track.skip', 1, {
      attributes: { direction: 'previous' },
    });
    handlePrevious();
  }, [handlePrevious]);

  // Enhanced play/pause handler with safety checks
  const handlePlayPause = useCallback(() => {
    if (playAttemptInProgressRef.current) {
      return;
    }

    playAttemptInProgressRef.current = true;

    try {
      baseHandlePlayPause();
    } catch (error) {
      logger.error('Error in handlePlayPause:', error);
    } finally {
      // Reset the flag after a short delay to prevent rapid toggling
      setTimeout(() => {
        playAttemptInProgressRef.current = false;
      }, 300);
    }
  }, [baseHandlePlayPause]);

  const handleAddToQueue = useCallback(
    (index: number) => {
      if (index >= 0 && index < tracks.length) {
        const track = tracks[index]!;
        addToQueue(track);
        Sentry.metrics.count('audio.queue.add', 1, {
          attributes: { track_id: track.id, track_name: track.name },
        });
        showToast(`Added to queue: ${track.name || track.title}`);
      }
    },
    [tracks, addToQueue, showToast]
  );

  // Handle selecting a track from the queue
  const handleQueueTrackSelect = useCallback(
    (index: number) => {
      if (index >= 0 && index < queue.length && queue[index]) {
        const trackIndex = tracks.findIndex(
          (track) => track.id === queue[index]!.id
        );
        if (trackIndex !== -1) {
          // Remove all tracks before this one from the queue
          const newQueue = queue.slice(index + 1);

          const removedTrackIds = new Set<string>();
          queue.slice(0, index + 1).forEach((track) => {
            const stillInQueue =
              newQueue.some((t) => t.id === track.id) ||
              track.id === tracks[trackIndex]?.id;
            if (!stillInQueue) {
              removedTrackIds.add(track.id);
            }
          });

          setCurrentTrackIndex(trackIndex);

          queuedTrackIds.forEach((id) => {
            if (removedTrackIds.has(id)) {
              queuedTrackIds.delete(id);
            }
          });
        }
      }
    },
    [queue, tracks, setCurrentTrackIndex, queuedTrackIds]
  );

  // Reset states when track changes
  useEffect(() => {
    if (currentTrack) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      setIsMetadataLoaded(false);
      setIsPlayable(false);
      setIsPlaying(false);
      if (restoringFromStorageRef.current) {
        shouldAutoPlayRef.current = false;
        restoringFromStorageRef.current = false;
      } else {
        shouldAutoPlayRef.current = true;
      }
    }
  }, [currentTrack, setIsPlaying]);

  // Update track URL when current track changes
  useEffect(() => {
    let isMounted = true;
    let currentAudioUrl: string | null = null;

    const updateTrackUrl = async () => {
      if (currentTrackIndex === null || !tracks[currentTrackIndex]) {
        setCurrentUrl(null);
        setCurrentPeaks(null);
        return;
      }

      try {
        // Cancel any pending play operations before loading new track
        if (audioRef.current) {
          try {
            playAttemptInProgressRef.current = true;
            await audioRef.current.pause();
          } catch (e) {
            logger.error('Error pausing audio:', e);
          }
        }

        const urlResponse = await fetch('/api/music/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: tracks[currentTrackIndex].path }),
        });
        if (!urlResponse.ok) throw new Error('Failed to get audio URL');
        const { url: newUrl, peaks } = (await urlResponse.json()) as {
          url: string;
          peaks?: string;
        };

        if (!isMounted || newUrl === currentAudioUrl) {
          playAttemptInProgressRef.current = false;
          return;
        }

        currentAudioUrl = newUrl;
        setIsLoading(true);
        setIsMetadataLoaded(false);
        setIsPlayable(false);
        setIsPlaying(false);
        setCurrentUrl(newUrl);
        setCurrentPeaks(peaks ?? null);

        // Wait for audio element to be available
        const audio = await new Promise<HTMLAudioElement>((resolve, reject) => {
          const checkAudio = () => {
            if (audioRef.current) {
              resolve(audioRef.current);
            } else if (attempts >= 10) {
              reject(new Error('Audio element not found'));
            } else {
              attempts++;
              setTimeout(checkAudio, 100);
            }
          };
          let attempts = 0;
          checkAudio();
        });

        audio.currentTime = 0;
        audio.volume = volume;
        audio.muted = false;

        audio.load();

        // Wait for metadata to load
        await new Promise<void>((resolve, reject) => {
          const onMetadataLoaded = () => {
            cleanup();
            resolve();
          };

          const onError = (e: Event) => {
            logger.error('Error loading audio:', e);
            cleanup();
            reject(new Error('Failed to load audio'));
          };

          const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onMetadataLoaded);
            audio.removeEventListener('error', onError);
          };

          audio.addEventListener('loadedmetadata', onMetadataLoaded);
          audio.addEventListener('error', onError);

          setTimeout(() => {
            cleanup();
            reject(new Error('Metadata loading timeout'));
          }, 10000);
        });

        // Wait for audio to be playable
        await new Promise<void>((resolve, reject) => {
          if (audio.readyState >= 3) {
            resolve();
            return;
          }

          const onCanPlay = () => {
            cleanup();
            resolve();
          };

          const onError = (e: Event) => {
            logger.error('Error during load:', e);
            cleanup();
            reject(new Error('Failed to load audio'));
          };

          const cleanup = () => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
          };

          audio.addEventListener('canplaythrough', onCanPlay);
          audio.addEventListener('error', onError);

          setTimeout(() => {
            cleanup();
            reject(new Error('Timeout waiting for audio to be playable'));
          }, 10000);
        });

        setIsMetadataLoaded(true);
        setIsPlayable(true);
        setIsLoading(false);

        // Auto-play if needed, with safety checks
        if (shouldAutoPlayRef.current) {
          shouldAutoPlayRef.current = false;

          setTimeout(async () => {
            try {
              if (audioRef.current && isMounted) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                  await playPromise;
                  if (isMounted) {
                    setIsPlaying(true);
                  }
                }
              }
            } catch (error) {
              logger.error('Auto-play failed:', error);
              if (isMounted) {
                setIsPlaying(false);
              }
            } finally {
              playAttemptInProgressRef.current = false;
            }
          }, 100);
        } else {
          playAttemptInProgressRef.current = false;
        }
      } catch (error) {
        logger.error('Error setting up track:', error);
        if (isMounted) {
          setIsLoading(false);
          // Still mark as playable even if preload fails
          setIsPlayable(true);
          setIsMetadataLoaded(true);
          playAttemptInProgressRef.current = false;
        }
      }
    };

    updateTrackUrl();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, tracks]);

  // Connect the Web Audio graph (gain node drives volume) once playable
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null || !isPlayable) return;
    setupAudioContext().catch((error) =>
      logger.error('Error setting up audio context:', error)
    );
  }, [currentTrackIndex, isPlayable, setupAudioContext]);

  const handleTrackSelect = useCallback(
    (index: number) => {
      // Selecting the track that is already loaded toggles playback instead of
      // reloading it from scratch.
      if (index === currentTrackIndex) {
        handlePlayPause();
        return;
      }

      const track = tracks[index];
      if (track) {
        Sentry.metrics.count('audio.track.play', 1, {
          attributes: { track_id: track.id, track_name: track.name },
        });
      }
      setCurrentTrackIndex(index);

      // Add all tracks after the selected track to the queue
      if (hasTracks && tracks.length > index + 1) {
        const tracksToAdd = tracks.slice(index + 1);

        clearQueue();

        // Use setTimeout to ensure the queue is cleared before adding new tracks
        setTimeout(() => {
          for (let i = 0; i < tracksToAdd.length; i++) {
            addToQueue(tracksToAdd[i]!);
          }
        }, 0);
      }
    },
    [
      hasTracks,
      tracks,
      currentTrackIndex,
      handlePlayPause,
      setCurrentTrackIndex,
      clearQueue,
      addToQueue,
    ]
  );

  // Unmute + resume the AudioContext after the first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;

        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current
            .resume()
            .catch((error) =>
              logger.error('Failed to resume AudioContext:', error)
            );
        }
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioContextRef]);

  const triggerDownload = useCallback((url: string, track: Track) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.target = '_blank';
    downloadLink.download = `${track.title || track.name || 'track'}.mp3`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, []);

  const handleDownload = useCallback(
    async (index: number) => {
      const track = tracks[index];
      if (!track) return;

      Sentry.metrics.count('audio.track.download', 1, {
        attributes: { track_id: track.id, track_name: track.name },
      });

      // The loaded track already has a signed URL; anything else needs one.
      if (index === currentTrackIndex && currentUrl) {
        triggerDownload(currentUrl, track);
        return;
      }

      try {
        const response = await fetch('/api/music/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: track.path }),
        });
        if (!response.ok) throw new Error('Failed to get audio URL');
        const { url } = (await response.json()) as { url: string };
        triggerDownload(url, track);
      } catch (error) {
        logger.error('Error downloading track:', error);
        showToast('Download failed — please try again');
      }
    },
    [tracks, currentTrackIndex, currentUrl, triggerDownload, showToast]
  );

  const handleShare = useCallback(
    async (track: Track) => {
      const link = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(track.id)}`;

      try {
        await navigator.clipboard.writeText(link);
        showToast('Link copied');
      } catch {
        showToast(link);
      }
    },
    [showToast]
  );

  const handleVolumeSet = useCallback(
    (v: number) => {
      setVolume(v);
      setIsMuted(v === 0);
    },
    [setVolume, setIsMuted]
  );

  const handleToggleShuffle = useCallback(() => {
    const next = !isShuffleActive;
    Sentry.metrics.count('audio.shuffle.toggle', 1, {
      attributes: { enabled: String(next) },
    });
    toggleShuffle();
  }, [isShuffleActive, toggleShuffle]);

  // Global keyboard shortcuts (active when a track is loaded)
  useKeyboardShortcuts({
    enabled: hasTracks && currentTrackIndex !== null,
    onPlayPause: handlePlayPause,
    onNext: handleNextUser,
    onPrevious: handlePreviousUser,
    onToggleMute: toggleMute,
    volume,
    onVolumeSet: handleVolumeSet,
  });

  // Deep link: /music#<track id> selects that track without autoplaying
  useEffect(() => {
    if (!hasTracks || currentTrackIndex !== null) return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const decoded = decodeURIComponent(hash);
    const index = tracks.findIndex((track) => track.id === decoded);
    if (index !== -1) {
      restoringFromStorageRef.current = true;
      setCurrentTrackIndex(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTracks]);

  const handleLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLAudioElement>) => {
      const audio = e.target as HTMLAudioElement;
      setDuration(audio.duration);
      setIsMetadataLoaded(true);
    },
    [setDuration]
  );

  const handleCanPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Ensure audio is properly configured for Safari
    audio.muted = false;

    setIsPlayable(true);
    setIsLoading(false);
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const handleEnded = useCallback(() => {
    shouldAutoPlayRef.current = true;
    handleNext();
  }, [handleNext]);

  const handleError = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleWaiting = useCallback(() => {
    setIsLoading(true);
  }, []);

  const handlePlaying = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={styles.player}>
      {/* Always render the audio element, but with empty src if no track */}
      <audio
        ref={audioRef}
        src={currentUrl || undefined}
        preload='auto'
        crossOrigin='anonymous'
        playsInline
        x-webkit-airplay='allow'
        webkit-playsinline='true'
        x-webkit-playsinline='true'
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
      />

      <TrackList
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying && !isLoading}
        currentTime={currentTime}
        duration={duration}
        activePeaks={currentPeaks}
        queuedTrackIds={queuedTrackIds}
        onTrackSelect={handleTrackSelect}
        onPlayPause={handlePlayPause}
        onAddToQueue={handleAddToQueue}
        onShare={handleShare}
        onDownload={handleDownload}
        onSeek={seekTo}
      />

      {currentTrack && (
        <PlayerBar
          currentTrack={currentTrack}
          peaks={currentPeaks}
          isPlaying={isPlaying}
          isLoading={isLoading || !isMetadataLoaded}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isShuffleActive={isShuffleActive}
          isQueueVisible={isQueueVisible}
          onSeek={seekTo}
          onPlayPause={handlePlayPause}
          onPrevious={handlePreviousUser}
          onNext={handleNextUser}
          onToggleShuffle={handleToggleShuffle}
          onToggleQueue={toggleQueueVisibility}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
        />
      )}

      <QueuePanel
        isVisible={isQueueVisible}
        queueTracks={queue}
        onClose={toggleQueueVisibility}
        onTrackSelect={handleQueueTrackSelect}
        onRemoveFromQueue={removeFromQueue}
        onReorderQueue={reorderQueue}
      />

      <Toast message={toast} />
    </div>
  );
};

export default AudioPlayer;
