import { Dropbox, DropboxResponse } from 'dropbox';
import { Track } from '@/app/components/AudioPlayer/types';
import { getDropboxToken } from './dropboxAuth';

// Helper to determine if we're on the client side
const isClient = typeof window !== 'undefined';

// Get the appropriate fetch implementation
const getFetch = () => {
  if (isClient) {
    return window.fetch.bind(window);
  }
  return global.fetch;
};

/**
 * Create a new Dropbox instance with the latest token
 */
const createDropboxClient = async (): Promise<Dropbox> => {
  const accessToken = await getDropboxToken();
  return new Dropbox({ accessToken, fetch: getFetch() });
};

/**
 * Retry a Dropbox API call with a fresh token
 */
const retryWithFreshToken = async <T>(
  operation: (dbx: Dropbox) => Promise<DropboxResponse<T>>
): Promise<DropboxResponse<T>> => {
  const dbx = await createDropboxClient();
  try {
    return await operation(dbx);
  } catch (error: any) {
    // Check if error is due to invalid token
    if (error?.status === 401) {
      // Try one more time with a fresh client
      const newDbx = await createDropboxClient();
      return await operation(newDbx);
    }
    throw error;
  }
};

/**
 * Checks if a file entry is an audio file (mp3 or wav)
 */
const isAudioFile = (entry: any): boolean => {
  return (
    entry['.tag'] === 'file' &&
    (entry.name.endsWith('.mp3') || entry.name.endsWith('.wav'))
  );
};

/**
 * Extracts track metadata from filename following the format:
 * [year][original artist][name][type][artist]
 * e.g. [2024][The Beatles][Hey Jude][Cover][A-Shay]
 */
const parseTrackMetadata = (fileName: string) => {
  const cleanFileName = fileName.replace(/\.(mp3|wav)$/, '');
  const matches = cleanFileName.match(/\[(.*?)\]/g) || [];
  const parts = matches.map((m) => m.slice(1, -1));

  return {
    year: parseInt(parts[0], 10) || 9999,
    originalArtist: parts[1] || '',
    name: parts[2] || '',
    type: parts[3] || '',
    artist: parts[4] || 'A-Shay',
  };
};

/**
 * Formats the track title based on metadata
 */
const formatTrackTitle = (metadata: {
  originalArtist: string,
  name: string,
  type: string,
}): string => {
  const { originalArtist, name, type } = metadata;
  const typeString = type.trim().length > 0 ? ` - ${type}` : '';

  return originalArtist.trim().length > 0
    ? `${originalArtist}: ${name}${typeString}`
    : `${name}${typeString}`;
};

/**
 * Retrieves a list of audio tracks from Dropbox
 * Returns an array of Track objects sorted by year (newest first)
 */
export async function getAudioFilesList(): Promise<Track[]> {
  try {
    const response = await retryWithFreshToken((dbx) =>
      dbx.filesListFolder({
        path: '',
        recursive: true,
        include_media_info: true,
      })
    );

    const tracks: Track[] = response.result.entries
      .filter(isAudioFile)
      .map((file) => {
        const metadata = parseTrackMetadata(file.name);

        return {
          id: file.path_display || '',
          title: formatTrackTitle(metadata).trim(),
          artist: metadata.artist,
          path: file.path_lower || '',
          year: metadata.year,
        };
      })
      .sort((a, b) => b.year - a.year);

    return tracks;
  } catch (error) {
    console.error('Error fetching audio files:', error);
    throw error;
  }
}

// Cache for temporary links
const tempLinkCache = new Map<string, { url: string, expiry: number }>();

export async function getAudioUrl(path: string): Promise<string> {
  try {
    // Check cache first
    const cached = tempLinkCache.get(path);
    if (cached && Date.now() < cached.expiry) {
      return cached.url;
    }

    // Get fresh URL
    const response = await retryWithFreshToken((dbx) =>
      dbx.filesGetTemporaryLink({ path })
    );

    const url = response.result.link;

    // Cache the URL for 1 hour
    tempLinkCache.set(path, {
      url,
      expiry: Date.now() + 3 * 60 * 60 * 1000,
    });

    return url;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    throw error;
  }
}
