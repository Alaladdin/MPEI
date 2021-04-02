document.addEventListener('DOMContentLoaded', () => {
  const networkStatus = document.querySelector('.network-status');
  const networkStatusText = document.querySelector('.network-status__text');

  // update online status
  const updateOnlineStatus = () => {
    const condition = navigator.onLine ? 'online' : 'offline';

    networkStatus.classList.toggle('online', navigator.onLine);
    networkStatusText.textContent = condition;
  };
  const showNotification = (text, onClick) => {
    Toastify({
      text,
      duration: 5000,
      gravity: 'bottom',
      position: 'left',
      style: {
        fontSize: '0.8rem',
        background: '#302F3E',
        userSelect: 'none',
      },
      stopOnFocus: true,
      onClick,
    })
      .showToast();
  };

  // pwa install prompt
  let deferredPrompt;
  const pwaInstall = document.querySelector('.pwa-install');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    pwaInstall.classList.add('show');

    // pwa btn click event
    pwaInstall.addEventListener('click', () => {
      pwaInstall.classList.remove('show');

      // Show the prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (yaCounter71337676 && choiceResult.outcome === 'accepted') yaCounter71337676.reachGoal('pwaInstalled');
        deferredPrompt = null;
      });
    });
  });

  // events
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // serviceWorker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered');

        reg.addEventListener('updatefound', () => {

          // if there's an existing controller (previous Service Worker), show the prompt
          if (navigator.serviceWorker.controller) {
            showNotification('cache update is available', () => window.location.reload());
          }
        });
      })
      .catch(console.error);
  }
});
