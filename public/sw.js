// Wylibrary Service Worker — v10.0
// Network-First with Cache Fallback for seamless online updates & full offline resilience

const CACHE_NAME = 'wylibrary-v22-20261109';

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

// Same-origin files the app cannot start without. If any of these fail to
// cache, the install FAILS and the previous working worker stays in charge,
// instead of leaving a half-empty cache that only breaks later when offline.
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/offline-store.js',
  '/quiz-data.json',
  '/styles/base.css',
  '/styles/layout.css',
  '/styles/components.css',
  '/styles/navigation.css',
  '/styles/modals.css',
  '/styles/practice.css',
  '/styles/dark-mode.css',
  '/manifest.json'
];

// Same-origin extras. Nice to have, never block the install.
const OPTIONAL_ASSETS = [
  '/pdf-viewer',
  '/pdf-viewer.html',
  '/files-index.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png'
];

// Cross-origin files (background, logos, card covers, PDF.js). These must be
// fetched in CORS mode so the response is readable and can be stored.
const REMOTE_ASSETS = [
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

const CROSS_ORIGIN_HOSTS = ['raw.githubusercontent.com', 'cdnjs.cloudflare.com'];

// Fetch a cross-origin file in CORS mode and store it. Retries once because
// GitHub raw can briefly rate-limit when many files are requested together.
async function storeRemote(cache, url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
      if (res && res.ok) {
        await cache.put(url, res);
        return true;
      }
    } catch (err) { /* try again */ }
  }
  console.warn('SW: could not pre-cache', url);
  return false;
}

// Install Event: Pre-cache core shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(CORE_ASSETS);
      await Promise.allSettled([
        ...OPTIONAL_ASSETS.map(url => cache.add(url)),
        ...REMOTE_ASSETS.map(url => storeRemote(cache, url))
      ]);
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

// If the network hasn't answered in this long AND we have a cached copy, use the
// cached copy. This is what stops the white screen when the phone says it is
// connected (Wi-Fi / mobile data on) but nothing actually gets through: such
// requests hang for 30-60s instead of failing, so "network failed -> cache"
// alone never kicks in.
const NETWORK_TIMEOUT_MS = 3000;

async function findCached(request) {
  // ignoreVary: the install-time request and the real request often differ in
  // headers the server lists in Vary, which would otherwise make a miss.
  return caches.match(request, { ignoreSearch: true, ignoreVary: true });
}

// A response that came via a redirect can't be handed to a page navigation
// (the browser rejects it). Re-wrap it as a plain response.
async function usable(response) {
  if (response && response.redirected) {
    return new Response(await response.blob(), {
      status: 200,
      statusText: 'OK',
      headers: response.headers
    });
  }
  return response;
}

async function cacheFallback(request) {
  const cached = await findCached(request);
  if (cached) return usable(cached);
  if (request.mode === 'navigate') {
    const shell = (await caches.match('/', { ignoreVary: true })) ||
                  (await caches.match('/index.html', { ignoreVary: true }));
    if (shell) return usable(shell);
  }
  return Response.error();
}

// Cross-origin images / PDF.js: cache first, refresh quietly in the background.
// The page asks for these with no-cors (CSS backgrounds, <img>), which gives an
// unreadable "opaque" response that can't be cached sensibly. So we re-request
// the same URL in CORS mode, store that, and hand the page the stored copy.
// Every online visit therefore repairs anything missing from the cache.
async function crossOriginResponse(event) {
  const request = event.request;
  const cached = await findCached(request);

  const refresh = fetch(request.url, { mode: 'cors', credentials: 'omit' })
    .then(async res => {
      if (res && res.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request.url, res.clone());
      }
      return res;
    });

  if (cached) {
    event.waitUntil(refresh.catch(() => {}));
    return cached;
  }
  return refresh.catch(() => Response.error());
}

// Fetch Event: Network-First with Cache Fallback (and a timeout)
self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bypass Google Analytics & external trackers from service worker cache
  if (url.hostname.includes('google-analytics.com') || url.hostname.includes('googletagmanager.com')) {
    return;
  }

  if (CROSS_ORIGIN_HOSTS.includes(url.hostname) && !request.headers.has('range')) {
    event.respondWith(crossOriginResponse(event));
    return;
  }

  // Range requests (PDF streaming) and API calls are never served from the shell cache.
  const skipTimeout = request.headers.has('range') || url.pathname.startsWith('/api/');

  // 1. Ask the network. If it answers, refresh the cache and use it.
  const network = fetch(request).then(networkResponse => {
    if (shouldRuntimeCache(networkResponse)) {
      const responseClone = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
    }
    return networkResponse;
  });

  // 2. Network failed outright (offline) -> cache.
  const withFallback = network.catch(() => cacheFallback(request));

  // 3. Network is hanging -> after a few seconds, cache (if we have one).
  const timedOut = new Promise(resolve => {
    if (skipTimeout) return;
    setTimeout(async () => {
      const cached = await findCached(request);
      if (cached) resolve(usable(cached));
      // no cached copy: keep waiting for the network
    }, NETWORK_TIMEOUT_MS);
  });

  // Keep the worker alive so a slow response can still refresh the cache.
  event.waitUntil(network.catch(() => {}));
  event.respondWith(Promise.race([withFallback, timedOut]));
});
