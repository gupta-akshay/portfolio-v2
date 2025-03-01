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
    if (!audioRef.current || !currentTrack) {
      console.warn('Audio element or current track is missing.');
      return;
    }

    const audio = audioRef.current;
    console.log('Play/Pause triggered. Current state:', {
      isPlaying,
      readyState: audio.readyState,
      paused: audio.paused,
      currentTime: audio.currentTime,
      duration: audio.duration,
      muted: audio.muted,
      volume: audio.volume,
    });

    try {
      // Resume AudioContext if suspended (for iOS Safari)
      if (audioContextRef.current?.state === 'suspended') {
        console.log('Resuming suspended AudioContext...');
        await audioContextRef.current.resume();
        console.log('AudioContext resumed successfully');
      }

      if (isPlaying) {
        console.log('Pausing audio...');
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
        console.log('Preparing to play audio...');

        // Ensure audio is unmuted
        audio.muted = false;

        // Force reload if not ready
        if (audio.readyState < 2) {
          console.log(
            'Audio not ready (readyState:',
            audio.readyState,
            '). Forcing load...'
          );
          audio.load();

          console.log('Waiting for canplaythrough event...');
          await new Promise((resolve, reject) => {
            const loadTimeout = setTimeout(() => {
              cleanup();
              reject(new Error('Audio loading timeout'));
            }, 5000);

            const onCanPlay = () => {
              cleanup();
              resolve(true);
            };

            const onError = (e: ErrorEvent) => {
              cleanup();
              reject(new Error(`Audio loading error: ${e.message}`));
            };

            const cleanup = () => {
              clearTimeout(loadTimeout);
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
            };

            audio.addEventListener('canplaythrough', onCanPlay);
            audio.addEventListener('error', onError);
          });
        }

        console.log('Attempting to play audio...');
        try {
          await audio.play();
          console.log('Audio playback started successfully');
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
          miniAnimationRef.current = requestAnimationFrame(
            animateMiniVisualizer
          );
        } catch (playError) {
          console.error('Play() failed:', playError);
          if (playError instanceof Error) {
            if (playError.name === 'NotAllowedError') {
              console.log(
                'Playback was blocked by browser policy. User interaction required.'
              );
            } else if (playError.name === 'NotSupportedError') {
              console.log('Audio format not supported by browser.');
            }
          }
          setIsPlaying(false);
          throw playError;
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
