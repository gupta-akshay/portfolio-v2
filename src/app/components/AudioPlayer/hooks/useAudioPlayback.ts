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
    // Target all progress bars and volume sliders in the app
    const progressBars = document.querySelectorAll('.progressBar') as NodeListOf<HTMLElement>;
    const volumeSliders = document.querySelectorAll('.volumeSlider') as NodeListOf<HTMLElement>;

    // Update all progress bars
    if (progressBars.length > 0 && duration > 0) {
      const fillPercentage = (currentTime / duration) * 100;
      progressBars.forEach(progressBar => {
        progressBar.style.setProperty('--seek-fill', `${fillPercentage}%`);
      });
    }

    // Update all volume sliders
    if (volumeSliders.length > 0) {
      volumeSliders.forEach(volumeSlider => {
        volumeSlider.style.setProperty('--volume-fill', `${volume * 100}%`);
      });
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
      setIsPlaying(true);
    };
    const onPause = () => {
      setIsPlaying(false);
    };
    const onWaiting = () => {
      setIsPlaying(false);
    };
    const onPlaying = () => {
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

  const startVisualizations = () => {
    const animateWaveform = () => {
      drawWaveform();
      animationRef.current = requestAnimationFrame(animateWaveform);
    };

    const animateMiniVisualizer = () => {
      drawMiniVisualizer();
      miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
    };

    animationRef.current = requestAnimationFrame(animateWaveform);
    miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
  };

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentTrack) {
      console.warn('Audio element or current track is missing');
      return;
    }

    const audio = audioRef.current;

    try {
      // Resume AudioContext if suspended (for iOS Safari)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Ensure audio is not muted and volume is set
      audio.muted = false;
      audio.volume = volume;

      // Set volume through gain node for better Safari compatibility
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volume;
      }

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        try {
          // Force load if needed
          if (audio.readyState < audio.HAVE_ENOUGH_DATA) {
            audio.load();

            // Wait for canplay event
            await new Promise<void>((resolve, reject) => {
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
                audio.removeEventListener('canplay', onCanPlay);
                audio.removeEventListener('error', onError);
              };

              audio.addEventListener('canplay', onCanPlay);
              audio.addEventListener('error', onError);

              // Set timeout
              setTimeout(() => {
                cleanup();
                reject(new Error('Timeout waiting for audio to be playable'));
              }, 5000);
            });
          }

          // Attempt playback
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
            startVisualizations();
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
              console.log('Playback was prevented by browser policy');
            } else if (error.name === 'NotSupportedError') {
              console.log('Audio format not supported');
            }
          }
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error('Error in handlePlayPause:', error);
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
