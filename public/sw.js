// Service worker disabled - clear all caches and unregister
self.addEventListener('install', (event) => {
  console.log('Service worker installing - clearing caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared, service worker will be unregistered');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating - unregistering self');
  event.waitUntil(
    self.registration.unregister().then(() => {
      console.log('Service worker unregistered successfully');
      return self.clients.claim();
    })
  );
});

// Don't handle any fetch events - let them go to network
self.addEventListener('fetch', (event) => {
  // Do nothing - let requests go directly to network
});