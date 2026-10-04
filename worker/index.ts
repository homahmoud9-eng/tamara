// @ts-nocheck
/// <reference lib="webworker" />
declare const self: any;

self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "/icons/icon-192x192.png",
        badge: data.badge || "/icons/icon-192x192.png",
        vibrate: [200, 100, 200],
        data: {
          url: data.url || "/",
        },
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// Purge outdated/poisoned caches from previous builds upon activation
self.addEventListener("activate", (event) => {
  const allowedCaches = [
    "google-fonts-webfonts",
    "google-fonts-stylesheets",
    "static-font-assets",
  ];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !allowedCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

