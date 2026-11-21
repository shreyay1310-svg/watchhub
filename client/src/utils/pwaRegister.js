/**
 * WatchHub PWA Controller & Service Worker Uninstaller
 * Ensures no stale Service Worker intercepts network requests or traps users in offline states.
 */

export const registerServiceWorker = () => {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister().then(() => {
          console.log('[PWA] Unregistered service worker:', reg.scope);
        });
      }
    }).catch((err) => {
      console.warn('[PWA] Service worker unregister check:', err);
    });
  }

  if ('caches' in window) {
    caches.keys().then((keys) => {
      for (const key of keys) {
        caches.delete(key);
      }
    }).catch(() => {});
  }
};

export const setOnUpdateFoundCallback = () => {};
export const activateUpdateAndReload = () => {
  window.location.reload();
};
export const promptPWAInstall = async () => false;
export const getInstallPromptState = () => ({ isInstallable: false });
