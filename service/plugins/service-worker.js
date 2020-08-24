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
    }
  }