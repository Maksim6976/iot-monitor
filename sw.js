const CACHE_NAME = 'iot-monitor-v3.0';

// Список всех ресурсов, которые нужны для работы офлайн
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  'https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap'
];

// Установка Service Worker и кеширование ресурсов
self.addEventListener('install', event => {
  self.skipWaiting(); // Принудительно активируем новый SW сразу после установки
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(error => console.error('Ошибка кеширования при установке:', error))
  );
});

// Активация: очистка старых кешей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Если имя кеша не совпадает с текущим, удаляем его
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Сразу берем под контроль текущие открытые страницы
  );
});

// Работа в офлайне: отдаем файлы из кеша, если нет сети
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кеша, если нашли, иначе идем в сеть
        return response || fetch(event.request);
      })
  );
});
