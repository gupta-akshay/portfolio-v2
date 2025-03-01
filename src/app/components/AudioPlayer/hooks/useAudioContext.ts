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
          console.log('Initializing AudioContext...');
          const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContextClass({
            // Safari prefers 44100 sample rate
            sampleRate: 44100,
            latencyHint: 'interactive',
          });
          console.log('AudioContext created:', audioContextRef.current.state);
        }
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    };

    initializeAudioContext();
  }, []);

  // Handle user interaction to unlock audio
  useEffect(() => {
    const unlockAudioContext = async (event: Event) => {
      console.log('Unlock attempt triggered by:', event.type);

      if (!audioContextRef.current) {
        console.warn('No AudioContext available to unlock');
        return;
      }

      try {
        if (audioContextRef.current.state === 'suspended') {
          console.log('Resuming suspended AudioContext...');
          await audioContextRef.current.resume();
          console.log('AudioContext resumed successfully');
        }

        // Create and play a silent buffer
        const buffer = audioContextRef.current.createBuffer(1, 1, 44100);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        source.stop(0.001);
        console.log('Silent buffer played successfully');
      } catch (error) {
        console.error('Error unlocking AudioContext:', error);
      }
    };

    // Add both click and touch handlers
    document.addEventListener('click', unlockAudioContext);
    document.addEventListener('touchstart', unlockAudioContext);

    return () => {
      document.removeEventListener('click', unlockAudioContext);
      document.removeEventListener('touchstart', unlockAudioContext);
    };
  }, []);

  // Setup audio context and analyzer
  const setupAudioContext = async () => {
    console.log('Setting up AudioContext...');

    try {
      if (!audioContextRef.current) {
        console.log('Creating new AudioContext...');
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContextClass({
          sampleRate: 44100,
          latencyHint: 'interactive',
        });
      }

      const audioContext = audioContextRef.current;
      console.log('Current AudioContext state:', audioContext.state);

      if (audioContext.state === 'suspended') {
        console.log('Attempting to resume AudioContext...');
        await audioContext.resume();
        console.log('AudioContext resumed successfully');
      }

      // Create analyzer node if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
        console.log('Analyzer node created');
      }

      // Setup audio nodes only if we have an audio element and haven't initialized yet
      if (audioRef.current && !isInitializedRef.current) {
        console.log('Setting up audio nodes...');

        // Disconnect existing source if any
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }

        // Create and connect nodes
        sourceRef.current = audioContext.createMediaElementSource(
          audioRef.current
        );
        gainNodeRef.current = audioContext.createGain();
        gainNodeRef.current.gain.value = 0.7;

        sourceRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);

        isInitializedRef.current = true;
        console.log('Audio nodes setup complete');
      }
    } catch (error) {
      console.error('Error in setupAudioContext:', error);
      // Reset on error
      audioContextRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
      gainNodeRef.current = null;
      isInitializedRef.current = false;
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
