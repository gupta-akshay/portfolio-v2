import { Dropbox } from 'dropbox';
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

export async function getAudioFilesList(): Promise<Track[]> {
  try {
    const accessToken = await getDropboxToken();

    const dbx = new Dropbox({ accessToken, fetch: getFetch() });

    const response = await dbx.filesListFolder({
      path: '',
      recursive: true,
      include_media_info: true,
    });

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
const tempLinkCache = new Map<string, { url: string; expiry: number }>();

export async function getAudioUrl(path: string): Promise<string> {
  try {
    const accessToken = await getDropboxToken();

    const dbx = new Dropbox({ accessToken, fetch: getFetch() });

    const response = await dbx.filesGetTemporaryLink({
      path: path,
    });

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
