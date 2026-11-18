import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import OtpInput from '../../components/auth/OtpInput';
import GoldenStarsBackground from '../../components/common/GoldenStarsBackground';

export const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [email, setEmail] = useState(queryParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide the account email address.');
      return;
    }
    if (otp.length !== 6) {
      setError('Please enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 'fail') {
        setError(data.message || 'Failed to reset password. Please check your code.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch {
      setError('Network communication failure. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setError('');

    try {
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'password_reset' }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendCooldown(60);
      } else {
        setError(data.message || 'Failed to resend code.');
      }
    } catch {
      setError('Error contacting email gateway.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070918] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#00D9E8]/30 selection:text-white">
      <GoldenStarsBackground count={40} />

      <div className="w-full max-w-md bg-[#091426]/95 border border-[#252D42] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 mb-3 text-2xl shadow-inner">
            👑
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white font-serif uppercase">
            WATCHHUB
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[3px] text-[#00D9E8] mt-1">
            Set New Password
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white">Password Reset Successful</h2>
            <p className="text-xs text-[#A7B1C2]">
              Your password has been updated and all previous sessions have been invalidated. Redirecting to sign in...
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs shadow-lg"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-[#A7B1C2]">
                Enter the 6-digit code sent to:
              </p>
              <span className="text-xs font-semibold text-[#00D9E8] bg-[#111729] px-3 py-1 rounded-full border border-[#252D42] inline-block mt-1">
                {email || 'your email'}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider block text-center mb-1">
                6-Digit Reset Code
              </label>
              <OtpInput
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={loading}
                error={!!error}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#111729] text-white text-xs pl-9 pr-10 py-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A7B1C2] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || !newPassword}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password &amp; Sign In</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-[#252D42] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Didn't receive code?</span>
              {resendCooldown > 0 ? (
                <span className="text-[#64748B]">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[#00D9E8] font-bold hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
