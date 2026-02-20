const CACHE_NAME = 'iot-monitor-v3-push';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Установка Service Worker и кеширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Работа в офлайне
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// ОБРАБОТКА КЛИКА ПО УВЕДОМЛЕНИЮ
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Закрываем пуш

  // Пытаемся найти открытое окно приложения и сфокусироваться на нем
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' || client.url.includes('index.html')) {
          return client.focus();
        }
      }
      // Если окно не найдено, открываем новое
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
