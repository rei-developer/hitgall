//import firebase from 'firebase'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const worker of registrations) {
        console.log('Service worker:', worker)
      }
    });

    if (process.client) {
      const cacheName = `v1`
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== cacheName) {
              return caches.delete(key)
            }
          })
        )
      })

    //   if (!firebase.apps.length) {
    //     firebase.initializeApp({
    //         apiKey: 'AIzaSyDLM1hRPZUx6386HL6SFDoiNcIa93ITP9U',
    //         authDomain: 'hitgall.firebaseapp.com',
    //         databaseURL: 'https://hitgall.firebaseio.com',
    //         projectId: 'hitgall',
    //         storageBucket: 'hitgall.appspot.com',
    //         messagingSenderId: '307237237837',
    //         appId: '1:307237237837:web:28979138a3e0a6439f1804'
    //     })
    //     const messaging = firebase.messaging();

    //     messaging.requestPermission()
    //     .then(function() {
    //       console.log('Notification permission granted.');
    //       return messaging.getToken()
    //     })
    //     .then(function(result) {
    //         console.log("The token is: ", result);
    //     })
    //     .catch(function(err) {
    //       console.log('Unable to get permission to notify.', err);
    //     });

    //     messaging.onMessage(function(payload) {
    //     console.log("Message received. ", payload);
    //     });
    // }
    }
   }
   //export default firebase
 