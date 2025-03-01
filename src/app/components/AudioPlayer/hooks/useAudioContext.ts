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

  // Initialize AudioContext immediately
  useEffect(() => {
    const initializeAudioContext = () => {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContextClass({
            // Safari prefers 44100 sample rate
            sampleRate: 44100,
            latencyHint: 'interactive',
          });
        }
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    };

    initializeAudioContext();
  }, []);

  // Setup audio nodes when audio element is available and playing
  useEffect(() => {
    const setupNodes = async () => {
      if (!audioRef.current || !audioContextRef.current || !isPlaying) return;

      try {
        // Resume context if suspended
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Create analyzer if it doesn't exist
        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 2048;
          analyserRef.current.smoothingTimeConstant = 0.8;
        }

        // Create gain node if it doesn't exist
        if (!gainNodeRef.current) {
          gainNodeRef.current = audioContextRef.current.createGain();
          gainNodeRef.current.gain.value = 0.7;
        }

        // Create and connect source if it doesn't exist
        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(
            audioRef.current
          );
        }

        // Connect nodes
        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error('Error setting up audio nodes:', error);
      }
    };

    setupNodes();

    // Cleanup function
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (error) {
          console.error('Error disconnecting source:', error);
        }
      }
    };
  }, [audioRef, isPlaying]);

  // Handle user interaction to unlock audio
  useEffect(() => {
    const unlockAudioContext = async (event: Event) => {
      if (!audioContextRef.current) return;

      try {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch (error) {
        console.error('Error unlocking AudioContext:', error);
      }
    };

    document.addEventListener('click', unlockAudioContext);
    document.addEventListener('touchstart', unlockAudioContext);

    return () => {
      document.removeEventListener('click', unlockAudioContext);
      document.removeEventListener('touchstart', unlockAudioContext);
    };
  }, []);

  const setupAudioContext = async () => {
    if (!audioContextRef.current || !audioRef.current) return;

    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (!isInitializedRef.current) {
        await setupNodes();
        isInitializedRef.current = true;
      }
    } catch (error) {
      console.error('Error in setupAudioContext:', error);
    }
  };

  const setupNodes = async () => {
    if (!audioRef.current || !audioContextRef.current) return;

    try {
      // Create analyzer if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }

      // Create gain node if it doesn't exist
      if (!gainNodeRef.current) {
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.7;
      }

      // Create and connect source if it doesn't exist
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(
          audioRef.current
        );
      }

      // Connect nodes
      sourceRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error('Error setting up audio nodes:', error);
      throw error;
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
