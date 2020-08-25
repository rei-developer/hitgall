// reference: https://firebase.google.com/docs/cloud-messaging/js/receive?hl=ko
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js');


firebase.initializeApp({
    'messagingSenderId': '307237237837'
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
 
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };
    console.log(payload)
 
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});