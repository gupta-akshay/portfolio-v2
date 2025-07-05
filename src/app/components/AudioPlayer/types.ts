/**
 * Type definitions for the audio player
 */

import { Track } from '@/app/types';

export interface AudioPlayerProps {
  tracks: Track[];
}

// Re-export Track for convenience
export type { Track };

// Define available waveform styles
export type WaveformStyleType = 'wave';

// Add a type for the extended canvas element with prevScaleFactor
export interface ExtendedHTMLCanvasElement extends HTMLCanvasElement {
  prevScaleFactor?: number;
}

// Declare global AudioContext for TypeScript
// eslint-disable-next-line
declare global {
  interface Window {
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
  }
}
