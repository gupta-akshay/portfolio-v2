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

  const handlePlayPause = () => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        const pauseAudio = async () => {
          try {
            audioRef.current?.pause();
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

            // Suspend audio context
            if (audioContextRef.current?.state === 'running') {
              await audioContextRef.current.suspend().catch(console.error);
            }
          } catch (error) {
            console.error('Error pausing audio:', error);
          }
        };

        pauseAudio();
      } else {
        const playAudio = async () => {
          try {
            const audio = audioRef.current;
            if (!audio) return;

            // iOS Safari requires user interaction
            const userInteracted = document.documentElement.hasAttribute(
              'data-user-interacted'
            );
            if (!userInteracted) {
              document.documentElement.setAttribute(
                'data-user-interacted',
                'true'
              );
            }

            // Resume audio context if suspended (needed for Safari)
            if (audioContextRef.current?.state === 'suspended') {
              await audioContextRef.current.resume().catch((err) => {
                console.warn('Error resuming audio context:', err);
              });
            }

            // Load the audio if not loaded (important for Safari)
            if (audio.readyState < 2) {
              await new Promise((resolve, reject) => {
                audio.load();
                audio.oncanplaythrough = resolve;
                audio.onerror = reject;
                // Timeout after 5 seconds
                setTimeout(reject, 5000);
              }).catch((err) => {
                console.warn('Error loading audio:', err);
                throw new Error('Audio loading timeout');
              });
            }

            // Play the audio with explicit error handling
            try {
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                await playPromise;
                setIsPlaying(true);
              }
            } catch (playError: any) {
              console.error('Play error:', playError);
              setIsPlaying(false);
              if (playError.name === 'NotAllowedError') {
                throw new Error('Audio playback requires user interaction');
              }
              throw playError;
            }

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
            miniAnimationRef.current = requestAnimationFrame(
              animateMiniVisualizer
            );
          } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            // Reset audio context if needed
            if (audioContextRef.current?.state === 'running') {
              await audioContextRef.current.suspend().catch(console.error);
            }
          }
        };

        playAudio();
      }
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
