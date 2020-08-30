import firebase from 'firebase';

 if (process.client) {
    // if (!firebase.apps.length) {
    //     firebase.initializeApp({
    //         apiKey: 'AIzaSyDLM1hRPZUx6386HL6SFDoiNcIa93ITP9U',
    //         authDomain: 'hitgall.firebaseapp.com',
    //         databaseURL: 'https://hitgall.firebaseio.com',
    //         projectId: 'hitgall',
    //         storageBucket: 'hitgall.appspot.com',
    //         messagingSenderId: '307237237837',
    //         appId: '1:307237237837:web:28979138a3e0a6439f1804'
    //     })
    //  }
     messaging.requestPermission()
          .then(function() {
              console.log('Notification permission granted.');
              return messaging.getToken()
          })
          .then(function(result) {
              console.log("The token is: ", result);
          })
          .catch(function(err) {
              console.log('Unable to get permission to notify.', err);
          });

          messaging.onMessage(function(payload) {
          console.log("Message received. ", payload);
          });
        const isSupported = firebase.messaging.isSupported();
        const publicVapidKey = 'BCZlEFCOhiD5BwCfB_4ZePprkniuL9wRIp3rYa8OIYI5FaNrxJzP_vae0nayOYwl-1HZK84_Jxh4JYYvhTFTXiE'
        if (!publicVapidKey && process.client && !isSupported) {
            const messaging = firebase.messaging();
            messaging.usePublicVapidKey(publicVapidKey);
            navigator.serviceWorker
             .register("/sw.js")
             .then(registration => messaging.useServiceWorker(registration))
             .catch(err => console.error(err));
    }
   }

export default firebase;