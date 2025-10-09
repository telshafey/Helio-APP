// sw.js

// Bump the cache version. This is crucial for the new service worker to activate.
const CACHE_NAME = 'helio-app-cache-v2';

// Add core application files to the pre-cache list.
// This creates a reliable "app shell" that can be loaded instantly offline.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx', // Main application script
  '/manifest.json',
  'https://i.ibb.co/bF0fJgS/favicon.png' // App icon
];

// On install, pre-cache the app shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// On fetch, use a "Stale-While-Revalidate" strategy.
self.addEventListener('fetch', (event) => {
  // We only cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Create a promise to fetch the latest version from the network.
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If the fetch is successful, update the cache with the new version.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
            // Network failed, but that's okay if we have a cached response.
            console.warn(`Fetch failed for: ${event.request.url}. Serving from cache if available.`, error);
            // If there's no cached response either, the promise will reject and the browser will show its offline page.
        });

        // Return the cached response immediately if it exists.
        // If not, wait for the network to respond.
        // The user gets a fast response from cache while the cache is updated in the background.
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// On activate, clean up old caches to save space.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
