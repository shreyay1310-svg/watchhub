import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import OtpInput from '../../components/auth/OtpInput';
import GoldenStarsBackground from '../../components/common/GoldenStarsBackground';
import { useAuth } from '../../context/AuthContext';

export const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Retrieve state passed from registration or query params
  const stateData = location.state || {};
  const queryParams = new URLSearchParams(location.search);

  const email = stateData.email || queryParams.get('email') || '';
  const name = stateData.name || '';
  const phone = stateData.phone || '';
  const password = stateData.password || '';
  const purpose = stateData.purpose || queryParams.get('purpose') || 'registration';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [resendMessage, setResendMessage] = useState('');

  // 60-second cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          purpose,
          name,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'fail') {
        setError(data.message || 'Verification failed. Please check your code.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      if (data.user) {
        if (data.accessToken) {
          localStorage.setItem('watchhub_token', data.accessToken);
        }
        if (setUser) setUser(data.user);
      }

      // Auto-redirect to homepage or account after 2 seconds
      setTimeout(() => {
        navigate(purpose === 'login' ? '/account' : '/');
      }, 2200);
    } catch (err) {
      setError('Network communication error. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setResendMessage('');

    try {
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();

      if (!res.ok || data.status === 'fail') {
        setError(data.message || 'Failed to resend verification code.');
        return;
      }

      setResendCooldown(60);
      setResendMessage('A fresh verification code has been dispatched to your email.');
      setTimeout(() => setResendMessage(''), 5000);
    } catch {
      setError('Failed to contact email gateway. Please try again.');
    }
  };

  // Auto-submit when user enters all 6 digits
  useEffect(() => {
    if (otp.length === 6 && !loading && !success) {
      handleVerify();
    }
  }, [otp]);

  return (
    <div className="min-h-screen bg-[#070918] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#00D9E8]/30 selection:text-white">
      <GoldenStarsBackground count={40} />

      {/* Decorative luxury ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9E8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E7B43F]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#091426]/95 border border-[#252D42] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 mb-3 text-2xl shadow-inner">
            👑
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white font-serif uppercase">
            WATCHHUB
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[3px] text-[#00D9E8] mt-1">
            Email OTP Verification
          </p>
        </div>

        {/* Verification Success State */}
        {success ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] flex items-center justify-center mx-auto text-3xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Email Verified Successfully</h2>
              <p className="text-xs text-[#A7B1C2] mt-1.5 leading-relaxed">
                Welcome to WatchHub! Your account is now active. Redirecting you to your concierge portal...
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs shadow-lg hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all"
              >
                <span>Continue to WatchHub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* OTP Input Form */
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="text-center space-y-1">
              <p className="text-xs text-[#A7B1C2]">
                We have dispatched a 6-digit verification code to:
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111729] border border-[#252D42] text-xs font-semibold text-[#00D9E8]">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate max-w-[220px]">{email || 'your email'}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2 animate-in fade-in duration-150">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Resend Message */}
            {resendMessage && (
              <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{resendMessage}</span>
              </div>
            )}

            {/* 6-Digit Split Inputs */}
            <div>
              <label className="text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider block text-center mb-1">
                Enter 6-Digit Code
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={loading}
                error={!!error}
              />
            </div>

            {/* Expiry Banner */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#A7B1C2]">
              <Clock className="w-3.5 h-3.5 text-[#00D9E8]" />
              <span>Valid for 5 minutes &bull; Single-use security</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#070918] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Email &amp; Activate</span>
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="pt-2 border-t border-[#252D42] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Didn't receive the email?</span>
              {resendCooldown > 0 ? (
                <span className="text-[#A7B1C2] font-mono">
                  Resend in <span className="text-[#00D9E8] font-bold">{resendCooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#00D9E8] hover:text-[#00B4D8] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend Code</span>
                </button>
              )}
            </div>

            {/* Return Link */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-[#A7B1C2] hover:text-white transition-colors"
              >
                &larr; Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
