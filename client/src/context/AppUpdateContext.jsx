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

export const AppUpdateProvider = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState(() => {
    return localStorage.getItem('watchhub_app_version') || '1.0.0';
  });
  const [latestVersion, setLatestVersion] = useState('1.1.0');
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [changelog, setChangelog] = useState(DEFAULT_CHANGELOG);
  const [apkDownloadUrl, setApkDownloadUrl] = useState('/downloads/WatchHub-latest.apk');
  const [fileSize, setFileSize] = useState('12.8 MB');
  const [statusMessage, setStatusMessage] = useState('');

  // Check version on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdates(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const checkForUpdates = async (manual = false) => {
    setIsChecking(true);
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
          setShowUpdateModal(true);
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
          setShowUpdateModal(true);
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
    link.download = `WatchHub-v${latestVersion}.apk`;
    link.setAttribute('type', 'application/vnd.android.package-archive');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Update local version
    localStorage.setItem('watchhub_app_version', latestVersion);
    setCurrentVersion(latestVersion);
    setHasUpdate(false);

    // 3. If running inside Android WebView / Capacitor app, trigger intent
    if (window.AndroidInstaller && window.AndroidInstaller.installApk) {
      window.AndroidInstaller.installApk(`WatchHub-v${latestVersion}.apk`);
    }
  };

  // Simulate new version bump for testing
  const simulateNewVersionRelease = (newVer = '1.2.0') => {
    setLatestVersion(newVer);
    setHasUpdate(true);
    setDownloadComplete(false);
    setDownloadProgress(0);
    setChangelog([
      `WatchHub v${newVer} Official Release`,
      'Enhanced 3D Watch Manufacturing Hub with touch-gyro controls',
      'Instant UPI Refund settlement engine with Razorpay webhook hooks',
      'Ultra-fast pre-shipment barcode scanning at packaging desks',
      'General performance & security enhancements'
    ]);
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
        isDownloading,
        downloadProgress,
        downloadComplete,
        changelog,
        apkDownloadUrl,
        fileSize,
        statusMessage,
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

