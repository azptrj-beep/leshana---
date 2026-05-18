

"use strict";
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open("soureth-v7").then(cache => {

      return cache.addAll([
        "/",
        "/index.html",
        "/css/style.css",
        "/js/app.js"
      ]);
    })
  );
});
