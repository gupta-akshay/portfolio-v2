interface TokenResponse {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: TokenResponse | null = null;

/**
 * Check if the current token is valid
 */
const isTokenValid = (token: TokenResponse | null): token is TokenResponse => {
  if (!token) return false;
  // Add a 5-minute buffer to ensure token doesn't expire during use
  return Date.now() < token.expiresAt - 5 * 60 * 1000;
};

/**
 * Get a fresh access token from the server
 */
const refreshToken = async (): Promise<TokenResponse> => {
  const refreshResponse = await fetch('/api/dropbox/refresh');
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
    // Check if we have a valid cached token
    if (isTokenValid(cachedToken)) {
      return cachedToken.accessToken;
    }

    // Get a fresh token
    const newToken = await refreshToken();
    cachedToken = newToken;
    return newToken.accessToken;
  } catch (error) {
    console.error('Error getting Dropbox token:', error);
    // Clear cached token in case of error
    cachedToken = null;
    throw error;
  }
}
