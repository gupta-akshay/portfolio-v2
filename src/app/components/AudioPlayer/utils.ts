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

/**
 * Check if the current theme is light
 */
export const isLightTheme = (): boolean => {
  if (typeof document === 'undefined') return true;
  return document.body.classList.contains('theme-light');
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

const fallbackPeaksCache = new Map<string, number[]>();

/**
 * Build a deterministic placeholder envelope for a track.
 *
 * Used only when a track has no precomputed peaks yet — i.e. it was uploaded
 * after the last `pnpm peaks:generate` run. Seeded from the track id so the
 * same track always draws the same shape instead of flickering between renders.
 */
export const getFallbackPeaks = (id: string, count: number): number[] => {
  const cacheKey = `${id}:${count}`;
  const cached = fallbackPeaksCache.get(cacheKey);
  if (cached) return cached;

  let seed = 0;
  for (let i = 0; i < id.length; i++) {
    seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  }

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const peaks: number[] = [];
  let value = 0.5;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Arch-shaped envelope so tracks fade in and out instead of looking uniform
    const envelope =
      0.35 +
      0.65 *
        Math.sin(Math.PI * Math.min(1, t * 1.15)) *
        (0.7 + 0.3 * Math.sin(t * 21 + (seed % 7)));
    value = value * 0.55 + random() * 0.45;
    peaks.push(
      Math.max(0.08, Math.min(1, value * envelope + 0.12 * Math.sin(t * 60 + seed)))
    );
  }

  fallbackPeaksCache.set(cacheKey, peaks);
  return peaks;
};
