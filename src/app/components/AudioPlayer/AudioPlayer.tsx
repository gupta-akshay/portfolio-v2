'use client';

import { useRef, useEffect } from 'react';
import { AudioPlayerProps } from './types';
import { getAudioUrl } from './utils';
import {
  useAudioContext,
  useAudioPlayback,
  useTrackDurations,
  useVisualizer,
} from './hooks';
import {
  TrackList,
  PlayerControls,
  NowPlaying,
  Waveform,
  EmptyPlayer,
  NoTracks,
} from './components';

const AudioPlayer = ({ tracks }: AudioPlayerProps) => {
  // If there are no tracks, display a message
  if (!tracks || tracks.length === 0) {
    return (
      <div className='cloudinaryAudioPlayer'>
        <NoTracks />
      </div>
    );
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);

  // Custom hooks
  const {
    audioContextRef,
    analyserRef,
    sourceRef,
    animationRef,
    miniAnimationRef,
    setupAudioContext,
  } = useAudioContext(audioRef, false);

  const { trackDurations, setTrackDurations } = useTrackDurations(
    tracks,
    cloudName
  );

  const { audioData, waveformStyle, drawWaveform, drawMiniVisualizer } =
    useVisualizer(analyserRef, canvasRef, miniCanvasRef);

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
    tracks,
    animationRef,
    miniAnimationRef,
    drawWaveform,
    drawMiniVisualizer,
    audioContextRef
  );

  // Update track duration in our state when audio metadata is loaded
  useEffect(() => {
    if (audioRef.current && currentTrack && currentTrack.id) {
      const updateDuration = () => {
        if (audioRef.current && currentTrack.id) {
          setDuration(audioRef.current.duration);

          // Also update the track duration in our trackDurations state
          setTrackDurations((prev) => ({
            ...prev,
            [currentTrack.id]: audioRef.current!.duration,
          }));
        }
      };

      audioRef.current.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [currentTrack, setTrackDurations]);

  // Set up audio context and analyzer when track changes
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null) return;

    // Make sure audio context is running and analyzer is set up
    const initializeAudio = async () => {
      await setupAudioContext();

      // Initialize audio data array if we have an analyzer
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
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
      {currentTrack && (
        <audio
          ref={audioRef}
          src={getAudioUrl(currentTrack.cloudinaryPublicId, cloudName)}
          preload='metadata'
          crossOrigin='anonymous' // Required for Web Audio API with external sources
        />
      )}

      <TrackList
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        onTrackSelect={handleTrackSelect}
        trackDurations={trackDurations}
      />

      <div className='playerControls'>
        {currentTrack ? (
          <>
            <NowPlaying
              currentTrack={currentTrack}
              isPlaying={isPlaying}
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
