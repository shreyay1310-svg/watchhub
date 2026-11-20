/**
 * WatchHub Enterprise Service Worker
 * Version: 1.1.0
 * Architecture: Safe Caching, Offline Fallback & Prompt-Based Updates
 */

const CACHE_VERSION = 'watchhub-v1.1.0';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;

// Core static assets to precache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

// Sensitive API routes that must NEVER be cached (Security & RBAC Protection)
const SENSITIVE_API_PREFIXES = [
  '/api/auth',
  '/api/dashboard',
  '/api/payments',
  '/api/users',
  '/api/support',
  '/api/delivery',
  '/api/inventory',
];

// 1. Service Worker Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching WatchHub static shell assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Service Worker Activation & Stale Cache Cleanup
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activated WatchHub Service Worker ${CACHE_VERSION}`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            console.log(`[SW] Removing obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event Interception with Safe Strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests (POST, PUT, DELETE must bypass SW)
  if (event.request.method !== 'GET') {
    return;
  }

  // Security Rule: NEVER cache sensitive authentication, dashboard or payment APIs
  if (SENSITIVE_API_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Navigation / HTML page requests: Network-First with Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If valid response, clone into dynamic cache
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Check cached page first
          const cachedPage = await caches.match(event.request);
          if (cachedPage) return cachedPage;

          // If offline and page not cached, show luxury offline fallback
          const offlineFallback = await caches.match('/offline.html');
          return offlineFallback || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // Static Assets (Images, Icons, Fonts, Stylesheets): Stale-While-Revalidate
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/assets/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Cache First falling back to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((networkResponse) => {
          return networkResponse;
        })
      );
    })
  );
});

// 4. Message Listener for Prompt-Based Updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING received. Activating new version immediately.');
    self.skipWaiting();
  }
});
