import { useState, useRef, RefObject, useCallback } from 'react';
import { ExtendedHTMLCanvasElement } from '../types';
import { isLightTheme } from '../utils';

/**
 * Custom hook for managing audio visualizations
 */
export const useVisualizer = (
  analyserRef: RefObject<AnalyserNode | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  miniCanvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const [audioData, setAudioData] = useState<number[]>([]);
  const [waveformStyle, setWaveformStyle] = useState<'wave'>('wave');

  // Performance optimization: Cache these values to avoid recalculation
  const lastFrameTimeRef = useRef<number>(0);
  const lastMiniFrameTimeRef = useRef<number>(0); // Separate timing for mini visualizer
  const targetFpsRef = useRef<number>(30); // Limit to 30fps for better performance
  const frameIntervalRef = useRef<number>(1000 / 30); // ms between frames

  // Cache gradients to avoid recreating them on every frame
  const gradientCacheRef = useRef<{ [key: string]: CanvasGradient | null }>({
    waveLight: null,
    waveDark: null,
    fillLight: null,
    fillDark: null,
    miniLight: null,
    miniDark: null,
  });

  // Memoize the drawWaveform function to prevent unnecessary recreations
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const now = performance.now();
    const elapsed = now - lastFrameTimeRef.current;

    // Throttle rendering to target FPS
    if (elapsed < frameIntervalRef.current) return;
    lastFrameTimeRef.current = now - (elapsed % frameIntervalRef.current);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Only resize canvas if dimensions have changed
    if (
      canvas.width !== canvas.offsetWidth ||
      canvas.height !== canvas.offsetHeight
    ) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // Clear gradient cache when canvas size changes
      gradientCacheRef.current.waveLight = null;
      gradientCacheRef.current.waveDark = null;
      gradientCacheRef.current.fillLight = null;
      gradientCacheRef.current.fillDark = null;
    }

    try {
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;

      // Use time domain data for wave style
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set dimensions
      const width = canvas.width;
      const height = canvas.height;

      // Check if we're in light theme
      const isLightMode = isLightTheme();

      // Use cached gradient or create a new one
      let gradient;
      if (isLightMode) {
        if (!gradientCacheRef.current.waveLight) {
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, '#2fbf71'); // px-theme
          gradient.addColorStop(0.5, '#5fd99a');
          gradient.addColorStop(1, '#00c9c9'); // teal color
          gradientCacheRef.current.waveLight = gradient;
        } else {
          gradient = gradientCacheRef.current.waveLight;
        }
      } else {
        if (!gradientCacheRef.current.waveDark) {
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, '#2fbf71'); // px-theme
          gradient.addColorStop(0.5, '#5fd99a');
          gradient.addColorStop(1, '#00e5e5'); // brighter teal
          gradientCacheRef.current.waveDark = gradient;
        } else {
          gradient = gradientCacheRef.current.waveDark;
        }
      }

      // Draw smooth wave
      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      // Optimize point sampling - use fewer points for better performance
      // Increase skipFactor for better performance
      const skipFactor = Math.ceil(bufferLength / 250); // Reduced from 500 to 250 points
      const sliceWidth = width / (bufferLength / skipFactor);

      let x = 0;
      let lastY = height / 2;

      // Apply a subtle vertical scaling to make the wave less aggressive
      const verticalScale = 0.7; // Reduce the vertical amplitude (0-1)

      for (let i = 0; i < bufferLength; i += skipFactor) {
        // Normalize to 0-2 range and center around 1
        const v = dataArray[i] / 128.0;

        // Scale the vertical amplitude and center at half height
        const y = height / 2 + (((v - 1) * height) / 2) * verticalScale;

        // Apply bezier curve for smoother wave
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use quadratic curves for smoother lines
          const prevX = x - sliceWidth;
          const midX = prevX + (x - prevX) / 2;
          ctx.quadraticCurveTo(midX, lastY, x, y);
        }

        lastY = y;
        x += sliceWidth;
      }

      // Complete the path to the right edge
      ctx.lineTo(canvas.width, height / 2);
      ctx.stroke();

      // Add a subtle fill below the line
      let fillGradient;
      if (isLightMode) {
        if (!gradientCacheRef.current.fillLight) {
          fillGradient = ctx.createLinearGradient(0, height / 2, 0, height);
          fillGradient.addColorStop(0, 'rgba(47, 191, 113, 0.2)'); // Reduced opacity
          fillGradient.addColorStop(1, 'rgba(0, 201, 201, 0.03)');
          gradientCacheRef.current.fillLight = fillGradient;
        } else {
          fillGradient = gradientCacheRef.current.fillLight;
        }
      } else {
        if (!gradientCacheRef.current.fillDark) {
          fillGradient = ctx.createLinearGradient(0, height / 2, 0, height);
          fillGradient.addColorStop(0, 'rgba(47, 191, 113, 0.2)'); // Reduced opacity
          fillGradient.addColorStop(1, 'rgba(0, 229, 229, 0.03)');
          gradientCacheRef.current.fillDark = fillGradient;
        } else {
          fillGradient = gradientCacheRef.current.fillDark;
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = fillGradient;
      ctx.fill();
    } catch (error) {
      console.error('Error drawing waveform:', error);
    }
  }, []);

  // Memoize the drawMiniVisualizer function
  const drawMiniVisualizer = useCallback(() => {
    if (!analyserRef.current || !miniCanvasRef.current) return;

    const now = performance.now();
    const elapsed = now - lastMiniFrameTimeRef.current; // Use separate timing for mini visualizer

    // Throttle rendering to target FPS
    if (elapsed < frameIntervalRef.current) return;
    lastMiniFrameTimeRef.current = now - (elapsed % frameIntervalRef.current);

    const miniCanvas = miniCanvasRef.current as ExtendedHTMLCanvasElement;
    const ctx = miniCanvas.getContext('2d');
    if (!ctx) return;

    // Only resize canvas if dimensions have changed
    if (
      miniCanvas.width !== miniCanvas.offsetWidth ||
      miniCanvas.height !== miniCanvas.offsetHeight
    ) {
      miniCanvas.width = miniCanvas.offsetWidth;
      miniCanvas.height = miniCanvas.offsetHeight;

      // Clear gradient cache when canvas size changes
      gradientCacheRef.current.miniLight = null;
      gradientCacheRef.current.miniDark = null;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    try {
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

      // Set dimensions
      const width = miniCanvas.width;
      const height = miniCanvas.height;

      // Check if we're in light theme
      const isLightMode = isLightTheme();

      // Create radial gradient based on theme
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2;

      // Use cached gradient or create a new one
      let gradient;
      if (isLightMode) {
        if (!gradientCacheRef.current.miniLight) {
          gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius
          );
          gradient.addColorStop(0, '#2fbf71'); // px-theme
          gradient.addColorStop(1, '#00c9c9'); // teal
          gradientCacheRef.current.miniLight = gradient;
        } else {
          gradient = gradientCacheRef.current.miniLight;
        }
      } else {
        if (!gradientCacheRef.current.miniDark) {
          gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius
          );
          gradient.addColorStop(0, '#5fd99a'); // lighter green
          gradient.addColorStop(1, '#00e5e5'); // brighter teal
          gradientCacheRef.current.miniDark = gradient;
        } else {
          gradient = gradientCacheRef.current.miniDark;
        }
      }

      // Optimize: Calculate average frequency value using a subset of the data
      // Sample only every Nth value for better performance
      const sampleRate = Math.max(1, Math.floor(bufferLength / 64));
      let sum = 0;
      let count = 0;

      for (let i = 0; i < bufferLength; i += sampleRate) {
        sum += dataArray[i];
        count++;
      }

      const avgRaw = sum / count;

      // Store previous scale factor for smoothing
      const prevScaleFactor = miniCanvas.prevScaleFactor || 0.3;
      // Smooth the transition between scale factors (30% previous, 70% new)
      const smoothingFactor = 0.3;
      const newScaleFactor = 0.3 + (avgRaw / 255) * 0.5; // Reduced max scale from 0.7 to 0.5
      const scaleFactor =
        prevScaleFactor * smoothingFactor +
        newScaleFactor * (1 - smoothingFactor);

      // Store for next frame
      miniCanvas.prevScaleFactor = scaleFactor;

      // Draw circular visualizer
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scaleFactor, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add pulsing ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scaleFactor, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isLightMode ? '#2fbf71' : '#5fd99a';
      ctx.stroke();
    } catch (error) {
      console.error('Error drawing mini visualizer:', error);
    }
  }, []);

  return {
    audioData,
    waveformStyle,
    drawWaveform,
    drawMiniVisualizer,
  };
};
