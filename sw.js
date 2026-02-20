// sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Слушаем команду от основного скрипта
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_ALERT') {
        const { title, message, icon } = event.data;
        
        const options = {
            body: message,
            icon: icon || 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
            badge: icon || 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
            vibrate: [300, 100, 300, 100, 300], // Интенсивная вибрация
            tag: 'critical-alert', // Тег позволяет заменять старое уведомление новым
            renotify: true,        // Заставляет телефон вибрировать/звенеть при каждом обновлении
            requireInteraction: true, // Уведомление не исчезнет, пока пользователь не смахнет его
            data: { url: self.location.origin },
            actions: [
                { action: 'open', title: 'Открыть монитор' }
            ]
        };

        self.registration.showNotification(title, options);
    }
});

// Обработка клика
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('/');
        })
    );
});
