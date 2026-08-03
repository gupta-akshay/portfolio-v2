/**
 * Utility functions for the audio player
 */

/**
 * Format time in seconds to MM:SS format
 */
export const formatTime = (time: number): string => {
  if (isNaN(time)) return '0:00';

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const decodedPeaksCache = new Map<string, number[]>();

/**
 * Decode base64 peak data (one byte per bucket) into 0..1 amplitudes.
 *
 * Peaks are precomputed from the real audio by `pnpm peaks:generate` and
 * delivered alongside the signed URL in the /api/music/url response.
 */
export const decodePeaks = (encoded: string): number[] => {
  const cached = decodedPeaksCache.get(encoded);
  if (cached) return cached;

  try {
    const binary = atob(encoded);
    const peaks = new Array<number>(binary.length);
    for (let i = 0; i < binary.length; i++) {
      peaks[i] = binary.charCodeAt(i) / 255;
    }
    decodedPeaksCache.set(encoded, peaks);
    return peaks;
  } catch {
    return [];
  }
};
