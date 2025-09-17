// URL cleaning utilities for Forget My Past PWA (CommonJS version for testing)

// Tracking parameters to remove
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'msclkid', 'twclid', 'igshid',
  'ref', 'referer', 'referrer', '_ga', '_gid',
  'mc_cid', 'mc_eid', 'campaign_id', 'ad_id',
  'source', 'medium', 'campaign', 'content',
  // Google mobile search tracking parameters
  'ved', 'uact', 'sa', 'biw', 'bih', 'dpr', 'ei', 'gs_lcp',
  'sclient', 'client', 'hs', 'hl', 'gl', 'cshid', 'psb',
  // LinkedIn tracking parameters
  'rcm', 'trk', 'trkInfo', 'lipi', 'licu', 'li_medium', 'li_source',
  // Other common tracking parameters
  'si', 's', 'sp', 'sr', 'st', 'se', 'sc', 'sd', 'sf', 'sg', 'sh'
];

// URL shorteners to resolve
const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly',
  'short.link', 'tiny.cc', 'is.gd', 'buff.ly', 'ift.tt',
  'share.google'
];

/**
 * Clean tracking parameters from URL
 * @param {string} urlString - The URL to clean
 * @returns {string} - The cleaned URL
 */
function cleanUrl(urlString) {
  try {
    const url = new URL(urlString);
    
    // Handle LinkedIn share URLs
    if (url.hostname === 'www.linkedin.com' && url.pathname === '/shareArticle') {
      const originalUrl = url.searchParams.get('url');
      if (originalUrl) {
        return decodeURIComponent(originalUrl);
      }
    }
    
    // Handle Google mobile search share URLs
    if (url.hostname === 'www.google.com' && url.pathname === '/search') {
      const searchQuery = url.searchParams.get('q');
      if (searchQuery) {
        return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      }
    }
    
    // Remove tracking parameters for other URLs
    TRACKING_PARAMS.forEach(param => {
      url.searchParams.delete(param);
    });
    
    return url.toString();
  } catch (e) {
    return urlString;
  }
}

/**
 * Attempt to resolve shortened URLs
 * @param {string} urlString - The URL to resolve
 * @returns {Promise<string>} - The resolved URL or original if resolution fails
 */
async function resolveShortUrl(urlString) {
  try {
    const url = new URL(urlString);
    
    // Check if it's a known shortener
    if (!SHORTENERS.some(shortener => url.hostname.includes(shortener))) {
      return urlString;
    }
    
    // Try to resolve with a HEAD request
    const response = await fetch(urlString, { 
      method: 'HEAD', 
      redirect: 'manual',
      mode: 'cors'
    });
    
    // If we get a redirect response, use the Location header
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('Location');
      if (location) {
        return location;
      }
    }
    
    return urlString;
  } catch (e) {
    // If CORS blocks us or other error, return original
    return urlString;
  }
}

/**
 * Get list of tracking parameters
 * @returns {string[]} - Array of tracking parameter names
 */
function getTrackingParams() {
  return [...TRACKING_PARAMS];
}

/**
 * Get list of URL shorteners
 * @returns {string[]} - Array of shortener domains
 */
function getShorteners() {
  return [...SHORTENERS];
}

// Export functions for CommonJS
module.exports = {
  cleanUrl,
  resolveShortUrl,
  getTrackingParams,
  getShorteners
};
