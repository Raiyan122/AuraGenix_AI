/**
 * Utility for robust, high-reliability favicon/logo fetching with multi-tier fallbacks.
 * Uses public favicon services (Google S2 Favicon API & DuckDuckGo / Clearbit) 
 * mapped to the tool's official domain, plus fallback monograms.
 */

/**
 * Extracts clean hostname from any URL string or domain
 */
export function extractDomain(urlOrDomain: string): string {
  if (!urlOrDomain) return '';
  try {
    const trimmed = urlOrDomain.trim();
    // Add protocol if missing for URL parsing
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(urlString);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    // Basic regex fallback if URL constructor fails
    return urlOrDomain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .split('?')[0]
      .trim();
  }
}

/**
 * Returns the primary Google S2 Favicon API URL at 128px high resolution
 */
export function getGoogleFaviconUrl(urlOrDomain: string, size: number = 128): string {
  const domain = extractDomain(urlOrDomain);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

/**
 * Returns alternative secondary fallback favicon service (DuckDuckGo Icons)
 */
export function getDuckDuckGoFaviconUrl(urlOrDomain: string): string {
  const domain = extractDomain(urlOrDomain);
  if (!domain) return '';
  return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`;
}

/**
 * Computes 2-character initials for tool monogram badges
 */
export function getToolInitials(name: string): string {
  if (!name) return 'AI';
  const clean = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || 'AI';
}
