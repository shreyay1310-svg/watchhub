import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppUpdateContext = createContext(null);

const DEFAULT_CHANGELOG = [
  '3D Interactive Global Horology Manufacturing Hub with 60 FPS globe spin',
  'Real-Time Courier Waypoint Milestone Tracker & AWB Lookup',
  'Pre-Shipment Pick & Pack Workstation with Barcode Scanning',
  'Customer Support Helpdesk with Instant UPI Refund Authorizations',
  'Curated 2026 Swiss Haute Horlogerie catalog with 28+ world brands'
];

// Helper to strictly detect if running inside the Android APK
export const isRunningInApk = () => {
  if (typeof window === 'undefined') return false;

  // 1. Android Native JavascriptInterface injected by MainActivity.java
  if (window.AndroidInstaller) return true;

  // 2. Custom User-Agent tag added by WatchHub Android APK WebSettings
  if (typeof navigator !== 'undefined' && /WatchHubNativeApp/i.test(navigator.userAgent)) {
    return true;
  }

  // 3. Android Standalone WebView checks
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const isWebView = isAndroid && (/(wv|\.0\.0\.0)/i.test(navigator.userAgent) || window.matchMedia('(display-mode: standalone)').matches);
  if (isWebView && window.AndroidInstaller) return true;

  // 4. Explicit query parameter for debugging APK mode (?app=apk or #apk)
  if (typeof window !== 'undefined' && (window.location.search.includes('source=apk') || window.location.hash.includes('apk'))) {
    return true;
  }

  return false;
};

export const AppUpdateProvider = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState(() => {
    return localStorage.getItem('watchhub_app_version') || '1.0.0';
  });
  const [latestVersion, setLatestVersion] = useState('1.1.0');
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isManualTrigger, setIsManualTrigger] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [changelog, setChangelog] = useState(DEFAULT_CHANGELOG);
  const [apkDownloadUrl, setApkDownloadUrl] = useState('/downloads/WatchHub-latest.apk');
  const [fileSize, setFileSize] = useState('12.8 MB');
  const [statusMessage, setStatusMessage] = useState('');

  // Check version on mount ONLY if running inside the Android APK!
  useEffect(() => {
    // If running in regular web browser on PC/Laptop or Mobile Chrome, NEVER auto-open the popup!
    if (!isRunningInApk()) {
      return;
    }

    const timer = setTimeout(() => {
      checkForUpdates(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const checkForUpdates = async (manual = false) => {
    setIsChecking(true);
    if (manual) setIsManualTrigger(true);
    setStatusMessage('Checking update server...');

    try {
      const res = await axios.get(`/api/app/version?current=${currentVersion}`).catch(() => null);

      if (res && res.data && res.data.latestVersion) {
        const serverVersion = res.data.latestVersion;
        setLatestVersion(serverVersion);
        if (res.data.changelog) setChangelog(res.data.changelog);
        if (res.data.apkUrl) setApkDownloadUrl(res.data.apkUrl);
        if (res.data.fileSize) setFileSize(res.data.fileSize);

        if (serverVersion !== currentVersion) {
          setHasUpdate(true);
          // STRICT RULE: Only show update popup if inside Android APK, or if user explicitly clicked "Check for Updates" manually
          if (isRunningInApk() || manual) {
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
      } else {
        // Fallback simulation check
        if (latestVersion !== currentVersion) {
          setHasUpdate(true);
          if (isRunningInApk() || manual) {
            setShowUpdateModal(true);
          }
          setStatusMessage(`New version v${latestVersion} available!`);
        } else {
          setHasUpdate(false);
          setStatusMessage(`WatchHub is up to date (v${currentVersion})`);
          if (manual) {
            alert(`✅ You are using the latest version of WatchHub (v${currentVersion}). No update required.`);
          }
        }
      }
    } catch (err) {
      console.warn('Version check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  // Trigger Download & In-App APK Upgrade
  const downloadAndInstallUpdate = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadComplete(false);

    // Simulate smooth download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setDownloadComplete(true);
          setIsDownloading(false);

          // Trigger physical APK download & Android Package Installer intent
          triggerApkDownloadAndInstall();

          return 100;
        }
        const increment = Math.floor(Math.random() * 14) + 8;
        return Math.min(prev + increment, 98);
      });
    }, 250);
  };

  const triggerApkDownloadAndInstall = () => {
    // 1. Download file via anchor
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.download = 'WatchHub-update.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. If running inside Android WebView native bridge, trigger native installer intent
    if (window.AndroidInstaller && typeof window.AndroidInstaller.installApk === 'function') {
      try {
        window.AndroidInstaller.installApk('WatchHub-update.apk');
      } catch (e) {
        console.warn('AndroidInstaller bridge invocation:', e);
      }
    }

    // Update local storage version to latest
    localStorage.setItem('watchhub_app_version', latestVersion);
    setCurrentVersion(latestVersion);
    setHasUpdate(false);
  };

  const simulateNewVersionRelease = (newVer = '1.2.0') => {
    setLatestVersion(newVer);
    setHasUpdate(true);
    setIsManualTrigger(true);
    setShowUpdateModal(true);
  };

  return (
    <AppUpdateContext.Provider
      value={{
        currentVersion,
        latestVersion,
        hasUpdate,
        isChecking,
        showUpdateModal,
        setShowUpdateModal,
        isManualTrigger,
        isDownloading,
        downloadProgress,
        downloadComplete,
        changelog,
        apkDownloadUrl,
        fileSize,
        statusMessage,
        isApk: isRunningInApk(),
        checkForUpdates,
        downloadAndInstallUpdate,
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
