const CACHE_NAME = 'e-library-v8';

// Files that must NEVER be served from SW cache — always fetch fresh from network.
// This ensures updates to app logic reach users on their next visit automatically.
const NEVER_CACHE = ['/sw.js', '/app.js', '/pdf-viewer.html', '/index.html'];

const ASSETS_TO_CACHE = [
  '/',
  '/styles/style.css',
  '/manifest.json',
  '/files-index.json',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo-dark.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/about.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Excel_Phy.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/MANEB_Maths.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/zips.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Q&A.png'
];

// Install Event
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url =>
            cache.add(url).catch(err => {
              console.warn('SW: Failed to pre-cache', url, err);
            })
          )
        );
      })
  );
});

// Activate Event — delete old caches and claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Always bypass SW cache for critical app files — go straight to network
  if (url.origin === self.location.origin && NEVER_CACHE.includes(url.pathname)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first for everything else: try network, fall back to cache offline
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
