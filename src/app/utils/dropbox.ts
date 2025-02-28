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
      .filter((entry) => {
        const isAudioFile =
          entry['.tag'] === 'file' &&
          (entry.name.endsWith('.mp3') || entry.name.endsWith('.wav'));
        return isAudioFile;
      })
      .map((file) => {
        const fileName = file.name.replace(/\.(mp3|wav)$/, '');
        const matches = fileName.match(/\[(.*?)\]/g) || [];
        const parts = matches.map((m) => m.slice(1, -1));

        const year = parseInt(parts[0], 10) || 9999;
        const originalArtist = parts[1] || '';
        const name = parts[2] || '';
        const type = parts[3] || '';
        const artist = parts[4] || 'A-Shay';

        const title =
          originalArtist.trim().length > 0
            ? `${originalArtist}: ${name} - ${type}`
            : `${name} - ${type}`;

        return {
          id: file.path_display || '',
          title: title.trim(),
          artist: artist,
          path: file.path_lower || '',
          year: year,
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
