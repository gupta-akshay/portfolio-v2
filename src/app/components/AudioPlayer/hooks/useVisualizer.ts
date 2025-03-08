import { useRef, RefObject, useCallback } from 'react';
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
  // Cached values to prevent unnecessary recalculations
  const lastFrameTimeRef = useRef<number>(0);
  const lastMiniFrameTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number>(1000 / 60); // 60 FPS target

  // Cached gradients for optimized rendering
  const gradientCacheRef = useRef<Record<string, CanvasGradient | null>>({
    waveLight: null,
    waveDark: null,
    fillLight: null,
    fillDark: null,
    miniLight: null,
    miniDark: null,
  });

  /**
   * Draw waveform visualization
   */
  const drawWaveform = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;

    const now = performance.now();
    if (now - lastFrameTimeRef.current < frameIntervalRef.current) return;
    lastFrameTimeRef.current = now;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize only if dimensions changed
    if (
      canvas.width !== canvas.offsetWidth ||
      canvas.height !== canvas.offsetHeight
    ) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      Object.keys(gradientCacheRef.current).forEach(
        (key) => (gradientCacheRef.current[key] = null)
      );
    }

    try {
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { width, height } = canvas;
      const isLightMode = isLightTheme();

      // Use cached gradient or create a new one
      let gradient = isLightMode
        ? gradientCacheRef.current.waveLight
        : gradientCacheRef.current.waveDark;
      if (!gradient) {
        gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#2fbf71');
        gradient.addColorStop(0.5, '#5fd99a');
        gradient.addColorStop(1, isLightMode ? '#00c9c9' : '#00e5e5');
        gradientCacheRef.current[isLightMode ? 'waveLight' : 'waveDark'] =
          gradient;
      }

      // Draw smooth waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = gradient;
      ctx.beginPath();

      const skipFactor = Math.ceil(bufferLength / 512);
      const sliceWidth = width / (bufferLength / skipFactor);
      let x = 0,
        lastY = height / 2;
      const verticalScale = 0.9;

      for (let i = 0; i < bufferLength; i += skipFactor) {
        const v = dataArray[i] / 128.0;
        const y = height / 2 + (((v - 1) * height) / 2) * verticalScale;

        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = x - sliceWidth;
          const midX = prevX + (x - prevX) / 2;
          const midY = (lastY + y) / 2;
          ctx.quadraticCurveTo(prevX, lastY, midX, midY);
          ctx.quadraticCurveTo(midX, midY, x, y);
        }

        lastY = y;
        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Add fill effect
      let fillGradient = isLightMode
        ? gradientCacheRef.current.fillLight
        : gradientCacheRef.current.fillDark;
      if (!fillGradient) {
        fillGradient = ctx.createLinearGradient(0, height / 2, 0, height);
        fillGradient.addColorStop(0, 'rgba(47, 191, 113, 0.3)');
        fillGradient.addColorStop(1, 'rgba(0, 201, 201, 0.05)');
        gradientCacheRef.current[isLightMode ? 'fillLight' : 'fillDark'] =
          fillGradient;
      }

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = fillGradient;
      ctx.fill();
    } catch (error) {
      console.error('Error drawing waveform:', error);
    }
  }, [canvasRef, analyserRef]);

  /**
   * Draw mini circular visualizer
   */
  const drawMiniVisualizer = useCallback(() => {
    if (!analyserRef.current || !miniCanvasRef.current) return;

    const now = performance.now();
    if (now - lastMiniFrameTimeRef.current < frameIntervalRef.current) return;
    lastMiniFrameTimeRef.current = now;

    const miniCanvas = miniCanvasRef.current as ExtendedHTMLCanvasElement;
    const ctx = miniCanvas.getContext('2d');
    if (!ctx) return;

    // Resize if necessary
    if (
      miniCanvas.width !== miniCanvas.offsetWidth ||
      miniCanvas.height !== miniCanvas.offsetHeight
    ) {
      miniCanvas.width = miniCanvas.offsetWidth;
      miniCanvas.height = miniCanvas.offsetHeight;
      gradientCacheRef.current.miniLight = null;
      gradientCacheRef.current.miniDark = null;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    try {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);

      const { width, height } = miniCanvas;
      const isLightMode = isLightTheme();
      const centerX = width / 2,
        centerY = height / 2;
      const radius = Math.min(width, height) / 2;

      // Use cached gradient or create new one
      let gradientKey = isLightMode ? 'miniLight' : 'miniDark';
      let gradient = gradientCacheRef.current[gradientKey];
      if (!gradient) {
        gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        gradient.addColorStop(0, '#2fbf71');
        gradient.addColorStop(1, isLightMode ? '#00c9c9' : '#00e5e5');
        gradientCacheRef.current[gradientKey] = gradient;
      }

      // Calculate average frequency for scaling
      const sampleRate = Math.max(1, Math.floor(bufferLength / 64));
      let sum = 0,
        count = 0;
      for (let i = 0; i < bufferLength; i += sampleRate) {
        sum += dataArray[i];
        count++;
      }
      const avgRaw = sum / count;

      // Smooth scaling
      const prevScaleFactor = miniCanvas.prevScaleFactor || 0.3;
      const smoothingFactor = 0.3;
      const newScaleFactor = 0.3 + (avgRaw / 255) * 0.5;
      const scaleFactor =
        prevScaleFactor * smoothingFactor +
        newScaleFactor * (1 - smoothingFactor);
      miniCanvas.prevScaleFactor = scaleFactor;

      // Draw circular visualizer
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scaleFactor, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add subtle ring effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scaleFactor, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = isLightMode ? '#2fbf71' : '#5fd99a';
      ctx.stroke();
    } catch (error) {
      console.error('Error drawing mini visualizer:', error);
    }
  }, [miniCanvasRef, analyserRef]);

  return { drawWaveform, drawMiniVisualizer };
};
