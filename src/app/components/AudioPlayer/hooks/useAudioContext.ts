import { useRef, useEffect, RefObject } from 'react';

/**
 * Custom hook to manage Web Audio API context and analyzer
 */
export const useAudioContext = (
  audioRef: RefObject<HTMLAudioElement | null>,
  isPlaying: boolean
) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const miniAnimationRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  // Initialize Web Audio API and clean up on unmount
  useEffect(() => {
    // Clean up function
    return () => {
      // Cancel any animation frames
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (miniAnimationRef.current) {
        cancelAnimationFrame(miniAnimationRef.current);
        miniAnimationRef.current = null;
      }

      // Close audio context to free up resources
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch((err) => {
            console.error('Error closing audio context:', err);
          });
        }
        audioContextRef.current = null;
      }

      // Clear references
      analyserRef.current = null;
      sourceRef.current = null;
      gainNodeRef.current = null;
      isInitializedRef.current = false;
    };
  }, []);

  // Setup audio context and analyzer
  const setupAudioContext = async () => {
    try {
      // Only create audio context if it doesn't exist or is closed
      if (
        !audioContextRef.current ||
        audioContextRef.current.state === 'closed'
      ) {
        // Safari requires user interaction before creating AudioContext
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass({
          // Safari prefers 44100 sample rate
          sampleRate: 44100,
          latencyHint: 'interactive',
        });
        // Reset initialization flag when creating a new context
        isInitializedRef.current = false;
      }

      const audioContext = audioContextRef.current;

      // Create analyzer node if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      // Only create the source node once or if it needs to be reconnected
      if (
        audioRef.current &&
        (!sourceRef.current || !isInitializedRef.current)
      ) {
        // If we already have a source, disconnect it
        if (sourceRef.current) {
          try {
            sourceRef.current.disconnect();
          } catch (e) {
            console.error('Error disconnecting old source node:', e);
          }
        }

        // Create new source
        sourceRef.current = audioContext.createMediaElementSource(
          audioRef.current
        );

        // Create a gain node for volume control (helps with Safari)
        gainNodeRef.current = audioContext.createGain();
        gainNodeRef.current.gain.value = 0.7; // Set initial volume

        // Connect the nodes
        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);

        isInitializedRef.current = true;
      }

      // Resume audio context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  };

  return {
    audioContextRef,
    analyserRef,
    sourceRef,
    gainNodeRef,
    animationRef,
    miniAnimationRef,
    setupAudioContext,
  };
};
