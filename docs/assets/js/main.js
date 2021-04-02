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
            console.log('[SW]', e);
          });
        });
      })
      .catch(console.error);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const networkStatus = document.querySelector('.network-status');
  const networkStatusText = document.querySelector('.network-status__text');

  const updateOnlineStatus = () => {
    const condition = navigator.onLine ? 'online' : 'offline';

    networkStatus.classList.toggle('online', navigator.onLine);
    networkStatusText.textContent = condition;
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});
