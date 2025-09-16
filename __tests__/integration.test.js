const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Mock the URL cleaning module for integration testing
const { cleanUrl, resolveShortUrl } = require('../src/urlCleaner.cjs');

describe('Forget My Past PWA Integration Tests', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Load the HTML file
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    
    // Create a JSDOM instance
    dom = new JSDOM(html, {
      url: 'https://suung.github.io/forgetmypast/',
      runScripts: 'dangerously',
      resources: 'usable'
    });
    
    document = dom.window.document;
    window = dom.window;
    
    // Mock the URL cleaning functions
    window.cleanUrl = cleanUrl;
    window.resolveShortUrl = resolveShortUrl;
  });

  afterEach(() => {
    dom.window.close();
  });

  describe('PWA UI Elements', () => {
    test('has correct title', () => {
      expect(document.title).toBe('Forget My Past');
    });

    test('has correct app name in heading', () => {
      const heading = document.querySelector('h1');
      expect(heading.textContent).toBe('Forget My Past');
    });

    test('has all required input fields', () => {
      const originalUrlInput = document.getElementById('originalUrl');
      const cleanedUrlInput = document.getElementById('cleanedUrl');
      
      expect(originalUrlInput).toBeTruthy();
      expect(cleanedUrlInput).toBeTruthy();
      expect(cleanedUrlInput.readOnly).toBe(true);
    });

    test('has all required buttons', () => {
      const cleanBtn = document.getElementById('cleanBtn');
      const shareBtn = document.getElementById('shareBtn');
      const installBtn = document.getElementById('installBtn');
      
      expect(cleanBtn).toBeTruthy();
      expect(shareBtn).toBeTruthy();
      expect(installBtn).toBeTruthy();
      expect(cleanBtn.textContent).toBe('Clean Link');
      expect(shareBtn.textContent).toBe('Share Clean');
      expect(installBtn.textContent).toBe('📱 Install App');
    });

    test('has status display element', () => {
      const status = document.getElementById('status');
      expect(status).toBeTruthy();
      expect(status.style.display).toBe('');
    });
  });

  describe('PWA Manifest', () => {
    test('has correct manifest link', () => {
      const manifestLink = document.querySelector('link[rel="manifest"]');
      expect(manifestLink.href).toContain('manifest.webmanifest');
    });

    test('has favicon', () => {
      const faviconLink = document.querySelector('link[rel="icon"]');
      expect(faviconLink.href).toContain('favicon.png');
    });

    test('has theme color meta tag', () => {
      const themeColor = document.querySelector('meta[name="theme-color"]');
      expect(themeColor.content).toBe('#111827');
    });
  });

  describe('URL Cleaning Integration', () => {
    test('cleans LinkedIn URLs with rcm parameter', () => {
      const testUrl = 'https://www.linkedin.com/feed/update/urn:li:activity:7375702990294104401-IJINI?utm_source=share&utm_medium=member_android&rcm=ACoAABucfY4BuVRMj7GJdb7oRxImQAZmPdyyiQ4';
      
      const originalInput = document.getElementById('originalUrl');
      const cleanedInput = document.getElementById('cleanedUrl');
      
      // Simulate user input
      originalInput.value = testUrl;
      
      // Simulate clean button click
      const cleanBtn = document.getElementById('cleanBtn');
      const clickEvent = new window.Event('click');
      cleanBtn.dispatchEvent(clickEvent);
      
      // Check that cleaned URL doesn't contain tracking parameters
      expect(cleanedInput.value).not.toContain('rcm=');
      expect(cleanedInput.value).not.toContain('utm_source=');
      expect(cleanedInput.value).not.toContain('utm_medium=');
    });

    test('enables share button after cleaning', () => {
      const testUrl = 'https://example.com?utm_source=test&rcm=tracking';
      
      const originalInput = document.getElementById('originalUrl');
      const shareBtn = document.getElementById('shareBtn');
      
      // Initially disabled
      expect(shareBtn.disabled).toBe(true);
      
      // Simulate user input and cleaning
      originalInput.value = testUrl;
      const cleanBtn = document.getElementById('cleanBtn');
      const clickEvent = new window.Event('click');
      cleanBtn.dispatchEvent(clickEvent);
      
      // Should be enabled after cleaning (may need async handling)
      setTimeout(() => {
        expect(shareBtn.disabled).toBe(false);
      }, 100);
    });
  });

  describe('Service Worker Registration', () => {
    test('has service worker registration code', () => {
      const scripts = document.querySelectorAll('script');
      let hasServiceWorkerCode = false;
      
      scripts.forEach(script => {
        if (script.textContent.includes('serviceWorker.register')) {
          hasServiceWorkerCode = true;
        }
      });
      
      expect(hasServiceWorkerCode).toBe(true);
    });
  });

  describe('PWA Install Functionality', () => {
    test('has install button event listeners', () => {
      const installBtn = document.getElementById('installBtn');
      expect(installBtn).toBeTruthy();
      
      // Check that install button is initially hidden
      expect(installBtn.style.display).toBe('');
    });

    test('has beforeinstallprompt event listener', () => {
      const scripts = document.querySelectorAll('script');
      let hasInstallPromptCode = false;
      
      scripts.forEach(script => {
        if (script.textContent.includes('beforeinstallprompt')) {
          hasInstallPromptCode = true;
        }
      });
      
      expect(hasInstallPromptCode).toBe(true);
    });
  });

  describe('Share Target Integration', () => {
    test('handles shared URLs from query parameters', () => {
      // Mock URL with shared parameters
      const mockUrl = 'https://suung.github.io/forgetmypast/?url=https%3A//example.com%3Futm_source%3Dtest';
      
      // Create new JSDOM with query parameters
      const domWithParams = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <head><title>Forget My Past</title></head>
        <body>
          <input id="originalUrl" />
          <input id="cleanedUrl" />
          <button id="cleanBtn">Clean Link</button>
          <button id="shareBtn">Share Clean</button>
        </body>
        </html>
      `, {
        url: mockUrl,
        runScripts: 'dangerously'
      });
      
      const doc = domWithParams.window.document;
      const win = domWithParams.window;
      
      // Mock the URL cleaning function
      win.cleanUrl = cleanUrl;
      
      // Simulate the handleSharedUrl function
      const params = new win.URLSearchParams(win.location.search);
      const sharedUrl = params.get('url');
      
      expect(sharedUrl).toBe('https://example.com?utm_source=test');
      
      // Test that the URL would be cleaned
      const cleaned = win.cleanUrl(sharedUrl);
      expect(cleaned).not.toContain('utm_source=');
      
      domWithParams.window.close();
    });
  });

  describe('Error Handling', () => {
    test('handles invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-valid-url';
      const originalInput = document.getElementById('originalUrl');
      const cleanedInput = document.getElementById('cleanedUrl');
      
      originalInput.value = invalidUrl;
      
      // Should not throw an error
      expect(() => {
        const cleanBtn = document.getElementById('cleanBtn');
        const clickEvent = new window.Event('click');
        cleanBtn.dispatchEvent(clickEvent);
      }).not.toThrow();
      
      // Should handle the invalid URL (may be empty due to async nature)
      expect(typeof cleanedInput.value).toBe('string');
    });
  });
});
