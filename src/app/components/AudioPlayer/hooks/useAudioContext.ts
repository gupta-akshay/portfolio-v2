import { useRef, useEffect, useCallback, RefObject } from 'react';

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

  // Initialize AudioContext once
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass({
          sampleRate: 44100,
          latencyHint: 'interactive',
        });
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    }
  }, []);

  // Function to unlock AudioContext on user interaction
  const unlockAudioContext = useCallback(async () => {
    if (audioContextRef.current?.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.error('Error unlocking AudioContext:', error);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', unlockAudioContext);
    document.addEventListener('touchstart', unlockAudioContext);

    return () => {
      document.removeEventListener('click', unlockAudioContext);
      document.removeEventListener('touchstart', unlockAudioContext);
    };
  }, [unlockAudioContext]);

  // Setup Audio Nodes (Runs only when necessary)
  const setupNodes = useCallback(async () => {
    if (
      !audioRef.current ||
      !audioContextRef.current ||
      isInitializedRef.current
    )
      return;

    try {
      const { current: audioContext } = audioContextRef;

      // Create nodes only if they don't already exist
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContext.createGain();
        gainNodeRef.current.gain.value = 0.7;
      }

      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(
          audioRef.current
        );
        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
      }

      isInitializedRef.current = true;
    } catch (error) {
      console.error('Error setting up audio nodes:', error);
    }
  }, [audioRef]);

  // Handles audio setup when playing starts
  useEffect(() => {
    if (isPlaying) {
      setupNodes();
    }
  }, [isPlaying, setupNodes]);

  return {
    audioContextRef,
    analyserRef,
    sourceRef,
    gainNodeRef,
    animationRef,
    miniAnimationRef,
    setupAudioContext: setupNodes,
  };
};
