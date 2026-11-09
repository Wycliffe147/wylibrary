// Wylibrary Service Worker — v10.0
// Network-First with Cache Fallback for seamless online updates & full offline resilience

const CACHE_NAME = 'wylibrary-v15-20261109';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/pdf-viewer.html',
  '/quiz-data.json',
  '/files-index.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/styles/base.css',
  '/styles/layout.css',
  '/styles/components.css',
  '/styles/navigation.css',
  '/styles/modals.css',
  '/styles/practice.css',
  '/styles/dark-mode.css',
  '/manifest.json',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/bg.jpg',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo-dark.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/about.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Excel_Phy.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/MANEB_Maths.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/zips.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Q&A.png'
];

// Install Event: Pre-cache core shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn('SW: Pre-cache non-fatal warning for', url, err);
          })
        )
      );
    })
  );
});

// Activate Event: Delete old legacy caches immediately & claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('SW: Purging legacy cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Listen for direct SKIP_WAITING command from the Update Button
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event: Network-First with Cache Fallback
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass Google Analytics & external trackers from service worker cache
  if (url.hostname.includes('google-analytics.com') || url.hostname.includes('googletagmanager.com')) {
    return;
  }

  // Network-First strategy:
  // 1. Try fetching fresh copy from network (Cloudflare/server)
  // 2. If online: update cache with latest response
  // 3. If offline/error: immediately serve from cache
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Network failed (offline or slow disconnect) -> retrieve from cache
        return caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // For navigation fallback to root / index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html', { ignoreSearch: true }) || caches.match('/');
          }
        });
      })
  );
});
