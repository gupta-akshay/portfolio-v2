/**
 * Canonical origin for metadata, feeds, JSON-LD, and sharing URLs.
 * Set NEXT_PUBLIC_SITE_URL on the host (e.g. https://www.akshaygupta.live) so
 * og:url, canonical, and metadataBase match how visitors share links.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, '');
  return 'https://akshaygupta.live';
}
