import peaksData from '@/app/data/track-peaks.json';

interface TrackPeakEntry {
  /** base64-encoded 8-bit peak buckets */
  peaks: string;
  /** track length in seconds */
  duration: number;
}

interface TrackPeaksFile {
  version: number;
  resolution: number;
  generatedAt: string;
  tracks: Record<string, TrackPeakEntry>;
}

const data = peaksData as TrackPeaksFile;

/**
 * Waveform peaks for a track, base64-encoded.
 *
 * Generated offline by `pnpm peaks:generate` — decoding audio in the browser
 * would double CloudFront egress, and the serverless runtime has no decoder.
 * Returns undefined for tracks added since the last generation run; the player
 * falls back to a deterministic placeholder waveform in that case.
 */
export function getTrackPeaks(path: string): string | undefined {
  return data.tracks[path]?.peaks;
}

/** Exact duration in seconds for a track, if it has been precomputed. */
export function getTrackDuration(path: string): number | undefined {
  return data.tracks[path]?.duration;
}
