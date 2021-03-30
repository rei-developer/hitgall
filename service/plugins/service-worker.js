if(process.client) {
   const cacheName = `${process.env.packageVersionNumber}`
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

 