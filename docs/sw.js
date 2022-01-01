/* eslint-disable no-restricted-globals */

const CACHE_VERSION = 'offline-v4';
const allowedCacheHosts = [
  self.location.origin,
  // 'https://api.mpei.space',
  'https://fonts.gstatic.com',
  'https://gsx2json.com',
  'https://cdnjs.cloudflare.com',
];
const contentToCache = [
  '/assets/css/main.css',
  '/assets/css/home.css',
  '/assets/css/watch.css',

  '/assets/js/watch.js',
  '/assets/js/distribution.js',
  '/assets/js/components/dropDown.js',
];

// update cache
const updateCache = async (request) => {
  const cache = await caches.open(CACHE_VERSION);

  return fetch(request)
    .then((response) => cache.put(request.url, response.clone()));
};

// Return from cache, if exists
const fromCache = async (request) => {
  const cache = await caches.open(CACHE_VERSION);

  return cache.match(request)
    .then((response) => response || Promise.reject(new Error('no-match')));
};

// Install
self.addEventListener('install', (e) => {
  console.info('[SW] Installing...');
  self.skipWaiting();

  e.waitUntil(caches.open(CACHE_VERSION)
    .then((cache) => cache.addAll(contentToCache))
    .catch(console.error));
});

// Activate
self.addEventListener('activate', async (e) => {
  console.info('[SW] Activate');

  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
          if (key === CACHE_VERSION) return;

          return caches.delete(key);
        }),
      ))
      .then(() => console.info(`[SW] Cache: ${CACHE_VERSION}`))
      .catch(console.error),
  );
});

// Fetch
self.addEventListener('fetch', async (e) => {
  const { request } = e;
  const { origin: requestHost } = new URL(request.url);
  const isFileRequesting = request.url.match(/\.\w{2,5}($|\?)/);
  const isAllowedHost = allowedCacheHosts.includes(requestHost);

  if (!isFileRequesting || !isAllowedHost || request.method !== 'GET') {
    return fetch(request)
      .catch(console.error);
  }

  // response immediately
  e.respondWith(
    fromCache(request)
      .catch(() => fetch(request)),
  );

  // update cache
  e.waitUntil(updateCache(request));
});
