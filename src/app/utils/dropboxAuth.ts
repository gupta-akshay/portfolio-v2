interface TokenResponse {
  accessToken: string;
  expiresAt: number;
}

// Use a cache with timestamp to handle stale data
interface TokenCache {
  token: TokenResponse;
  timestamp: number;
}

let cachedToken: TokenCache | null = null;
const MAX_CACHE_AGE = 3600 * 1000; // 1 hour in milliseconds

/**
 * Check if the current token is valid
 */
const isTokenValid = (cache: TokenCache | null): cache is TokenCache => {
  if (!cache || !cache.token) return false;

  // Check if cache is too old (force refresh after MAX_CACHE_AGE)
  if (Date.now() - cache.timestamp > MAX_CACHE_AGE) return false;

  // Add a 5-minute buffer to ensure token doesn't expire during use
  return Date.now() < cache.token.expiresAt - 5 * 60 * 1000;
};

/**
 * Get a fresh access token from the server
 */
const refreshToken = async (): Promise<TokenResponse> => {
  const refreshResponse = await fetch('/api/dropbox/refresh', {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!refreshResponse.ok) {
    throw new Error('Failed to refresh access token');
  }

  const data: TokenResponse = await refreshResponse.json();
  if (!data.accessToken || !data.expiresAt) {
    throw new Error('Invalid token response from server');
  }

  return data;
};

export async function getDropboxToken(): Promise<string> {
  try {
    if (isTokenValid(cachedToken)) {
      return cachedToken.token.accessToken;
    }

    const newToken = await refreshToken();
    cachedToken = {
      token: newToken,
      timestamp: Date.now(),
    };
    return newToken.accessToken;
  } catch (error) {
    console.error('Error getting Dropbox token:', error);
    cachedToken = null;
    throw error;
  }
}
