/* ============================================
   SERVICE WORKER — Cache + Offline
============================================ */

const CACHE_NAME = "soureth-cache-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/css/theme.css",
  "/css/style.css",
  "/js/global.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// INSTALLATION
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATION
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// FETCH (offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});