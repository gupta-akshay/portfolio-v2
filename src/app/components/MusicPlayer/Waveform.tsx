'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './MusicPlayer.module.scss';

interface WaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

const Waveform = ({ audioUrl, isPlaying, currentTime, duration }: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load and analyze audio data
  useEffect(() => {
    if (!audioUrl) return;
    
    setIsLoading(true);
    
    const fetchAudio = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Decode audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get audio data from the left channel
        const channelData = audioBuffer.getChannelData(0);
        
        // Reduce data points for visualization (we don't need all samples)
        const dataPoints = 100; // Number of bars in the waveform
        const blockSize = Math.floor(channelData.length / dataPoints);
        const reducedData = [];
        
        for (let i = 0; i < dataPoints; i++) {
          const blockStart = blockSize * i;
          let sum = 0;
          
          // Calculate average amplitude for this block
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channelData[blockStart + j] || 0);
          }
          
          reducedData.push(sum / blockSize);
        }
        
        setAudioData(reducedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading audio data:', error);
        // Create dummy data if loading fails
        setAudioData(Array(100).fill(0).map(() => Math.random() * 0.5));
        setIsLoading(false);
      }
    };
    
    fetchAudio();
    
    // Cleanup
    return () => {
      setAudioData([]);
    };
  }, [audioUrl]);

  // Draw waveform
  useEffect(() => {
    if (!canvasRef.current || audioData.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate progress for coloring
    const progress = duration > 0 ? currentTime / duration : 0;
    const barWidth = canvas.width / audioData.length;
    const barSpacing = 2;
    const barWidthWithSpacing = barWidth - barSpacing;
    
    // Draw each bar
    audioData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * canvas.height * 0.8; // Scale height
      
      // Determine if this bar is before or after the current playback position
      const isPlayed = index / audioData.length < progress;
      
      // Set color based on playback position
      ctx.fillStyle = isPlayed ? '#6c63ff' : '#aaa'; // Played vs unplayed
      
      // Draw bar (centered vertically)
      const y = (canvas.height - barHeight) / 2;
      ctx.fillRect(x, y, barWidthWithSpacing, barHeight);
      
      // Add pulsing effect to the current position when playing
      if (isPlaying && Math.abs(index / audioData.length - progress) < 0.01) {
        ctx.fillStyle = '#8c83ff';
        ctx.fillRect(x, y * 0.9, barWidthWithSpacing, barHeight * 1.1);
      }
    });
  }, [audioData, currentTime, duration, isPlaying]);

  return (
    <div className={styles.waveform}>
      {isLoading ? (
        <div className={styles.loadingWaveform}>
          <span>Loading waveform...</span>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={100}
          className={styles.waveformCanvas}
        />
      )}
    </div>
  );
};

export default Waveform; 