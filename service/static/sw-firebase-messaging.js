// // reference: https://firebase.google.com/docs/cloud-messaging/js/receive?hl=ko
// importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js');


// firebase.initializeApp({
//     messagingSenderId: '307237237837',
// });

// const isSupported = firebase.messaging.isSupported();
// if (!isSupported) {
//   const messaging = firebase.messaging();
//   messaging.setBackgroundMessageHandler(function(payload) {
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.icon,
//     };
//     return self.registration.showNotification(notificationTitle, notificationOptions);
//   });
// }