'use client';

import { useRef, useEffect, useState, RefObject } from 'react';
import { AudioPlayerProps } from './types';
import { getAudioUrl } from '@/app/utils/aws';
import {
  useAudioContext,
  useAudioPlayback,
  useVisualizer,
  useQueueManager,
} from './hooks';
import {
  TrackList,
  PlayerControls,
  NowPlaying,
  Waveform,
  EmptyPlayer,
  MiniPlayer,
  FullScreenPlayer,
  QueuePanel,
} from './components';

const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [isPlayable, setIsPlayable] = useState(false);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  const shouldAutoPlayRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const playAttemptInProgressRef = useRef(false);

  // Check if we have tracks to display
  const hasTracks = tracks && tracks.length > 0;
  const isMobile = window.innerWidth <= 991;

  // Custom hooks - all called unconditionally
  const {
    audioContextRef,
    analyserRef,
    animationRef,
    miniAnimationRef,
    setupAudioContext,
    gainNodeRef,
  } = useAudioContext(audioRef, false);

  const { drawWaveform, drawMiniVisualizer } = useVisualizer(
    analyserRef,
    canvasRef,
    miniCanvasRef
  );

  const {
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    setDuration,
    currentTrack,
    handlePlayPause: baseHandlePlayPause,
    handleNext: baseHandleNext,
    handlePrevious: baseHandlePrevious,
    handleTimeChange,
    handleVolumeChange,
    toggleMute,
  } = useAudioPlayback(
    audioRef,
    hasTracks ? tracks : [],
    animationRef,
    miniAnimationRef,
    drawWaveform,
    drawMiniVisualizer,
    audioContextRef,
    gainNodeRef
  );

  // Queue management hook
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

  // Enhanced next/previous handlers that use queue management
  const handleNext = () => {
    if (currentTrackIndex !== null) {
      const nextIndex = getNextTrackIndex(currentTrackIndex);
      if (nextIndex !== null) {
        setCurrentTrackIndex(nextIndex);
      }
    } else {
      baseHandleNext();
    }
  };

  const handlePrevious = () => {
    if (currentTrackIndex !== null) {
      const prevIndex = getPreviousTrackIndex(currentTrackIndex);
      if (prevIndex !== null) {
        setCurrentTrackIndex(prevIndex);
      }
    } else {
      baseHandlePrevious();
    }
  };

  // Enhanced play/pause handler with safety checks
  const handlePlayPause = () => {
    if (playAttemptInProgressRef.current) {
      console.log('Play attempt already in progress, ignoring request');
      return;
    }

    playAttemptInProgressRef.current = true;

    try {
      baseHandlePlayPause();
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
    } finally {
      // Reset the flag after a short delay to prevent rapid toggling
      setTimeout(() => {
        playAttemptInProgressRef.current = false;
      }, 300);
    }
  };

  // Add track to queue handler
  const handleAddToQueue = (index: number) => {
    if (index >= 0 && index < tracks.length) {
      addToQueue(tracks[index]);
    }
  };

  // Handle selecting a track from the queue
  const handleQueueTrackSelect = (index: number) => {
    if (index >= 0 && index < queue.length) {
      // Find the track in the main tracks array
      const trackIndex = tracks.findIndex(
        (track) => track.id === queue[index].id
      );
      if (trackIndex !== -1) {
        // Remove all tracks before this one from the queue
        const newQueue = queue.slice(index + 1);

        // Update queue
        const removedTrackIds = new Set<string>();
        queue.slice(0, index + 1).forEach((track) => {
          // Check if this track appears elsewhere in the remaining queue
          const stillInQueue =
            newQueue.some((t) => t.id === track.id) ||
            track.id === tracks[trackIndex].id;
          if (!stillInQueue) {
            removedTrackIds.add(track.id);
          }
        });

        // Update queue state
        setCurrentTrackIndex(trackIndex);

        // Update queuedTrackIds
        queuedTrackIds.forEach((id) => {
          if (removedTrackIds.has(id)) {
            queuedTrackIds.delete(id);
          }
        });
      }
    }
  };

  // Reset states when track changes
  useEffect(() => {
    if (currentTrack) {
      setIsLoading(true);
      setIsMetadataLoaded(false);
      setIsPlayable(false);
      setIsPlaying(false);
      shouldAutoPlayRef.current = true;
    }
  }, [currentTrack, setIsPlaying]);

  // Update track URL when current track changes
  useEffect(() => {
    let isMounted = true;
    let currentAudioUrl: string | null = null;

    const updateTrackUrl = async () => {
      if (currentTrackIndex === null || !tracks[currentTrackIndex]) {
        setCurrentUrl(null);
        return;
      }

      try {
        // Cancel any pending play operations before loading new track
        if (audioRef.current) {
          try {
            // Set flag to prevent new play attempts during transition
            playAttemptInProgressRef.current = true;
            await audioRef.current.pause();
          } catch (e) {
            // Ignore pause errors
          }
        }

        const newUrl = await getAudioUrl(tracks[currentTrackIndex].path);

        // If component unmounted or URL is the same, don't proceed
        if (!isMounted || newUrl === currentAudioUrl) {
          playAttemptInProgressRef.current = false;
          return;
        }

        // Update state and URL
        currentAudioUrl = newUrl;
        setIsLoading(true);
        setIsMetadataLoaded(false);
        setIsPlayable(false);
        setIsPlaying(false);
        setError(null);
        setCurrentUrl(newUrl);

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

        // Reset audio element state
        audio.currentTime = 0;
        audio.volume = volume;
        audio.muted = false;

        // Force load the audio
        audio.load();

        // Wait for metadata to load
        await new Promise<void>((resolve, reject) => {
          const onMetadataLoaded = () => {
            cleanup();
            resolve();
          };

          const onError = (e: Event) => {
            console.error('Error loading audio:', e);
            cleanup();
            reject(new Error('Failed to load audio'));
          };

          const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onMetadataLoaded);
            audio.removeEventListener('error', onError);
          };

          audio.addEventListener('loadedmetadata', onMetadataLoaded);
          audio.addEventListener('error', onError);

          // Set timeout for metadata loading
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
            console.error('Error during load:', e);
            cleanup();
            reject(new Error('Failed to load audio'));
          };

          const cleanup = () => {
            audio.removeEventListener('canplaythrough', onCanPlay);
            audio.removeEventListener('error', onError);
          };

          audio.addEventListener('canplaythrough', onCanPlay);
          audio.addEventListener('error', onError);

          // Set timeout
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

          // Small delay to ensure everything is ready
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
              console.error('Auto-play failed:', error);
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
        console.error('Error setting up track:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
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

  // Set up audio context and analyzer when track starts playing
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null || !isPlayable) return;

    const startVisualizations = async () => {
      try {
        // Setup audio context and nodes
        await setupAudioContext();

        if (!isPlaying) return;

        // Start animation frames
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (miniAnimationRef.current) {
          cancelAnimationFrame(miniAnimationRef.current);
        }

        const animateWaveform = () => {
          drawWaveform();
          animationRef.current = requestAnimationFrame(animateWaveform);
        };

        const animateMiniVisualizer = () => {
          drawMiniVisualizer();
          miniAnimationRef.current = requestAnimationFrame(
            animateMiniVisualizer
          );
        };

        // Start both animations
        animationRef.current = requestAnimationFrame(animateWaveform);
        miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
      } catch (error) {
        console.error('Error starting visualizations:', error);
      }
    };

    startVisualizations();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (miniAnimationRef.current) {
        cancelAnimationFrame(miniAnimationRef.current);
        miniAnimationRef.current = null;
      }
    };
  }, [
    currentTrackIndex,
    isPlaying,
    isPlayable,
    setupAudioContext,
    drawWaveform,
    drawMiniVisualizer,
    animationRef,
    miniAnimationRef,
  ]);

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);

    // Add all tracks after the selected track to the queue
    if (hasTracks && tracks.length > index + 1) {
      // Get all tracks after the selected one
      const tracksToAdd = tracks.slice(index + 1);

      // Clear the existing queue
      clearQueue();

      // Add all subsequent tracks to the queue
      // Use setTimeout to ensure the queue is cleared before adding new tracks
      setTimeout(() => {
        for (let i = 0; i < tracksToAdd.length; i++) {
          addToQueue(tracksToAdd[i]);
        }
      }, 0);
    }
  };

  const handleExpandPlayer = () => {
    setIsFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenVisible(false);
  };

  // Add unmute effect after user interaction
  useEffect(() => {
    const handleFirstInteraction = (event: Event) => {
      if (audioRef.current) {
        audioRef.current.muted = false;

        // Also try to resume AudioContext if it exists
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current
            .resume()
            .then(() => console.log('AudioContext resumed successfully'))
            .catch((error) =>
              console.error('Failed to resume AudioContext:', error)
            );
        }
      }
    };

    // Add both click and touch handlers
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioContextRef]);

  const handleDownload = () => {
    if (!currentUrl || !currentTrack) return;

    // Create a temporary anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = currentUrl;

    // Set the download attribute with the track title
    const fileName = `${currentTrack.title || currentTrack.name || 'track'}.mp3`;
    downloadLink.download = fileName;

    // Append to the document, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className='cloudinaryAudioPlayer'>
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
        onLoadStart={() => {}}
        onLoadedMetadata={(e) => {
          const audio = e.target as HTMLAudioElement;
          setDuration(audio.duration);
          setIsMetadataLoaded(true);
        }}
        onCanPlay={() => {
          const audio = audioRef.current;
          if (!audio) return;

          // Ensure audio is properly configured for Safari
          audio.volume = volume;
          audio.muted = false;

          setIsPlayable(true);
          setIsLoading(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={() => {
          shouldAutoPlayRef.current = true;
          handleNext();
        }}
        onError={(e) => {
          const audio = e.target as HTMLAudioElement;
          setIsLoading(false);
          setError('Failed to load audio');
        }}
        onWaiting={() => {
          setIsLoading(true);
        }}
        onPlaying={() => {
          setIsLoading(false);
        }}
      />

      <TrackList
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        onTrackSelect={handleTrackSelect}
        onAddToQueue={handleAddToQueue}
        queuedTrackIds={queuedTrackIds}
      />

      {currentTrack ? (
        <div className='playerControls'>
          <NowPlaying
            currentTrack={currentTrack}
            isPlaying={isPlaying && !isLoading}
            miniCanvasRef={miniCanvasRef}
          />

          <div className='playerWrapper'>
            <div className='waveformContainer'>
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
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onTimeChange={handleTimeChange}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
              onToggleShuffle={toggleShuffle}
              onDownload={handleDownload}
              canDownload={!!currentTrack}
              onToggleQueue={toggleQueueVisibility}
              isQueueVisible={isQueueVisible}
            />
          </div>
        </div>
      ) : (
        <div className='playerControls'>
          <EmptyPlayer />
        </div>
      )}

      {/* Mobile Mini Player */}
      {currentTrack && isMobile && (
        <MiniPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          isLoading={isLoading || !isMetadataLoaded}
          miniCanvasRef={miniCanvasRef as RefObject<HTMLCanvasElement>}
          onPlayPause={handlePlayPause}
          onExpand={handleExpandPlayer}
        />
      )}

      {/* Mobile Full Screen Player */}
      {currentTrack && isMobile && (
        <FullScreenPlayer
          isVisible={isFullScreenVisible}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          isLoading={isLoading}
          isShuffleActive={isShuffleActive}
          canvasRef={canvasRef as RefObject<HTMLCanvasElement>}
          onClose={handleCloseFullScreen}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onTimeChange={handleTimeChange}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
          onToggleShuffle={toggleShuffle}
          onDownload={handleDownload}
          canDownload={!!currentTrack}
          isQueueVisible={isQueueVisible}
          onToggleQueue={toggleQueueVisibility}
        />
      )}

      <QueuePanel
        isVisible={isQueueVisible}
        currentTrack={currentTrack}
        queueTracks={queue}
        onClose={toggleQueueVisibility}
        onTrackSelect={handleQueueTrackSelect}
        onRemoveFromQueue={removeFromQueue}
        onReorderQueue={reorderQueue}
      />
    </div>
  );
};

export default AudioPlayer;
