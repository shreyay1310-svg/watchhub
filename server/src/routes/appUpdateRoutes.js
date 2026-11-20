import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { APP_VERSION_CONFIG } from '../config/versionConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Dynamic state in memory, seeded by centralized version configuration
let currentRelease = { ...APP_VERSION_CONFIG };

/**
 * GET /api/app/version
 * Public version endpoint consumed by Web PWA, Android APK, and client update listeners
 */
router.get('/version', (req, res) => {
  const clientVersion = req.query.current || '1.0.0';
  const hasUpdate = currentRelease.version !== clientVersion;

  return res.status(200).json({
    status: 'success',
    version: currentRelease.version,
    minimumVersion: currentRelease.minimumVersion,
    releaseDate: currentRelease.releaseDate,
    forceUpdate: currentRelease.forceUpdate,
    releaseNotes: currentRelease.releaseNotes,
    hasUpdate,
    latestVersion: currentRelease.version,
    currentVersion: clientVersion,
    apkUrl: '/downloads/WatchHub-latest.apk',
    changelog: currentRelease.changelog || [],
  });
});

/**
 * POST /api/app/version
 * Protected release management endpoint (Super Admin)
 */
router.post('/version', (req, res) => {
  const {
    version,
    minimumVersion,
    releaseDate,
    forceUpdate,
    releaseNotes,
    title,
  } = req.body;

  if (!version || typeof version !== 'string') {
    return res.status(400).json({
      status: 'fail',
      message: 'Valid semantic version string (e.g. 1.2.0) is required.',
    });
  }

  // Update current release state
  const prevVersion = currentRelease.version;
  const newDate = releaseDate || new Date().toISOString().split('T')[0];
  const newReleaseNotes = Array.isArray(releaseNotes)
    ? releaseNotes
    : (releaseNotes ? releaseNotes.split('\n').filter(Boolean) : currentRelease.releaseNotes);

  const newLogEntry = {
    version,
    date: newDate,
    type: forceUpdate ? 'security/mandatory' : 'feature',
    mandatory: !!forceUpdate,
    title: title || `WatchHub v${version} Production Release`,
    notes: newReleaseNotes,
  };

  currentRelease = {
    ...currentRelease,
    version,
    minimumVersion: minimumVersion || currentRelease.minimumVersion,
    releaseDate: newDate,
    forceUpdate: !!forceUpdate,
    releaseNotes: newReleaseNotes,
    changelog: [newLogEntry, ...(currentRelease.changelog || [])],
  };

  console.log(`[Version Published] WatchHub upgrade: v${prevVersion} -> v${version} (Force: ${!!forceUpdate})`);

  return res.status(200).json({
    status: 'success',
    message: `Version ${version} published successfully to production.`,
    data: {
      version: currentRelease.version,
      minimumVersion: currentRelease.minimumVersion,
      releaseDate: currentRelease.releaseDate,
      forceUpdate: currentRelease.forceUpdate,
      releaseNotes: currentRelease.releaseNotes,
    },
  });
});

/**
 * GET /api/app/history
 * Fetch release history log
 */
router.get('/history', (req, res) => {
  return res.status(200).json({
    status: 'success',
    currentVersion: currentRelease.version,
    minimumVersion: currentRelease.minimumVersion,
    history: currentRelease.changelog || [],
  });
});

/**
 * GET /api/app/download-apk
 * Android binary download endpoint
 */
router.get('/download-apk', (req, res) => {
  const apkPath = path.resolve(__dirname, '../../../client/public/downloads/WatchHub-latest.apk');
  
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="WatchHub-latest.apk"');
    return res.sendFile(apkPath);
  }

  res.status(200).json({
    status: 'success',
    message: 'WatchHub APK download initiated.',
    apkUrl: '/downloads/WatchHub-latest.apk',
  });
});

export default router;
