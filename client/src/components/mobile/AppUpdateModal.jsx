import React from 'react';
import { useAppUpdate } from '../../context/AppUpdateContext';
import {
  Download,
  Sparkles,
  CheckCircle2,
  X,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';

export const AppUpdateModal = () => {
  const {
    showUpdateModal,
    setShowUpdateModal,
    currentVersion,
    latestVersion,
    isDownloading,
    downloadProgress,
    downloadComplete,
    changelog,
    fileSize,
    downloadAndInstallUpdate,
    isApk,
    isManualTrigger,
  } = useAppUpdate();

  // Popup is strictly restricted to Android APK app, or if manually triggered by user on the app download page
  if (!showUpdateModal || (!isApk && !isManualTrigger)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-poppins">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-scale-up">
        {/* Luxury Navy Header Banner */}
        <div className="bg-gradient-to-r from-watch-navy-dark via-watch-navy to-gray-900 p-6 text-white relative overflow-hidden border-b border-watch-gold/20">
          {!isDownloading && (
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-watch-gold/20 border border-watch-gold/40 flex items-center justify-center text-sm shadow">
              🚀
            </span>
            <span className="text-[10px] font-black tracking-widest text-watch-gold uppercase bg-black/40 px-2.5 py-0.5 rounded-full border border-watch-gold/30">
              NEW VERSION RELEASE
            </span>
          </div>

          <h3 className="text-xl font-black text-white leading-tight">
            WatchHub Mobile Update Available
          </h3>
          <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
            <span>Current: <strong className="text-gray-400">v{currentVersion}</strong></span>
            <span>→</span>
            <span>Latest: <strong className="text-watch-gold font-mono text-sm">v{latestVersion}</strong></span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Status & Size Info */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
            <span className="text-gray-600 font-medium flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-watch-navy-dark" /> Android APK Package
            </span>
            <span className="font-mono font-bold text-gray-900">{fileSize}</span>
          </div>

          {/* Changelog Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-watch-gold" /> What's New in v{latestVersion}:
            </h4>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {changelog.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-gray-600 text-[11.5px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Progress State */}
          {isDownloading && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs font-bold text-gray-800">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  Downloading WatchHub v{latestVersion}...
                </span>
                <span className="font-mono text-watch-navy-dark">{downloadProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-watch-navy to-watch-gold h-full rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-400 text-center font-medium">
                Please wait while the update package is verified and downloaded to your phone.
              </p>
            </div>
          )}

          {/* Download Completed Notification */}
          {downloadComplete && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WatchHub-v{latestVersion}.apk Downloaded!
              </p>
              <p className="text-[11px] text-emerald-700">
                Package installer prompt opened. Tap 'Install / Update' to complete the app upgrade.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            {!isDownloading && !downloadComplete ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-xs"
                >
                  Later
                </button>
                <button
                  type="button"
                  onClick={downloadAndInstallUpdate}
                  className="flex-1 btn-gold py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-luxury"
                >
                  <Download className="w-4 h-4" /> Update App Now
                </button>
              </>
            ) : downloadComplete ? (
              <button
                type="button"
                onClick={() => {
                  downloadAndInstallUpdate();
                  setShowUpdateModal(false);
                }}
                className="w-full btn-gold py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-luxury"
              >
                <CheckCircle2 className="w-4 h-4" /> Install & Relaunch App
              </button>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Cryptographic Signature • WatchHub Official
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateModal;

