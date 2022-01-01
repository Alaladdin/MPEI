document.addEventListener('DOMContentLoaded', () => {
  const pwaInstall = document.querySelector('.pwa-install');
  let deferredPrompt;

  // pwa install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();

    deferredPrompt = e;

    pwaInstall.classList.add('show');

    pwaInstall.addEventListener('click', (event) => {
      event.preventDefault();

      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          deferredPrompt = null;

          if (choiceResult.outcome === 'accepted') {
            pwaInstall.classList.remove('show');
          }
        })
        .catch(console.error);
    });
  });

  // serviceWorker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.info('[SW] Registered');

        reg.addEventListener('updatefound', () => {
          if (navigator.serviceWorker.controller) {
            console.info('[SW] Cache update is available');
          }
        });
      })
      .catch(console.error);
  }

  // image zoom
  // eslint-disable-next-line no-undef
  mediumZoom(document.querySelectorAll('article img:not(.cell__img)'), {
    background: '#2E303D',
    scrollOffset: 20,
  });
});
