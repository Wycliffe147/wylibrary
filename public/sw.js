// Wylibrary Service Worker — v10.0
// Network-First with Cache Fallback for seamless online updates & full offline resilience

const CACHE_NAME = 'wylibrary-v18-20261109';

// Books the reader chose to keep. Managed by offline-store.js and NEVER deleted
// when the app updates (see the activate handler below).
const USER_DOCS_CACHE = 'wylibrary-user-documents';

// Don't copy big files (PDFs, zips...) into the general cache as they stream by:
// it would store every book twice and buffer it in memory.
const MAX_RUNTIME_CACHE_BYTES = 4 * 1024 * 1024;
const NEVER_RUNTIME_CACHE = /(pdf|zip|octet-stream|video|audio)/i;

function shouldRuntimeCache(response) {
  if (!response || response.status !== 200) return false;
  if (response.type !== 'basic' && response.type !== 'cors') return false;
  if (NEVER_RUNTIME_CACHE.test(response.headers.get('Content-Type') || '')) return false;
  const len = Number(response.headers.get('Content-Length'));
  if (len && len > MAX_RUNTIME_CACHE_BYTES) return false;
  return true;
}

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/offline-store.js',
  '/pdf-viewer',
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
  // PDF.js, so the viewer can open saved books with no connection
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs',
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
          .filter(name => name !== CACHE_NAME && name !== USER_DOCS_CACHE)
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
        if (shouldRuntimeCache(networkResponse)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network failed (offline or slow disconnect) -> retrieve from cache
        const cached = await caches.match(event.request, { ignoreSearch: true });
        if (cached) return cached;
        // For navigation fallback to root / index.html
        if (event.request.mode === 'navigate') {
          return (await caches.match('/index.html', { ignoreSearch: true })) || (await caches.match('/')) || Response.error();
        }
        return Response.error();
      })
  );
});
