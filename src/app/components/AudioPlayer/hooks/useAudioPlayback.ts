import { useState, useEffect, RefObject, useRef, useCallback } from 'react';
import { Track } from '../types';

/**
 * Custom hook to manage audio playback state and controls
 */
export const useAudioPlayback = (
  audioRef: RefObject<HTMLAudioElement | null>,
  tracks: Track[],
  animationRef: RefObject<number | null>,
  miniAnimationRef: RefObject<number | null>,
  drawWaveform: () => void,
  drawMiniVisualizer: () => void,
  audioContextRef: RefObject<AudioContext | null>
) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Get current track if one is selected
  const currentTrack =
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  // Define handleNext function using useCallback to avoid dependency issues
  const handleNext = useCallback(() => {
    if (currentTrackIndex === null) {
      if (tracks.length > 0) {
        setCurrentTrackIndex(0);
      }
      return;
    }

    setCurrentTrackIndex(
      currentTrackIndex === tracks.length - 1 ? 0 : currentTrackIndex + 1
    );
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex]);

  const handlePrevious = useCallback(() => {
    if (currentTrackIndex === null) {
      if (tracks.length > 0) {
        setCurrentTrackIndex(tracks.length - 1);
      }
      return;
    }

    setCurrentTrackIndex(
      currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
    );
  }, [currentTrackIndex, tracks.length, setCurrentTrackIndex]);

  // Update CSS variables for slider fills
  useEffect(() => {
    const progressBar = document.querySelector('.progressBar') as HTMLElement;
    const volumeSlider = document.querySelector('.volumeSlider') as HTMLElement;

    if (progressBar && duration > 0) {
      const fillPercentage = (currentTime / duration) * 100;
      progressBar.style.setProperty('--seek-fill', `${fillPercentage}%`);
    }

    if (volumeSlider) {
      volumeSlider.style.setProperty('--volume-fill', `${volume * 100}%`);
    }
  }, [currentTime, duration, volume]);

  // Start/stop animation based on playback state
  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }
  }, [isPlaying, audioContextRef]);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTrackIndex === null || !currentTrack) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
    };
    const onEnded = () => handleNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Set initial volume
    audio.volume = volume;
    audio.muted = isMuted;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [currentTrackIndex, currentTrack, audioRef, handleNext, volume, isMuted]);

  // Update volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, audioRef]);

  // Reset player state when track changes
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null) return;

    // Reset current time
    setCurrentTime(0);
  }, [currentTrackIndex, audioRef]);

  const handlePlayPause = () => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.pause();

        // Stop visualizations
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
        if (miniAnimationRef.current) {
          cancelAnimationFrame(miniAnimationRef.current);
          miniAnimationRef.current = null;
        }
      } else {
        // Resume audio context if suspended (needed for browsers with autoplay policies)
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume().then(() => {
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
            miniAnimationRef.current = requestAnimationFrame(
              animateMiniVisualizer
            );

            audioRef.current?.play().catch((error) => {
              console.error('Error playing audio:', error);
            });
          });
        } else {
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
          miniAnimationRef.current = requestAnimationFrame(
            animateMiniVisualizer
          );

          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
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
  };
};
