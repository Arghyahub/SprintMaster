const CACHE_NAME = "my-app-cache-v3";

const ASSETS_TO_CACHE = ["/screen-loader/splash-screen-vid.mp4"];

// Install event – cache initial assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event – clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

// Fetch event – serve from cache or fetch & cache dynamically
self.addEventListener("fetch", (event) => {
  const { request } = event;

  const url = request.url;
  const urlObj = new URL(url);

  // Only cache GET requests
  if (request.method !== "GET") return;
  if (
    request.destination.match(/image|video|audio|media/)
    // || urlObj.pathname == "/"
  ) {
    // if (request.url.end in ASSETS_TO_CACHE)
    //   request.headers = {...request.headers, Range: ''}
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});
