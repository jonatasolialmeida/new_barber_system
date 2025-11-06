// Service Worker para PWA - Barber System
// Versão: 1.0.0

const CACHE_NAME = 'barber-system-v1';
const RUNTIME_CACHE = 'barber-runtime-v1';
const API_CACHE = 'barber-api-v1';

// Assets para cache na instalação
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/register',
  '/offline',
  '/manifest.json',
];

// Rotas da API para cache
const API_ROUTES = [
  '/api/appointments',
  '/api/services',
  '/api/barbers',
];

// === INSTALL EVENT ===
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );

  // Ativar imediatamente
  self.skipWaiting();
});

// === ACTIVATE EVENT ===
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Deletar caches antigos
            return (
              cacheName !== CACHE_NAME &&
              cacheName !== RUNTIME_CACHE &&
              cacheName !== API_CACHE
            );
          })
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );

  // Tomar controle imediatamente
  return self.clients.claim();
});

// === FETCH EVENT ===
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar chrome-extension e outras origens
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Estratégia para navegação (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clonar e cachear a resposta
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se offline, tentar cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Se não tem no cache, mostrar página offline
            return caches.match('/offline');
          });
        })
    );
    return;
  }

  // Estratégia para API (Network First, fallback para Cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Só cachear respostas bem-sucedidas
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Se offline, usar cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving API from cache:', request.url);
              return cachedResponse;
            }
            // Se não tem no cache, retornar erro
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'Você está offline. Esta requisição será sincronizada quando voltar online.',
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
    return;
  }

  // Estratégia para assets estáticos (Cache First, fallback para Network)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Cachear para próxima vez
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// === SYNC EVENT (Background Sync) ===
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  // Recuperar requisições pendentes do IndexedDB
  // e tentar enviar quando online
  console.log('[SW] Syncing pending appointments...');

  try {
    const db = await openDatabase();
    const pendingRequests = await getPendingRequests(db);

    const results = await Promise.allSettled(
      pendingRequests.map((req) => fetch(req.url, req.options))
    );

    // Remover requisições bem-sucedidas
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        removePendingRequest(db, pendingRequests[index].id);
      }
    });

    console.log('[SW] Sync completed:', results);
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// === PUSH EVENT (Notificações Push) ===
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Barber System';
  const options = {
    body: data.body || 'Você tem uma nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {},
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// === NOTIFICATION CLICK EVENT ===
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já existe uma janela aberta, focar nela
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Caso contrário, abrir nova janela
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// === MESSAGE EVENT ===
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
      })
    );
  }
});

// === HELPER FUNCTIONS ===

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('barber-sync-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getPendingRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readonly');
    const store = transaction.objectStore('pending-requests');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removePendingRequest(db, id) {
  const transaction = db.transaction(['pending-requests'], 'readwrite');
  const store = transaction.objectStore('pending-requests');
  store.delete(id);
}

console.log('[SW] Service Worker loaded');
