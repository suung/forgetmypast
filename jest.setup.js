// Jest setup file for PWA testing

// Polyfill for TextEncoder/TextDecoder (required by jsdom)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock service worker for testing
global.navigator = {
  serviceWorker: {
    register: jest.fn(() => Promise.resolve()),
    ready: Promise.resolve()
  },
  share: jest.fn(() => Promise.resolve()),
  clipboard: {
    writeText: jest.fn(() => Promise.resolve())
  }
};

// Mock window.location
delete window.location;
window.location = {
  href: 'https://suung.github.io/forgetmypast/',
  pathname: '/',
  search: '',
  replaceState: jest.fn()
};

// Mock URL constructor
global.URL = URL;
