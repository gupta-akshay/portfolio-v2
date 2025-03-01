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
    setCurrentTime,
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
    const updateTrackUrl = async () => {
      if (currentTrack) {
        try {
          const url = await getAudioUrl(currentTrack.path);
          console.log('generated url', url);
          setCurrentUrl(url);
        } catch (error) {
          console.error('Error loading audio URL:', error);
          setIsLoading(false);
          shouldAutoPlayRef.current = false;
        }
      } else {
        setCurrentUrl(null);
        shouldAutoPlayRef.current = false;
      }
    };
    updateTrackUrl();
  }, [currentTrack]);

  // Handle audio loading events
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audioElement = audioRef.current;

      const handleLoadedMetadata = () => {
        if (audioElement) {
          setDuration(audioElement.duration);
          setIsMetadataLoaded(true);
        }
      };

      const handleCanPlayThrough = async () => {
        setIsPlayable(true);
        setIsLoading(false);

        await setupAudioContext();

        if (shouldAutoPlayRef.current) {
          shouldAutoPlayRef.current = false;
          try {
            await audioElement.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error auto-playing:', error);
            setIsPlaying(false);
          }
        }
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioElement.currentTime);
      };

      const handleError = (error: ErrorEvent) => {
        console.error('Error loading audio:', error);
        setIsLoading(false);
        setIsMetadataLoaded(false);
        setIsPlayable(false);
        shouldAutoPlayRef.current = false;
      };

      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('error', handleError);

      return () => {
        audioElement.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata
        );
        audioElement.removeEventListener(
          'canplaythrough',
          handleCanPlayThrough
        );
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('error', handleError);
      };
    }
  }, [
    currentTrack,
    setDuration,
    setIsPlaying,
    setupAudioContext,
    setCurrentTime,
  ]);

  // Set up audio context and analyzer when track starts playing
  useEffect(() => {
    if (
      !audioRef.current ||
      currentTrackIndex === null ||
      !isPlayable ||
      !isPlaying
    )
      return;

    const startVisualizations = () => {
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
        miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
      };

      animationRef.current = requestAnimationFrame(animateWaveform);
      miniAnimationRef.current = requestAnimationFrame(animateMiniVisualizer);
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
    analyserRef,
    drawWaveform,
    drawMiniVisualizer,
    animationRef,
    miniAnimationRef,
    isPlayable,
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
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return (
    <div className='cloudinaryAudioPlayer'>
      {currentTrack && currentUrl && (
        <audio
          ref={audioRef}
          src={currentUrl}
          preload='auto'
          crossOrigin='anonymous'
          playsInline
          muted
          x-webkit-airplay='allow'
          webkit-playsinline='true'
          x-webkit-playsinline='true'
          controlsList='nodownload'
        />
      )}

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
