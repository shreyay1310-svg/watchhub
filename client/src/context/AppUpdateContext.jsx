import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { APP_VERSION } from '../config/version';
import { activateUpdateAndReload, setOnUpdateFoundCallback } from '../utils/pwaRegister';

const AppUpdateContext = createContext(null);

const DEFAULT_CHANGELOG = [
  'Inside Watchmaking: 9-stage interactive mechanical watch assembly cinematic video',
  'High-resolution, uncropped luxury watch catalog assets across all collections',
  'Progressive Web App (PWA) with offline fallback and standalone app installation',
  'Enterprise SEO suite with Schema.org JSON-LD microdata and automated XML Sitemap',
  'Real-time Service Worker version update detection and seamless asset migration',
];

export const isRunningInApk = () => {
  if (typeof window === 'undefined') return false;
  if (window.AndroidInstaller) return true;
  if (typeof navigator !== 'undefined' && /WatchHubNativeApp/i.test(navigator.userAgent)) {
    return true;
  }
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const isWebView = isAndroid && (/(wv|\.0\.0\.0)/i.test(navigator.userAgent) || window.matchMedia('(display-mode: standalone)').matches);
  if (isWebView && window.AndroidInstaller) return true;
  if (typeof window !== 'undefined' && (window.location.search.includes('source=apk') || window.location.hash.includes('apk'))) {
    return true;
  }
  return false;
};

// Compare two semantic version strings: returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
export const compareSemVer = (v1, v2) => {
  if (!v1 || !v2) return 0;
  const p1 = v1.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  const p2 = v2.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
};

export const AppUpdateProvider = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState(() => {
    return localStorage.getItem('watchhub_app_version') || APP_VERSION;
  });
  const [latestVersion, setLatestVersion] = useState(APP_VERSION);
  const [minimumVersion, setMinimumVersion] = useState('1.0.0');
  const [forceUpdate, setForceUpdate] = useState(false);
  const [releaseDate, setReleaseDate] = useState('2026-11-18');
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isManualTrigger, setIsManualTrigger] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState(DEFAULT_CHANGELOG);
  const [apkDownloadUrl, setApkDownloadUrl] = useState('/downloads/WatchHub-latest.apk');
  const [fileSize, setFileSize] = useState('12.8 MB');
  const [statusMessage, setStatusMessage] = useState('');
  const [pwaWorkerWaiting, setPwaWorkerWaiting] = useState(false);

  // Hook into Service Worker update found callback
  useEffect(() => {
    setOnUpdateFoundCallback(() => {
      console.log('[AppUpdate] New PWA service worker installed in background.');
      setPwaWorkerWaiting(true);
      setHasUpdate(true);
      setShowUpdateModal(true);
    });
  }, []);

  // Check version on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdates(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const checkForUpdates = async (manual = false) => {
    setIsChecking(true);
    if (manual) setIsManualTrigger(true);
    setStatusMessage('Checking update server...');

    try {
      const res = await axios.get(`/api/app/version?current=${currentVersion}`).catch(() => null);

      if (res && res.data) {
        const serverVersion = res.data.version || res.data.latestVersion || APP_VERSION;
        const minVer = res.data.minimumVersion || '1.0.0';
        const isForced = !!res.data.forceUpdate || compareSemVer(currentVersion, minVer) < 0;

        setLatestVersion(serverVersion);
        setMinimumVersion(minVer);
        setForceUpdate(isForced);
        if (res.data.releaseDate) setReleaseDate(res.data.releaseDate);
        if (res.data.releaseNotes) setReleaseNotes(res.data.releaseNotes);
        if (res.data.apkUrl) setApkDownloadUrl(res.data.apkUrl);

        // Check if an upgrade is available (serverVersion > currentVersion)
        const updateAvailable = compareSemVer(serverVersion, currentVersion) > 0;

        if (updateAvailable || isForced) {
          setHasUpdate(true);
          const isRemindedLater = sessionStorage.getItem(`watchhub_remind_later_${serverVersion}`);

          // Always show if forced, or if manually triggered, or if not snoozed for current session
          if (isForced || manual || !isRemindedLater) {
            setShowUpdateModal(true);
          }
          setStatusMessage(`New version v${serverVersion} available!`);
        } else {
          setHasUpdate(false);
          setStatusMessage(`WatchHub is up to date (v${currentVersion})`);
          if (manual) {
            alert(`✅ You are using the latest version of WatchHub (v${currentVersion}). No update required.`);
          }
        }
      }
    } catch (err) {
      console.warn('[AppUpdate] Version check failed:', err);
    } finally {
      setIsChecking(false);
    }
  };

  // Perform Update (Web PWA or Native APK)
  const performUpdate = () => {
    // 1. If running inside Android APK, execute native APK installer
    if (isRunningInApk()) {
      downloadAndInstallApk();
      return;
    }

    // 2. If running as Web PWA / Browser, activate waiting service worker and refresh
    setIsDownloading(true);
    setStatusMessage('Activating latest WatchHub build...');

    // Small delay for clean visual feedback
    setTimeout(() => {
      localStorage.setItem('watchhub_app_version', latestVersion);
      setCurrentVersion(latestVersion);
      setHasUpdate(false);
      setShowUpdateModal(false);
      setIsDownloading(false);

      // Trigger Service Worker activation
      activateUpdateAndReload();
    }, 800);
  };

  // Trigger Download & In-App APK Upgrade (for Android wrapper)
  const downloadAndInstallApk = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setDownloadComplete(true);
          setIsDownloading(false);

          triggerApkDownloadAndInstall();
          return 100;
        }
        const increment = Math.floor(Math.random() * 14) + 8;
        return Math.min(prev + increment, 98);
      });
    }, 250);
  };

  const triggerApkDownloadAndInstall = () => {
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.download = 'WatchHub-update.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.AndroidInstaller && typeof window.AndroidInstaller.installApk === 'function') {
      try {
        window.AndroidInstaller.installApk('WatchHub-update.apk');
      } catch (e) {
        console.warn('AndroidInstaller bridge invocation:', e);
      }
    }

    localStorage.setItem('watchhub_app_version', latestVersion);
    setCurrentVersion(latestVersion);
    setHasUpdate(false);
  };

  const snoozeUpdate = () => {
    if (forceUpdate) return; // Cannot snooze mandatory updates
    sessionStorage.setItem(`watchhub_remind_later_${latestVersion}`, 'true');
    setShowUpdateModal(false);
  };

  const simulateNewVersionRelease = (newVer = '1.2.0', notes = null, mandatory = false) => {
    setLatestVersion(newVer);
    setHasUpdate(true);
    setForceUpdate(mandatory);
    if (notes) setReleaseNotes(notes);
    setIsManualTrigger(true);
    setShowUpdateModal(true);
  };

  return (
    <AppUpdateContext.Provider
      value={{
        currentVersion,
        latestVersion,
        minimumVersion,
        forceUpdate,
        releaseDate,
        hasUpdate,
        isChecking,
        showUpdateModal,
        setShowUpdateModal,
        isManualTrigger,
        isDownloading,
        downloadProgress,
        downloadComplete,
        releaseNotes,
        apkDownloadUrl,
        fileSize,
        statusMessage,
        isApk: isRunningInApk(),
        checkForUpdates,
        performUpdate,
        snoozeUpdate,
        simulateNewVersionRelease,
      }}
    >
      {children}
    </AppUpdateContext.Provider>
  );
};

export const useAppUpdate = () => {
  const context = useContext(AppUpdateContext);
  if (!context) {
    throw new Error('useAppUpdate must be used within an AppUpdateProvider');
  }
  return context;
};

export default AppUpdateContext;
