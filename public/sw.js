const CACHE_NAME = 'tirumala-utsavam-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

// Install Event - Pre-cache core app shell & skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event - Purge all old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Supabase/API requests → Network Only
  // Live cloud data should never be served from the service-worker cache.
  if (
    url.hostname.endsWith('supabase.co') ||
    url.pathname.startsWith('/rest/')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. HTML navigation → Network First, cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', copy);
            });
          }

          return response;
        })
        .catch(() => caches.match('/index.html'))
    );

    return;
  }

  // 3. Static assets → Cache First, network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const copy = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copy);
          });
        }

        return networkResponse;
      });
    })
  );
});

// ============================================================
// WEB PUSH NOTIFICATION LISTENERS
// ============================================================

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();

    const title = payload.title || '🌸 Tirumala Verse Alert';

    // Validate and sanitize destination URL (Must be strictly HTTPS)
    let safeUrl = 'https://thetirumalaverse.in/';
    if (payload.url && typeof payload.url === 'string') {
      const trimmedUrl = payload.url.trim();
      if (trimmedUrl.startsWith('https://')) {
        safeUrl = trimmedUrl;
      }
    }

    const options = {
      body: payload.body || 'New Tirumala Utsavam update available.',
      icon: payload.icon || '/logo-64.png',
      badge: payload.badge || '/logo-64.png',
      data: {
        url: safeUrl,
        type: payload.type || 'admin_custom'
      },
      tag: payload.tag || 'tirumala-custom-notification',
      renotify: true
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Error processing Web Push payload in Service Worker:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let targetUrl = event.notification.data?.url || 'https://thetirumalaverse.in/';

  // Double-check target URL protocol safety
  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'https:') {
      targetUrl = 'https://thetirumalaverse.in/';
    }
  } catch (e) {
    targetUrl = 'https://thetirumalaverse.in/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});