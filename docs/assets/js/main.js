document.addEventListener('DOMContentLoaded', () => {
  const pwaInstall = document.querySelector('.pwa-install');
  let deferredPrompt;

  const showNotification = (text, options) => {
    const defaultOptions = {
      text,
      duration: 0,
      gravity: 'bottom',
      position: 'left',
      style: {
        fontSize: '0.8rem',
        background: '#3d3a51',
        userSelect: 'none',
      },
      stopOnFocus: true,
    };

    Toastify(Object.assign(defaultOptions, options)).showToast();
  };

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
          if (choiceResult.outcome === 'accepted') {
            pwaInstall.classList.remove('show');
            if (yaCounter71337676) yaCounter71337676.reachGoal('pwaInstalled');
          }
          deferredPrompt = null;
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
          if (navigator.serviceWorker.controller) {
            showNotification('cache update is available', {
              onClick() {
                window.location.reload();
              },
            });
          }
        });
      })
      .catch(console.error);
  }
});
