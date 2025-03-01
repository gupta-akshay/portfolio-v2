'use client';

import { useRef, useEffect, useState, RefObject } from 'react';
import { AudioPlayerProps } from './types';
import { getAudioUrl } from '@/app/utils/aws';
import { useAudioContext, useAudioPlayback, useVisualizer } from './hooks';
import {
  TrackList,
  PlayerControls,
  NowPlaying,
  Waveform,
  EmptyPlayer,
  MiniPlayer,
  FullScreenPlayer,
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
    handlePlayPause,
    handleNext,
    handlePrevious,
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
        const newUrl = await getAudioUrl(tracks[currentTrackIndex].path);

        // If component unmounted or URL is the same, don't proceed
        if (!isMounted || newUrl === currentAudioUrl) {
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

        // Auto-play if needed
        if (shouldAutoPlayRef.current) {
          shouldAutoPlayRef.current = false;
          try {
            await audio.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Auto-play failed:', error);
            setIsPlaying(false);
          }
        }
      } catch (error) {
        console.error('Error setting up track:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Unknown error');
          setIsLoading(false);
          // Still mark as playable even if preload fails
          setIsPlayable(true);
          setIsMetadataLoaded(true);
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
      />

      {/* Desktop Player */}
      {!isMobile && (
        <div className='playerControls desktop'>
          {currentTrack ? (
            <>
              <NowPlaying
                currentTrack={currentTrack}
                isPlaying={isPlaying && !isLoading}
                miniCanvasRef={miniCanvasRef}
              />

              <div className='playerWrapper'>
                <Waveform canvasRef={canvasRef} />

                <PlayerControls
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  duration={duration}
                  volume={volume}
                  isMuted={isMuted}
                  onPlayPause={handlePlayPause}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onTimeChange={handleTimeChange}
                  onVolumeChange={handleVolumeChange}
                  onToggleMute={toggleMute}
                  isLoading={isLoading || !isMetadataLoaded}
                />
              </div>
            </>
          ) : (
            <EmptyPlayer />
          )}
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
          isLoading={isLoading || !isMetadataLoaded}
          canvasRef={canvasRef as RefObject<HTMLCanvasElement>}
          onClose={handleCloseFullScreen}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onTimeChange={handleTimeChange}
          onVolumeChange={handleVolumeChange}
          onToggleMute={toggleMute}
        />
      )}
    </div>
  );
};

export default AudioPlayer;
