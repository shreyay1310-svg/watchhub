import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// In-memory version state (can be updated dynamically)
let appVersionData = {
  currentVersion: '1.0.0',
  latestVersion: '1.1.0',
  versionCode: 110,
  releaseDate: '04 Nov 2026',
  fileSize: '12.8 MB',
  apkUrl: '/downloads/WatchHub-latest.apk',
  forceUpdate: false,
  changelog: [
    '3D Interactive Global Horology Manufacturing Hub with 60 FPS globe spin',
    'Real-Time Courier Waypoint Milestone Tracker & AWB Lookup',
    'Pre-Shipment Pick & Pack Workstation with Barcode Scanning',
    'Customer Support Helpdesk with Instant UPI Refund Authorizations',
    'Curated 2026 Swiss Haute Horlogerie catalog with 28+ world brands'
  ]
};

// GET /api/app/version - Check latest app version
router.get('/version', (req, res) => {
  const clientVersion = req.query.current || '1.0.0';
  const hasUpdate = appVersionData.latestVersion !== clientVersion;

  res.status(200).json({
    status: 'success',
    hasUpdate,
    ...appVersionData,
  });
});

// POST /api/app/simulate-update - Admin/Tester toggles a new version release
router.post('/simulate-update', (req, res) => {
  const { newVersion, changelog } = req.body;
  if (newVersion) {
    appVersionData.latestVersion = newVersion;
    appVersionData.versionCode += 1;
    appVersionData.releaseDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  if (changelog && Array.isArray(changelog)) {
    appVersionData.changelog = changelog;
  }

  res.status(200).json({
    status: 'success',
    message: `New version ${appVersionData.latestVersion} published to update server.`,
    data: appVersionData
  });
});

// GET /api/app/download-apk - Trigger direct APK download with Android package mimetype
router.get('/download-apk', (req, res) => {
  const apkPath = path.resolve(__dirname, '../../../client/public/downloads/WatchHub-latest.apk');
  
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="WatchHub-latest.apk"');
    return res.sendFile(apkPath);
  }

  // Fallback to sending a status message if file is being generated
  res.status(200).json({
    status: 'success',
    message: 'WatchHub APK download initiated.',
    apkUrl: '/downloads/WatchHub-latest.apk'
  });
});

export default router;

