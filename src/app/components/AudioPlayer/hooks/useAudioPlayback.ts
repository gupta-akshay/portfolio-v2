import { useState, useEffect, RefObject } from 'react';
import { Track } from '@/app/types';
import { logger } from '@/app/utils/logger';

/**
 * Custom hook to manage audio playback state and controls
 */
export const useAudioPlayback = (
  audioRef: RefObject<HTMLAudioElement | null>,
  tracks: Track[]
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
  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex === null) return tracks.length > 0 ? 0 : null;
      return prevIndex === tracks.length - 1 ? 0 : prevIndex + 1;
    });
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => {
      if (prevIndex === null)
        return tracks.length > 0 ? tracks.length - 1 : null;
      return prevIndex === 0 ? tracks.length - 1 : prevIndex - 1;
    });
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume, audioRef]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted, audioRef]);

  // Reset player state when track changes
  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== null) {
      const resetTime = () => {
        setCurrentTime(0);
      };
      resetTime();
    }
  }, [currentTrackIndex, audioRef]);

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentTrack) {
      logger.warn('Audio element or current track is missing');
      return;
    }

    const audio = audioRef.current;

    try {
      audio.muted = false;
      audio.volume = volume;

      if (isPlaying) {
        audio.pause();
      } else {
        // play() resolves once the browser has buffered enough to start, and
        // rejects if the source fails — no readiness handshake needed here.
        await audio.play();
      }
    } catch (error) {
      logger.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  /** Seek to an absolute time in seconds (waveform scrub, keyboard slider). */
  const seekTo = (time: number) => {
    if (!Number.isFinite(time)) return;
    const audio = audioRef.current;
    const upperBound =
      audio && Number.isFinite(audio.duration) ? audio.duration : duration;
    const clamped = Math.max(0, Math.min(time, upperBound || 0));

    setCurrentTime(clamped);
    if (audio) audio.currentTime = clamped;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  return {
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    currentTrack,
    handlePlayPause,
    handleNext,
    handlePrevious,
    seekTo,
    handleVolumeChange,
    toggleMute,
  };
};
