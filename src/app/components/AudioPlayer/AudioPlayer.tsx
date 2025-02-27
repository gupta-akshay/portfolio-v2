'use client';

import { useRef, useEffect, useState } from 'react';
import { AudioPlayerProps } from './types';
import { getAudioUrl } from '@/app/utils/dropbox';
import { useAudioContext, useAudioPlayback, useVisualizer } from './hooks';
import {
  TrackList,
  PlayerControls,
  NowPlaying,
  Waveform,
  EmptyPlayer,
} from './components';

const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have tracks to display
  const hasTracks = tracks && tracks.length > 0;

  // Custom hooks - all called unconditionally
  const {
    audioContextRef,
    analyserRef,
    animationRef,
    miniAnimationRef,
    setupAudioContext,
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
    audioContextRef
  );

  // Update track URL when current track changes
  useEffect(() => {
    const updateTrackUrl = async () => {
      if (currentTrack) {
        setIsLoading(true);
        try {
          const url = await getAudioUrl(currentTrack.path);
          setCurrentUrl(url);
        } catch (error) {
          console.error('Error loading audio URL:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentUrl(null);
      }
    };
    updateTrackUrl();
  }, [currentTrack]);

  // Update track duration when audio metadata is loaded
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audioElement = audioRef.current;
      const updateDuration = () => {
        if (audioElement) {
          setDuration(audioElement.duration);
        }
      };

      audioElement.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audioElement.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [currentTrack, setDuration]);

  // Set up audio context and analyzer when track changes
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null) return;

    // Make sure audio context is running and analyzer is set up
    const initializeAudio = async () => {
      await setupAudioContext();

      // Initialize audio data array if we have an analyzer
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
      }

      // Start visualizations if playing
      if (isPlaying && audioRef.current) {
        // Cancel any existing animation frames before creating new ones
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (miniAnimationRef.current) {
          cancelAnimationFrame(miniAnimationRef.current);
        }

        // Create animation loop functions that call themselves
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

        // Start animation loops
        animationRef.current = requestAnimationFrame(animateWaveform);
        miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);

        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    };

    initializeAudio();

    // Clean up animations when component unmounts or track changes
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
    setupAudioContext,
    analyserRef,
    drawWaveform,
    drawMiniVisualizer,
    animationRef,
    miniAnimationRef,
    setIsPlaying,
  ]);

  // Handle track selection
  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);

    // Ensure visualizations start when a track is selected
    // This needs to be done after the state updates and component re-renders
    setTimeout(() => {
      if (audioRef.current && analyserRef.current) {
        // Cancel any existing animation frames
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (miniAnimationRef.current) {
          cancelAnimationFrame(miniAnimationRef.current);
        }

        // Create animation loop functions
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

        // Start animation loops
        animationRef.current = requestAnimationFrame(animateWaveform);
        miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
      }
    }, 100);
  };

  return (
    <div className='cloudinaryAudioPlayer'>
      {currentTrack && currentUrl && (
        <audio
          ref={audioRef}
          src={currentUrl}
          preload='metadata'
          crossOrigin='anonymous'
        />
      )}

      <TrackList
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        onTrackSelect={handleTrackSelect}
      />

      <div className='playerControls'>
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
                isLoading={isLoading}
              />
            </div>
          </>
        ) : (
          <EmptyPlayer />
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
