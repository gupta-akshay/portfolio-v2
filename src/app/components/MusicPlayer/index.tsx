'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faVolumeHigh,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons';
import Waveform from './Waveform';
import styles from './MusicPlayer.module.scss';

interface Track {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  audioUrl: string;
  duration: string;
}

interface MusicPlayerProps {
  tracks: Track[];
}

const MusicPlayer = ({ tracks }: MusicPlayerProps) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    // Reset player state when track changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = currentTrack.audioUrl;
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackIndex, currentTrack.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
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

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.musicPlayer}>
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" />
      
      <div className={styles.trackList}>
        <h4>Playlist</h4>
        <ul>
          {tracks.map((track, index) => (
            <li 
              key={track.id} 
              className={`${styles.trackItem} ${index === currentTrackIndex ? styles.active : ''}`}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
            >
              <div className={styles.trackInfo}>
                <span className={styles.trackTitle}>{track.title}</span>
                <span className={styles.trackArtist}>{track.artist}</span>
              </div>
              <span className={styles.trackDuration}>{track.duration}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className={styles.playerControls}>
        <div className={styles.nowPlaying}>
          <div className={styles.coverImage}>
            <Image 
              src={currentTrack.coverImage} 
              alt={`${currentTrack.title} cover`} 
              width={80} 
              height={80}
              className={isPlaying ? styles.rotating : ''}
            />
          </div>
          <div className={styles.trackDetails}>
            <h4>{currentTrack.title}</h4>
            <p>{currentTrack.artist}</p>
          </div>
        </div>
        
        <div className={styles.waveformContainer}>
          <Waveform 
            audioUrl={currentTrack.audioUrl} 
            isPlaying={isPlaying} 
            currentTime={currentTime}
            duration={duration}
          />
          
          <div className={styles.timeControls}>
            <span className={styles.currentTime}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleTimeChange}
              className={styles.progressBar}
              aria-label="Seek time"
            />
            <span className={styles.totalTime}>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className={styles.controls}>
          <button 
            onClick={handlePrevious} 
            className={styles.controlButton}
            aria-label="Previous track"
          >
            <FontAwesomeIcon icon={faBackward as IconProp} />
          </button>
          <button 
            onClick={handlePlayPause} 
            className={`${styles.controlButton} ${styles.playButton}`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <FontAwesomeIcon icon={(isPlaying ? faPause : faPlay) as IconProp} />
          </button>
          <button 
            onClick={handleNext} 
            className={styles.controlButton}
            aria-label="Next track"
          >
            <FontAwesomeIcon icon={faForward as IconProp} />
          </button>
          <div className={styles.volumeControl}>
            <button 
              onClick={toggleMute} 
              className={styles.muteButton}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              <FontAwesomeIcon icon={(isMuted ? faVolumeMute : faVolumeHigh) as IconProp} />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer; 