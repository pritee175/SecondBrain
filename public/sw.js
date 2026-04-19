// Second Brain Service Worker — Network First strategy
// This ensures the installed PWA always gets fresh updates

const CACHE_NAME = "second-brain-v2";

// On install — skip waiting so new SW activates immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// On activate — delete ALL old caches, claim all clients immediately
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// NETWORK FIRST — always try network, fall back to cache only if offline
self.addEventListener("fetch", e => {
  // Only handle GET requests
  if (e.request.method !== "GET") return;

  // Skip cross-origin requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Got fresh response from network — cache it and return it
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Network failed — try cache (offline fallback)
        return caches.match(e.request);
      })
  );
});
