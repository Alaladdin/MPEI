document.addEventListener('DOMContentLoaded', () => {
  const pwaInstall = document.querySelector('.pwa-install');
  let deferredPrompt;

  pwaInstall.onclick = (e) => e.preventDefault();

  // pwa install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    pwaInstall.classList.add('show');

    // pwa btn click event
    pwaInstall.addEventListener('click', () => {
      // Show the prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          deferredPrompt = null;
          if (choiceResult.outcome === 'accepted') {
            pwaInstall.classList.remove('show');
            if (yaCounter71337676) yaCounter71337676.reachGoal('pwaInstalled');
          }
        })
        .catch(console.error);
    });
  });

  // serviceWorker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[SW] Registered');

        reg.addEventListener('updatefound', () => {
          if (navigator.serviceWorker.controller) console.info('cache update is available');
        });
      })
      .catch(console.error);
  }

  // image zoom
  mediumZoom(document.querySelectorAll('article img:not(.cell__img)'), {
    background: '#2E303D',
    scrollOffset: 20,
  });
});
