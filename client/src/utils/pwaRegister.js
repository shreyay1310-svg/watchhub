/**
 * WatchHub PWA Service Worker & Install Prompt Controller
 */

let swRegistration = null;
let deferredInstallPrompt = null;
let updateCallback = null;

export const setOnUpdateFoundCallback = (cb) => {
  updateCallback = cb;
};

export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Listen for beforeinstallprompt event (Desktop & Android PWA Install)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('watchhub-install-available'));
    console.log('[PWA] beforeinstallprompt captured. WatchHub is installable.');
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    console.log('[PWA] WatchHub app was successfully installed!');
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        swRegistration = registration;
        console.log('[PWA] Service Worker registered with scope:', registration.scope);

        // Check if an update is already waiting
        if (registration.waiting) {
          if (updateCallback) updateCallback(registration);
        }

        // Listen for new updates discovered in background
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version installed and waiting for user activation.');
              if (updateCallback) updateCallback(registration);
            }
          });
        });
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
      });

    // Reload page when new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
};

/**
 * Trigger immediate activation of the waiting service worker
 */
export const activateUpdateAndReload = () => {
  if (swRegistration && swRegistration.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    // If no waiting worker, reload directly
    window.location.reload();
  }
};

/**
 * Trigger browser native PWA installation dialog
 */
export const promptPWAInstall = async () => {
  if (!deferredInstallPrompt) {
    return false;
  }

  deferredInstallPrompt.prompt();
  const { outcome } = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  return outcome === 'accepted';
};

export const isPWAInstallable = () => {
  return !!deferredInstallPrompt;
};
