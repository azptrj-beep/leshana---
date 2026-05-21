
"use strict";

const CACHE = "soureth";

const FILES = [

  "/",
  "/index.html",
  "/alphabet.html",
  "/voyelles.html",
  "/ecriture.html",
  "/revision.html",
  "/vocal.html",
  "/traduction.html",
  "/quiz.html",
  
  "/css/style.css",
  "/js/app.js",
  "/js/translate.js",
  "/js/writing.js",
  "/js/quiz.js",

  "/manifest.json",

  "/images/logo.png"
];

// INSTALL
self.addEventListener("install", e => {

  e.waitUntil(

    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))

  );

  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", e => {

  e.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))

      );

    })

  );

  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", e => {

  e.respondWith(

    caches.match(e.request)
      .then(response => {

        return response || fetch(e.request);

      })

  );

});
const CACHE = "soureth-pro-v1";

const FILES = [
  "/",
  "/traduction.html",
  "/css/style.css",
  "/js/translate.js",
  "/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});