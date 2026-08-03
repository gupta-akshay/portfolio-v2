/**
 * Type definitions for the audio player
 */

import { Track } from '@/app/types';

export interface AudioPlayerProps {
  tracks: Track[];
}

// Re-export Track for convenience
export type { Track };
