const { cleanUrl, resolveShortUrl, getTrackingParams, getShorteners } = require('../src/urlCleaner.cjs');

describe('URL Cleaner', () => {
  describe('cleanUrl', () => {
    test('removes UTM parameters', () => {
      const url = 'https://example.com/page?utm_source=google&utm_medium=cpc&utm_campaign=test';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page');
    });

    test('removes LinkedIn rcm parameter', () => {
      const url = 'https://www.linkedin.com/feed/update/urn:li:activity:7375702990294104401-IJINI?utm_source=share&utm_medium=member_android&rcm=ACoAABucfY4BuVRMj7GJdb7oRxImQAZmPdyyiQ4';
      const cleaned = cleanUrl(url);
      expect(cleaned).not.toContain('rcm=');
      expect(cleaned).not.toContain('utm_source=');
      expect(cleaned).not.toContain('utm_medium=');
    });

    test('removes Facebook tracking', () => {
      const url = 'https://example.com/page?fbclid=123456789';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page');
    });

    test('removes Google tracking', () => {
      const url = 'https://example.com/page?gclid=123456789&_ga=GA1.2.123456789';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page');
    });

    test('removes multiple tracking parameters', () => {
      const url = 'https://example.com/page?utm_source=test&rcm=tracking123&fbclid=456&gclid=789&ref=social';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page');
    });

    test('handles LinkedIn share URLs', () => {
      const originalUrl = 'https://example.com/article?utm_source=linkedin';
      const linkedinShareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(originalUrl)}`;
      const cleaned = cleanUrl(linkedinShareUrl);
      expect(cleaned).toBe(originalUrl);
    });

    test('handles Google mobile search URLs', () => {
      const url = 'https://www.google.com/search?q=test+query&ved=xyz&uact=8&sa=X&biw=360&bih=640';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://www.google.com/search?q=test%20query');
    });

    test('preserves legitimate query parameters', () => {
      const url = 'https://example.com/search?q=legitimate+query&category=tech&page=1&utm_source=tracking';
      const cleaned = cleanUrl(url);
      expect(cleaned).toContain('q=legitimate+query');
      expect(cleaned).toContain('category=tech');
      expect(cleaned).toContain('page=1');
      expect(cleaned).not.toContain('utm_source=');
    });

    test('handles URLs with no query parameters', () => {
      const url = 'https://example.com/page';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page');
    });

    test('handles invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-valid-url';
      const cleaned = cleanUrl(invalidUrl);
      expect(cleaned).toBe('not-a-valid-url');
    });

    test('handles URLs with fragments', () => {
      const url = 'https://example.com/page?utm_source=test#section1';
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page#section1');
    });

    test('removes all known tracking parameters', () => {
      const trackingParams = getTrackingParams();
      const queryString = trackingParams.map(param => `${param}=test`).join('&');
      const url = `https://example.com/page?${queryString}`;
      const cleaned = cleanUrl(url);
      expect(cleaned).toBe('https://example.com/page');
    });
  });

  describe('resolveShortUrl', () => {
    test('returns original URL for non-shortened URLs', async () => {
      const url = 'https://example.com/page';
      const resolved = await resolveShortUrl(url);
      expect(resolved).toBe(url);
    });

    test('handles fetch errors gracefully', async () => {
      // Mock fetch to throw an error
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      const url = 'https://bit.ly/test';
      const resolved = await resolveShortUrl(url);
      expect(resolved).toBe(url);
    });

    test('handles CORS errors gracefully', async () => {
      // Mock fetch to simulate CORS error
      global.fetch = jest.fn(() => Promise.reject(new Error('CORS error')));
      
      const url = 'https://t.co/test';
      const resolved = await resolveShortUrl(url);
      expect(resolved).toBe(url);
    });
  });

  describe('getTrackingParams', () => {
    test('returns array of tracking parameters', () => {
      const params = getTrackingParams();
      expect(Array.isArray(params)).toBe(true);
      expect(params).toContain('utm_source');
      expect(params).toContain('rcm');
      expect(params).toContain('fbclid');
      expect(params).toContain('gclid');
    });
  });

  describe('getShorteners', () => {
    test('returns array of shortener domains', () => {
      const shorteners = getShorteners();
      expect(Array.isArray(shorteners)).toBe(true);
      expect(shorteners).toContain('bit.ly');
      expect(shorteners).toContain('t.co');
      expect(shorteners).toContain('tinyurl.com');
    });
  });
});
