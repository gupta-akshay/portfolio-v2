import { useState, useEffect, RefObject, useCallback } from 'react';
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
  audioContextRef: RefObject<AudioContext | null>,
  gainNodeRef: RefObject<GainNode | null>
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
    const onPlay = () => {
      console.log('Play event triggered');
      setIsPlaying(true);
    };
    const onPause = () => {
      console.log('Pause event triggered');
      setIsPlaying(false);
    };
    const onWaiting = () => {
      console.log('Waiting event triggered');
      setIsPlaying(false);
    };
    const onPlaying = () => {
      console.log('Playing event triggered');
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);

    // Set initial volume
    audio.volume = volume;
    audio.muted = isMuted;

    // Set initial playing state
    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
    };
  }, [currentTrackIndex, currentTrack, audioRef, handleNext, volume, isMuted]);

  // Update volume for both HTML5 Audio and Web Audio API
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume, gainNodeRef, audioRef]);

  // Update mute state for both HTML5 Audio and Web Audio API
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [isMuted, volume, gainNodeRef, audioRef]);

  // Reset player state when track changes
  useEffect(() => {
    if (!audioRef.current || currentTrackIndex === null) return;

    // Reset current time
    setCurrentTime(0);
  }, [currentTrackIndex, audioRef]);

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;

    try {
      // Resume AudioContext if suspended (for iOS Safari)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);

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
        // Force reload in case audio is not loading
        if (audio.readyState < 2) {
          await new Promise((resolve, reject) => {
            audio.load();
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            setTimeout(reject, 5000); // Timeout after 5s
          }).catch((err) => {
            console.warn('Error loading audio:', err);
            throw new Error('Audio loading timeout');
          });
        }

        await audio.play();
        setIsPlaying(true);

        // Start visualizations after successful play
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

        animationRef.current = requestAnimationFrame(animateWaveform);
        miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
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

    // Update gain node directly for immediate effect
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);

    // Update gain node directly for immediate effect
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = !isMuted ? 0 : volume;
    }
  };

  return {
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    currentTime,
    setCurrentTime,
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
