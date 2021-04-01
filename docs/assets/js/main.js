if ('serviceWorker' in navigator) {
  document.addEventListener('DOMContentLoaded', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered');

        reg.addEventListener('updatefound', () => {
          // A wild service worker has appeared in reg.installing!
          const newWorker = reg.installing;

          console.log(newWorker.state);
          // "installing" - the install event has fired, but not yet complete
          // "installed"  - install complete
          // "activating" - the activate event has fired, but not yet complete
          // "activated"  - fully active
          // "redundant"  - discarded. Either failed install, or it's been
          //                replaced by a newer version

          newWorker.addEventListener('statechange', (e) => {
            // console.log('e', e);
            console.log('newWorker.state has changed');
          });
        });
      })
      .catch(console.error);
  });
}
