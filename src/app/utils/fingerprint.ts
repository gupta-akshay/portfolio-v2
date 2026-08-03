import { logger } from '@/app/utils/logger';

const STORAGE_KEY = 'blog_reactions_fingerprint';

/**
 * Stable anonymous id used to attribute reactions. It is persisted in
 * localStorage, so it only has to be unique per browser — nothing about the
 * device needs to be sampled to derive it.
 */
export function getOrCreateFingerprint(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const fingerprint = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, fingerprint);
    return fingerprint;
  } catch (error) {
    // localStorage unavailable (private browsing, quota exceeded). The API
    // falls back to its own server-side fingerprint when this one churns.
    logger.warn(
      'localStorage not available, using session fingerprint:',
      error
    );
    return crypto.randomUUID();
  }
}
