import React from 'react';
import CustomerNavbar from '../../components/common/Header';
import { useAppUpdate } from '../../context/AppUpdateContext';
import {
  Smartphone,
  Download,
  RefreshCw,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  QrCode,
  FileCheck,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const MobileAppHubPage = () => {
  const {
    currentVersion,
    latestVersion,
    hasUpdate,
    isChecking,
    checkForUpdates,
    simulateNewVersionRelease,
    downloadAndInstallUpdate,
    apkDownloadUrl,
    fileSize,
  } = useAppUpdate();

  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      <CustomerNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 w-full flex-1 space-y-8">
        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-r from-watch-navy-dark via-watch-navy to-gray-900 p-8 sm:p-12 text-white relative overflow-hidden shadow-luxury-lg border border-watch-gold/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider bg-watch-gold text-watch-navy-dark shadow">
              <Smartphone className="w-3.5 h-3.5" /> OFFICIAL ANDROID APP
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              WatchHub Mobile APK for Android
            </h1>

            <p className="text-sm text-gray-300 leading-relaxed">
              Experience ultra-fast watch shopping, interactive 3D manufacturing hubs, live courier tracking, and instant UPI payments on your mobile phone.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={apkDownloadUrl}
                download="WatchHub-latest.apk"
                className="btn-gold py-3 px-6 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-luxury hover:scale-105 transition-transform"
              >
                <Download className="w-4 h-4" /> Download WatchHub APK ({fileSize})
              </a>

              <button
                onClick={() => checkForUpdates(true)}
                className="py-3 px-5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} /> Check for Updates
              </button>
            </div>

            <div className="flex items-center gap-6 pt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Virus & Malware Free
              </span>
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-watch-gold" /> Version: v{currentVersion} (Latest: v{latestVersion})
              </span>
            </div>
          </div>

          {/* Phone Frame Illustration */}
          <div className="w-64 h-[440px] bg-black rounded-[40px] p-3 shadow-2xl border-4 border-gray-800 flex flex-col relative z-10 flex-shrink-0">
            <div className="w-20 h-4 bg-gray-900 rounded-full mx-auto mb-2"></div>
            <div className="flex-1 bg-watch-navy-dark rounded-[30px] p-4 text-white flex flex-col justify-between overflow-hidden relative border border-watch-gold/20">
              <div className="space-y-1 text-center pt-2">
                <span className="text-2xl">⌚</span>
                <h4 className="font-extrabold text-sm text-watch-gold">WatchHub Mobile</h4>
                <p className="text-[9px] text-gray-400">v{currentVersion} • Premium Horology</p>
              </div>

              {/* In-Phone Mock Alert Card */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-[10px] space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-watch-gold">🚀 OTA In-App Updater</span>
                  <span className="text-emerald-400">Online</span>
                </div>
                <p className="text-gray-300 text-[9px] leading-tight">
                  One-click instant APK upgrades without losing your saved orders or cart.
                </p>
                <button
                  onClick={downloadAndInstallUpdate}
                  className="w-full py-1.5 bg-watch-gold text-watch-navy-dark font-black rounded-lg text-[9.5px] mt-1 shadow"
                >
                  Update App Now (अपडेट करें)
                </button>
              </div>

              <div className="text-center text-[9px] text-gray-500 pb-1">
                Rolex • Omega • Patek • Titan • Casio
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            IN-APP APK AUTO-UPDATE FEATURE SHOWCASE CONSOLE
            ========================================================================= */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                INTEGRATED FEATURE
              </span>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-watch-gold" /> In-App APK Version Update & Auto-Upgrade System
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Whenever a new version of the APK is released, users get an instant in-app update prompt. Clicking "Update" upgrades the mobile app automatically.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => checkForUpdates(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} /> Check For Updates
              </button>
              <button
                onClick={() => simulateNewVersionRelease('1.2.0')}
                className="btn-gold px-4 py-2 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> Simulate New Version Release (v1.2.0)
              </button>
            </div>
          </div>

          {/* 3 Step Interactive Visual Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Automated Version Detection</h4>
              <p className="text-gray-500 leading-relaxed">
                App checks <code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">/api/app/version</code> on startup. If a newer build exists, the luxury update prompt opens immediately.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h4 className="font-bold text-gray-900 text-sm">One-Click In-App Download</h4>
              <p className="text-gray-500 leading-relaxed">
                User taps <strong>"Update App Now"</strong>. A real-time progress bar downloads the APK binary with checksum validation in the background.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Instant Upgrade & Launch</h4>
              <p className="text-gray-500 leading-relaxed">
                Android Package Installer (<code className="bg-gray-200 px-1 py-0.5 rounded text-[10px]">ACTION_VIEW</code> intent) launches instantly, upgrading the app without losing user sessions or cart.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-watch-gold" /> How to Install the WatchHub APK on Your Android Device
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <span className="font-mono text-xs font-bold text-watch-gold">STEP 1</span>
              <h5 className="font-bold text-gray-900">Download APK</h5>
              <p className="text-gray-500 text-[11px]">Click the download button above to save <span className="font-mono">WatchHub-latest.apk</span> to your device.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <span className="font-mono text-xs font-bold text-watch-gold">STEP 2</span>
              <h5 className="font-bold text-gray-900">Allow Installation</h5>
              <p className="text-gray-500 text-[11px]">When prompted, tap <em>Settings</em> and enable <em>"Allow from this source"</em> (standard for direct APKs).</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <span className="font-mono text-xs font-bold text-watch-gold">STEP 3</span>
              <h5 className="font-bold text-gray-900">Tap Install</h5>
              <p className="text-gray-500 text-[11px]">Tap <em>"Install"</em>. The installation completes in under 5 seconds.</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5">
              <span className="font-mono text-xs font-bold text-watch-gold">STEP 4</span>
              <h5 className="font-bold text-gray-900">Open & Enjoy</h5>
              <p className="text-gray-500 text-[11px]">Launch WatchHub from your home screen. Future updates will trigger in-app automatically!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileAppHubPage;

