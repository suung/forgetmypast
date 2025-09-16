const CACHE_NAME = 'link-cleaner-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle share target POST requests
  if (url.pathname.endsWith('/share-target') && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
    return;
  }

  // Handle regular requests with cache-first strategy
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-GET requests or non-successful responses
        if (event.request.method !== 'GET' || !response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response before caching
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // If network fails, try to serve from cache anyway
        return caches.match(event.request);
      });
    })
  );
});

// Handle share target requests
async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || text || '';

    // Build query parameters for the main app
    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (url) params.set('url', url);

    // Get the correct base URL for redirect
    const baseUrl = new URL(request.url);
    const redirectUrl = baseUrl.origin + baseUrl.pathname.replace('/share-target', '/') + '?' + params.toString();
    
    return Response.redirect(redirectUrl, 303);
  } catch (error) {
    console.error('Error handling share target:', error);
    const baseUrl = new URL(request.url);
    return Response.redirect(baseUrl.origin + baseUrl.pathname.replace('/share-target', '/'), 303);
  }
}
