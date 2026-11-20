import React from 'react';
import {
  X,
  KeyRound,
  Smartphone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  forgotStep,
  setForgotStep,
  forgotChannel,
  setForgotChannel,
  forgotError,
  setForgotError,
  forgotSuccess,
  forgotPhone,
  setForgotPhone,
  forgotEmail,
  setForgotEmail,
  handleSendOtp,
  generatedOtp,
  enteredOtp,
  setEnteredOtp,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  resendCooldown,
  handleResetSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-poppins">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-200 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#C4913B] mb-3">
          <KeyRound className="w-5 h-5" />
        </div>

        <h3 className="text-xl font-bold text-gray-900">Reset Your Password</h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          {forgotStep === 1
            ? (forgotChannel === 'phone'
              ? 'Enter customer mobile number to receive an instant verification OTP via SMS.'
              : 'Enter your registered email address to receive an instant verification OTP.')
            : `Enter the 6-digit OTP sent to your ${forgotChannel === 'phone' ? 'mobile number' : 'email'} and choose your new password.`}
        </p>

        {/* Step 1: Channel Switcher (Mobile SMS vs Email) */}
        {forgotStep === 1 && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setForgotChannel('phone');
                setForgotError('');
              }}
              className={`h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                forgotChannel === 'phone'
                  ? 'bg-white text-[#C4913B] shadow-sm font-bold border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile SMS OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setForgotChannel('email');
                setForgotError('');
              }}
              className={`h-9 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                forgotChannel === 'email'
                  ? 'bg-white text-[#C4913B] shadow-sm font-bold border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Address</span>
            </button>
          </div>
        )}

        {forgotError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-xl mb-3 text-center">
            {forgotError}
          </div>
        )}

        {forgotSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2.5 rounded-xl mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{forgotSuccess}</span>
          </div>
        )}

        {forgotStep === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            {forgotChannel === 'phone' ? (
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">Customer Mobile Number</label>
                <div className="flex rounded-xl border border-gray-300 overflow-hidden focus-within:border-[#C4913B] focus-within:ring-2 focus-within:ring-[#C4913B]/20 transition-all">
                  <div className="bg-gray-50 border-r border-gray-300 px-3 flex items-center gap-1.5 text-gray-700 font-semibold text-xs sm:text-sm select-none">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="98765 43210"
                    className="w-full h-11 px-3 text-xs sm:text-sm outline-none font-medium tracking-wide text-gray-900"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> SMS OTP Delivery Ready
                  </span>
                  <span>Default: 9876543210</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@watchhub.com"
                    className="w-full h-11 pl-10 pr-3 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-[#C4913B] outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{forgotChannel === 'phone' ? 'Send OTP to Customer Mobile' : 'Send Verification OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
            {/* Generated OTP Notice with Mobile badge */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/90 p-3 rounded-2xl text-amber-950 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs flex items-center gap-1.5 text-amber-900">
                    {forgotChannel === 'phone' ? (
                      <>
                        <Smartphone className="w-4 h-4 text-[#C4913B]" />
                        <span>OTP sent via SMS to <strong className="text-gray-900">+91 {forgotPhone}</strong></span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 text-[#C4913B]" />
                        <span>OTP sent to <strong className="text-gray-900">{forgotEmail}</strong></span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">Auto-filled for instant verification convenience.</p>
                </div>
                <div className="bg-white border border-amber-200 px-2.5 py-1 rounded-xl text-center shadow-xs">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-bold">OTP</span>
                  <span className="font-mono text-sm font-bold text-[#C4913B] tracking-wider">{generatedOtp}</span>
                </div>
              </div>

              {/* Direct Phone Delivery Links */}
              {forgotChannel === 'phone' && (
                <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center gap-2 flex-wrap">
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${forgotPhone.replace(/[^0-9]/g, '').slice(-10)}&text=${encodeURIComponent(
                      `WatchHub Password Reset OTP: ${generatedOtp}. Valid for 10 minutes. Do not share with anyone.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                  >
                    <span>💬 Receive on WhatsApp</span>
                  </a>
                  <a
                    href={`sms:+91${forgotPhone.replace(/[^0-9]/g, '').slice(-10)}?body=${encodeURIComponent(
                      `Your WatchHub password reset OTP is ${generatedOtp}`
                    )}`}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                  >
                    <span>📲 Open in Messages App</span>
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                placeholder="e.g. 482910"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 font-mono text-center tracking-widest text-base font-bold focus:border-[#C4913B] outline-none bg-gray-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-[#C4913B] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs focus:border-[#C4913B] outline-none"
                required
              />
            </div>

            {/* Resend Link and Channel Info */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <button
                type="button"
                onClick={() => setForgotStep(1)}
                className="text-gray-500 hover:text-gray-800 underline cursor-pointer"
              >
                Change number
              </button>

              {resendCooldown > 0 ? (
                <span className="text-gray-400 font-medium">Resend SMS in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleSendOtp(e)}
                  className="text-[#C4913B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP on Mobile</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#AD7929] hover:from-[#B5822E] hover:to-[#9E6E24] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify OTP & Update Password</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
