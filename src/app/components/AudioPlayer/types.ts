/**
 * Type definitions for the audio player
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  path: string; // Dropbox file path
  duration?: string; // Make duration optional as we'll calculate it from metadata
}

export interface AudioPlayerProps {
  tracks: Track[];
}

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
