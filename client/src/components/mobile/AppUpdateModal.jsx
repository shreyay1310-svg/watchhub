import React, { useState } from 'react';
import { useAppUpdate } from '../../context/AppUpdateContext';
import {
  Download,
  Sparkles,
  X,
  Smartphone,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const AppUpdateModal = () => {
  const {
    showUpdateModal,
    setShowUpdateModal,
    currentVersion,
    latestVersion,
    minimumVersion,
    forceUpdate,
    releaseDate,
    isDownloading,
    downloadProgress,
    downloadComplete,
    releaseNotes,
    fileSize,
    performUpdate,
    snoozeUpdate,
    isApk,
  } = useAppUpdate();

  const [expandedNotes, setExpandedNotes] = useState(true);

  if (!showUpdateModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans"
      onClick={(e) => {
        // Prevent dismissal if mandatory forceUpdate
        if (!forceUpdate && !isDownloading && e.target === e.currentTarget) {
          snoozeUpdate();
        }
      }}
    >
      <div className="bg-[#0B1324] rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_0_60px_rgba(0,207,255,0.35)] border border-[#00CFFF]/50 flex flex-col relative text-[#F8FAFC]">
        {/* Luxury Navy & Gold Header */}
        <div className="bg-gradient-to-r from-[#040A15] via-[#09152B] to-[#040A15] p-5 sm:p-6 text-white relative border-b border-white/10">
          {!forceUpdate && !isDownloading && (
            <button
              type="button"
              onClick={snoozeUpdate}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-[#00CFFF]/15 border border-[#00CFFF]/40 flex items-center justify-center text-sm shadow">
              {forceUpdate ? '🚨' : '✨'}
            </span>
            <span
              className={`text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                forceUpdate
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-[#00CFFF]/15 text-[#00CFFF] border-[#00CFFF]/40'
              }`}
            >
              {forceUpdate ? 'MANDATORY SECURITY UPDATE' : 'WATCHHUB UPDATE AVAILABLE'}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
            {forceUpdate ? 'Critical System Update Required' : 'A New WatchHub Experience is Ready'}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-300">
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
              <span className="text-gray-400">Current:</span>
              <strong className="text-gray-300 font-mono">v{currentVersion}</strong>
            </div>
            <span className="text-[#00CFFF] font-bold">→</span>
            <div className="flex items-center gap-1.5 bg-[#00CFFF]/15 px-2.5 py-1 rounded-lg border border-[#00CFFF]/40">
              <span className="text-[#00CFFF] font-semibold">New:</span>
              <strong className="text-white font-mono text-sm">v{latestVersion}</strong>
            </div>
            {releaseDate && (
              <span className="text-[11px] text-gray-400 flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3 text-gray-400" /> {releaseDate}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Mandatory Update Warning */}
          {forceUpdate && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-200 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Mandatory Application Upgrade</p>
                <p className="text-[11px] text-rose-300/90 mt-0.5">
                  This release contains essential security protocols, real-time database schema synchronization, and API upgrades. You must update before accessing your account or cart.
                </p>
              </div>
            </div>
          )}

          {/* Release Platform Info */}
          <div className="flex justify-between items-center bg-[#070D1A] p-3 rounded-xl border border-white/5">
            <span className="text-[#A6B1C8] font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#00CFFF]" />
              {isApk ? 'Android Native APK Build' : 'Progressive Web App (PWA) & Service Worker'}
            </span>
            <span className="font-mono font-bold text-[#00CFFF]">
              {isApk ? fileSize : 'Instant Fast Activation'}
            </span>
          </div>

          {/* What's New Accordion */}
          <div className="rounded-xl bg-[#070D1A] border border-white/5 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedNotes(!expandedNotes)}
              className="w-full p-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E7B43F]" /> What's New in v{latestVersion}
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                {expandedNotes ? 'Hide details' : 'View details'}
                {expandedNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {expandedNotes && (
              <div className="p-3 pt-0 border-t border-white/5 space-y-2 max-h-48 overflow-y-auto pr-1">
                {releaseNotes && releaseNotes.length > 0 ? (
                  releaseNotes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#A6B1C8] text-[11.5px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs italic">Performance enhancements and security updates.</p>
                )}
              </div>
            )}
          </div>

          {/* Downloading Progress Indicator */}
          {isDownloading && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold text-[#F8FAFC]">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#00CFFF] animate-spin" />
                  Updating WatchHub to v{latestVersion}...
                </span>
                <span className="font-mono text-[#00CFFF]">{downloadProgress}%</span>
              </div>
              <div className="w-full bg-[#050B15] rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="bg-gradient-to-r from-[#00CFFF] to-[#E7B43F] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              disabled={isDownloading}
              onClick={performUpdate}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00CFFF] to-[#0099FF] text-black font-extrabold text-xs shadow-[0_0_25px_rgba(0,207,255,0.4)] hover:shadow-[0_0_35px_rgba(0,207,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Update Now (v{latestVersion})
                </>
              )}
            </button>

            {!forceUpdate && !isDownloading && (
              <button
                type="button"
                onClick={snoozeUpdate}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
              >
                Remind Me Later
              </button>
            )}

            <button
              type="button"
              onClick={() => setExpandedNotes(!expandedNotes)}
              className="w-full sm:w-auto py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
            >
              What's New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUpdateModal;
