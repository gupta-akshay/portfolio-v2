// Client-side fingerprinting utility
export function generateClientFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Get canvas fingerprint
  let canvasFingerprint = '';
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Hello, world!', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  // Get screen properties
  const screenProps = [
    screen.width,
    screen.height,
    screen.colorDepth,
    screen.pixelDepth,
    screen.availWidth,
    screen.availHeight,
  ].join('|');

  // Get timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Get language
  const language = navigator.language;

  // Get platform
  const platform = navigator.platform;

  // Combine all properties
  const fingerprint = [
    canvasFingerprint,
    screenProps,
    timezone,
    language,
    platform,
    navigator.userAgent,
  ].join('|');

  // Create a simple hash (in production, you might want to use a proper hashing library)
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

// Store fingerprint in localStorage for persistence
export function getOrCreateFingerprint(): string {
  const storageKey = 'blog_reactions_fingerprint';

  // Check if localStorage is available
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // Fallback to generating a new fingerprint for each session
    return generateClientFingerprint();
  }

  try {
    let fingerprint = localStorage.getItem(storageKey);

    if (!fingerprint) {
      fingerprint = generateClientFingerprint();
      localStorage.setItem(storageKey, fingerprint);
    }

    return fingerprint;
  } catch (error) {
    // If localStorage fails (e.g., private browsing, quota exceeded),
    // fallback to generating a new fingerprint for this session
    console.warn(
      'localStorage not available, using session fingerprint:',
      error
    );
    return generateClientFingerprint();
  }
}
