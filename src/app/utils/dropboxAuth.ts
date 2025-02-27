interface TokenResponse {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: TokenResponse | null = null;

export async function getDropboxToken(): Promise<string> {
  // If we have a cached token that's not expired, use it
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  try {
    // Always use the refresh endpoint to get a new token
    const refreshResponse = await fetch('/api/dropbox/refresh');
    if (!refreshResponse.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data: TokenResponse = await refreshResponse.json();
    cachedToken = data;
    return data.accessToken;
  } catch (error) {
    console.error('Error getting Dropbox token:', error);
    throw error;
  }
}
