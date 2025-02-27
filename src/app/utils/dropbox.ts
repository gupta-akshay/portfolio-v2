import { Dropbox } from 'dropbox';

// Helper to determine if we're on the client side
const isClient = typeof window !== 'undefined';

// Get the appropriate fetch implementation
const getFetch = () => {
  if (isClient) {
    return window.fetch.bind(window);
  }
  return global.fetch;
};

const dbx = new Dropbox({
  accessToken: process.env.NEXT_PUBLIC_DROPBOX_ACCESS_TOKEN,
  fetch: getFetch(),
});

export async function getAudioFilesList() {
  try {
    const response = await dbx.filesListFolder({
      path: '',
      recursive: true,
    });

    const audioFiles = response.result.entries
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

    return audioFiles;
  } catch (e) {
    console.error('Error getting audio files list:', e);
    return [];
  }
}

// Cache for temporary links
const tempLinkCache = new Map<string, { url: string; expiry: number }>();

export async function getAudioUrl(path: string | null): Promise<string | null> {
  if (!path) return null;

  // Check cache first
  const cached = tempLinkCache.get(path);
  if (cached && cached.expiry > Date.now()) {
    return cached.url;
  }

  try {
    const response = await dbx.filesGetTemporaryLink({ path });
    const url = response.result.link;

    // Cache the URL for 3 hours (Dropbox links expire in 4 hours)
    tempLinkCache.set(path, {
      url,
      expiry: Date.now() + 3 * 60 * 60 * 1000,
    });

    return url;
  } catch (error) {
    console.error('Error getting temporary link:', error);
    return null;
  }
}
