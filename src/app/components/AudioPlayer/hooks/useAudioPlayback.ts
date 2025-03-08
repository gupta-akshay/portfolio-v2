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

  const currentTrack =
    currentTrackIndex !== null ? tracks[currentTrackIndex] : null;

  // Memoized next/previous handlers to avoid unnecessary re-renders
  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex === null) return tracks.length > 0 ? 0 : null;
      return prevIndex === tracks.length - 1 ? 0 : prevIndex + 1;
    });
  }, [tracks.length]);

  const handlePrevious = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex === null)
        return tracks.length > 0 ? tracks.length - 1 : null;
      return prevIndex === 0 ? tracks.length - 1 : prevIndex - 1;
    });
  }, [tracks.length]);

  // Update slider fill styles efficiently
  useEffect(() => {
    requestAnimationFrame(() => {
      const progressBars = document.querySelectorAll(
        '.progressBar'
      ) as NodeListOf<HTMLElement>;
      const volumeSliders = document.querySelectorAll(
        '.volumeSlider'
      ) as NodeListOf<HTMLElement>;

      if (progressBars.length > 0 && duration > 0) {
        const fillPercentage = (currentTime / duration) * 100;
        progressBars.forEach((bar) =>
          bar.style.setProperty('--seek-fill', `${fillPercentage}%`)
        );
      }

      if (volumeSliders.length > 0) {
        volumeSliders.forEach((slider) =>
          slider.style.setProperty('--volume-fill', `${volume * 100}%`)
        );
      }
    });
  }, [currentTime, duration, volume]);

  // Ensure AudioContext is resumed when playing starts
  useEffect(() => {
    if (isPlaying && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [isPlaying, audioContextRef]);

  // Setup audio event listeners (efficiently managed with cleanup)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentTrackIndex === null || !currentTrack) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const setPlaying = () => setIsPlaying(true);
    const setPaused = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', setPlaying);
    audio.addEventListener('pause', setPaused);
    audio.addEventListener('waiting', setPaused);
    audio.addEventListener('playing', setPlaying);

    audio.volume = volume;
    audio.muted = isMuted;
    setIsPlaying(!audio.paused);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', setPlaying);
      audio.removeEventListener('pause', setPaused);
      audio.removeEventListener('waiting', setPaused);
      audio.removeEventListener('playing', setPlaying);
    };
  }, [currentTrackIndex, currentTrack, audioRef, volume, isMuted]);

  // Sync volume/mute state between HTML5 Audio and Web Audio API
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (gainNodeRef.current) gainNodeRef.current.gain.value = volume;
  }, [volume, gainNodeRef, audioRef]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
    if (gainNodeRef.current)
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
  }, [isMuted, volume, gainNodeRef, audioRef]);

  // Reset player state when track changes
  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== null) {
      setCurrentTime(0);
    }
  }, [currentTrackIndex, audioRef]);

  const startVisualizations = () => {
    const animate = (callback: () => void, ref: RefObject<number | null>) => {
      callback();
      ref.current = requestAnimationFrame(() => animate(callback, ref));
    };

    animate(drawWaveform, animationRef);
    animate(drawMiniVisualizer, miniAnimationRef);
  };

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentTrack)
      return console.warn('Audio element or current track is missing');

    const audio = audioRef.current;

    try {
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      audio.muted = false;
      audio.volume = volume;
      if (gainNodeRef.current) gainNodeRef.current.gain.value = volume;

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        if (audio.readyState < audio.HAVE_ENOUGH_DATA) {
          audio.load();
          await new Promise<void>((resolve, reject) => {
            // Define event handlers separately
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

            setTimeout(() => {
              cleanup();
              reject(new Error('Timeout waiting for audio to be playable'));
            }, 5000);
          });
        }

        await audio.play();
        setIsPlaying(true);
        startVisualizations();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = newVolume;
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;
      if (gainNodeRef.current)
        gainNodeRef.current.gain.value = newMuted ? 0 : volume;
      return newMuted;
    });
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
