/* Service worker for PWA install + offline cache
 * Strategy: stale-while-revalidate for app shell, network-first for API.
 * Version: 1.0.0
 */
const CACHE_VERSION = 'ayani-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/icons/icon.svg',
  '/assets/icons/icon-192.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL).catch(() => {
      // Some CDN URLs might fail on install (offline first run) - that's fine.
      console.warn('[SW] Some shell assets failed to cache (will lazy-load later)');
    }))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Network-first for Apps Script API (data must be fresh)
  if (url.hostname === 'script.google.com' || url.hostname === 'docs.google.com' ||
      url.hostname === 'drive.google.com' || url.hostname === 'lh3.googleusercontent.com') {
    return; // let it go to network
  }

  // Stale-while-revalidate for everything else (app shell + tile layers)
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req).then((res) => {
        // Only cache successful, basic, or cors responses
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
