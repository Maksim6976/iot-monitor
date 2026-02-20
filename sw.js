// sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_ALERT') {
        const { title, message, icon } = event.data;
        
        const options = {
            body: message,
            icon: icon || 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
            badge: icon || 'https://cdn-icons-png.flaticon.com/512/565/565547.png',
            
            // Вибрация — ключ к звуку на Android
            // [пауза, вибрация, пауза, вибрация]
            vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
            
            tag: 'critical-alert-v3', 
            renotify: true,        // Обязательно! Заставляет телефон реагировать заново
            silent: false,         // Прямое указание системе не молчать
            requireInteraction: true, 
            
            data: { url: self.location.origin },
            actions: [
                { action: 'open', title: 'Срочно проверить' }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('/');
        })
    );
});
