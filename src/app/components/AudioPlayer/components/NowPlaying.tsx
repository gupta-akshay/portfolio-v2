import React, { RefObject, useEffect } from 'react';
import { Track } from '../types';

interface NowPlayingProps {
  currentTrack: Track;
  isPlaying: boolean;
  miniCanvasRef: RefObject<HTMLCanvasElement | null>;
}

const NowPlaying: React.FC<NowPlayingProps> = ({
  currentTrack,
  isPlaying,
  miniCanvasRef,
}) => {
  // Ensure canvas is properly sized when component mounts
  useEffect(() => {
    if (miniCanvasRef.current) {
      const canvas = miniCanvasRef.current;
      // Force canvas to match its container size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Draw initial circle to ensure something is visible
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = (Math.min(canvas.width, canvas.height) / 2) * 0.5;

        // Draw circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#2fbf71';
        ctx.fill();

        // Add ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#5fd99a';
        ctx.stroke();
      }
    }
  }, [currentTrack, miniCanvasRef]);

  return (
    <div className='nowPlaying'>
      <div className='coverImage'>
        {/* Small waveform visualization */}
        <div className='miniVisualizer'>
          <canvas
            ref={miniCanvasRef as RefObject<HTMLCanvasElement>}
            width={80}
            height={80}
            className={isPlaying ? 'pulsing' : ''}
          />
        </div>
      </div>
      <div className='trackDetails'>
        <h4>{currentTrack.name || currentTrack.title}</h4>
        <div className='nowPlayingTags'>
          {currentTrack.originalArtist && (
            <span className='trackTag originalArtistTag'>
              {currentTrack.originalArtist}
            </span>
          )}
          {currentTrack.type && (
            <span className='trackTag typeTag'>{currentTrack.type}</span>
          )}
          <span className='trackTag artistTag'>{currentTrack.artist}</span>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
