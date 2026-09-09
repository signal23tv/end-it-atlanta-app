/* =====================================================
   END IT ATLANTA — Service worker

   PRIVACY-FIRST BY DESIGN (Section 4):
   - Only the public app shell (icons, manifest, offline fallback)
     is precached. Nothing personalized is ever cached.
   - Page navigations are network-only: if the network is up, the
     server (which knows who's logged in) always answers. We never
     serve a cached HTML page, so there is no risk of showing one
     user's screen to the next person on a shared device.
   - Supabase/API requests are never intercepted by this file.
   - On logout, the client calls sw.clearAppCache (see message
     handler below) so nothing lingers after a session ends.
   ===================================================== */

const CACHE_VERSION = "eia-shell-v2";
const SHELL_ASSETS = [
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch Supabase/API calls

  // Page navigations: network-only, offline fallback only if the
  // network truly fails. Never serve a cached page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Only the explicit shell assets are cache-first; everything else
  // (including Next.js build chunks, images, etc.) goes to network
  // so we never accidentally cache something personalized.
  if (SHELL_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "clearAppCache") {
    event.waitUntil(caches.delete(CACHE_VERSION));
  }
});

/* -----------------------------------------------------
   Web Push (Section 6.5). Wired up once VAPID keys and a
   backend sender exist (see PushSubscription work). Lock-screen
   content stays neutral per Section 6.4 -- never put medication
   names, clinics, or message previews here.
   ----------------------------------------------------- */
self.addEventListener("push", (event) => {
  let payload = { title: "END IT ATLANTA", body: "You have an update." };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // Malformed push payload -- fall back to the neutral default
    // rather than showing nothing or throwing.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: payload.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
