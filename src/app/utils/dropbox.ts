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

// Cache for temporary links
const tempLinkCache = new Map<string, { url: string, expiry: number }>();

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
