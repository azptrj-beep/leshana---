

"use strict";
const CACHE_NAME = "soureth-v5";

const FILES = [
  "/",
  "/index.html",
  "/traduction.html",
  "/css/style.css",
  "/js/translate.js"
];

self.addEventListener("install", e => {

  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
  );

});

self.addEventListener("fetch", e => {

  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
  );

});