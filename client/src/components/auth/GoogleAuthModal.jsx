import React from 'react';
import { X, RefreshCw, UserPlus, CheckCircle2, Plus, ShieldCheck } from 'lucide-react';

export default function GoogleAuthModal({
  isOpen,
  onClose,
  googleLoading,
  googleAccounts = [],
  handleGoogleSelect,
  showAddGoogleAccount,
  setShowAddGoogleAccount,
  googleAddError,
  setGoogleAddError,
  newGoogleName,
  setNewGoogleName,
  newGoogleEmail,
  setNewGoogleEmail,
  handleAddNewGoogleAccount,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-poppins">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Brand Header */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h4 className="font-bold text-gray-900 text-base">Sign in with Google</h4>
        </div>
        <p className="text-xs text-gray-500 mb-4">Choose an account to link with WatchHub</p>

        {googleLoading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#4285F4] animate-spin" />
            <span className="text-xs font-semibold text-gray-700">Linking Google Account...</span>
            <span className="text-[11px] text-gray-400">Verifying secure OAuth credentials</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* List of Connected Google Accounts */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
              {googleAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleGoogleSelect(acc.name, acc.email)}
                  className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border border-gray-200/90 hover:bg-[#F8FAFD] hover:border-[#4285F4]/50 transition-all text-left cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0"
                      style={{ backgroundColor: acc.avatarBg || '#4285F4' }}
                    >
                      {acc.initial || acc.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate group-hover:text-[#1a73e8] transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">{acc.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-100 group-hover:bg-[#E8F0FE] group-hover:text-[#1967D2] px-2 py-0.5 rounded-full font-medium transition-colors flex-shrink-0 ml-2">
                    {acc.badge || 'Google'}
                  </span>
                </button>
              ))}
            </div>

            {/* Add/Link Another Google Account Form */}
            {showAddGoogleAccount ? (
              <form onSubmit={handleAddNewGoogleAccount} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/90 space-y-2.5 text-xs animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 text-[11px] flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-[#4285F4]" />
                    Link Another Google Account
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddGoogleAccount(false);
                      setGoogleAddError('');
                    }}
                    className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {googleAddError && (
                  <p className="text-[11px] text-rose-600 bg-rose-50 p-1.5 rounded-lg border border-rose-200">{googleAddError}</p>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={newGoogleName}
                    onChange={(e) => setNewGoogleName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full h-9 px-3 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#4285F4] bg-white"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Google Email Address</label>
                  <input
                    type="email"
                    value={newGoogleEmail}
                    onChange={(e) => setNewGoogleEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full h-9 px-3 rounded-xl border border-gray-300 text-xs outline-none focus:border-[#4285F4] bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-9 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-semibold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Link & Continue with this Account</span>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddGoogleAccount(true)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-dashed border-gray-300 hover:border-[#4285F4] hover:bg-blue-50/40 text-gray-700 transition-all text-left text-xs font-medium cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Use another Google account</p>
                  <p className="text-[10.5px] text-gray-500">Link your personal Gmail or Google Workspace</p>
                </div>
              </button>
            )}

            {/* Footer security notes */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Google OAuth 2.0 Verified
              </span>
              <a
                href="https://accounts.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4285F4] hover:underline"
              >
                accounts.google.com
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
