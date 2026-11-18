import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Clock,
  KeyRound,
} from 'lucide-react';
import OtpInput from '../../components/auth/OtpInput';
import GoldenStarsBackground from '../../components/common/GoldenStarsBackground';
import { useAuth } from '../../context/AuthContext';

export const EmailOtpLoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Email Input, 2: 6-digit OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Request Sign-in OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          purpose: 'login',
        }),
      });

      const data = await res.json();

      if (!res.ok && data.status === 'fail') {
        setError(data.message || 'Failed to dispatch sign-in code.');
        setLoading(false);
        return;
      }

      setStep(2);
      setResendCooldown(60);
      setLoading(false);
    } catch {
      setError('Network communication failure. Please try again.');
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Sign in
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === 'fail') {
        setError(data.message || 'Verification failed. Please check your code.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      if (data.accessToken) {
        localStorage.setItem('watchhub_token', data.accessToken);
      }
      if (data.user && setUser) {
        setUser(data.user);
      }

      setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch {
      setError('Authentication failure. Please try again.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');

    try {
      const res = await fetch('/api/auth/resend-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose: 'login' }),
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
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 mb-3 text-2xl shadow-inner">
            👑
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white font-serif uppercase">
            WATCHHUB
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[3px] text-[#00D9E8] mt-1">
            Passwordless Email Sign-In
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white">Authenticated Successfully</h2>
            <p className="text-xs text-[#A7B1C2]">
              Welcome back! Loading your luxury concierge dashboard...
            </p>
          </div>
        ) : step === 1 ? (
          /* Step 1: Email Form */
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <p className="text-xs text-[#A7B1C2] text-center leading-relaxed">
              Enter your registered email address. We will deliver a secure single-use code directly to your inbox.
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@example.com"
                  className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] placeholder:text-[#64748B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#070918] border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching Code...</span>
                </>
              ) : (
                <>
                  <span>Send Sign-In Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs">
              <Link to="/login" className="text-[#A7B1C2] hover:text-white transition-colors">
                Sign in with Password instead &rarr;
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <p className="text-xs text-[#A7B1C2]">Enter the 6-digit code dispatched to:</p>
              <span className="inline-block text-xs font-semibold text-[#00D9E8] bg-[#111729] px-3 py-1 rounded-full border border-[#252D42]">
                {email}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              disabled={loading}
              error={!!error}
            />

            <div className="flex items-center justify-center gap-2 text-xs text-[#A7B1C2]">
              <Clock className="w-3.5 h-3.5 text-[#00D9E8]" />
              <span>Valid for 5 minutes</span>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify &amp; Enter</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-[#252D42] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#A7B1C2] hover:text-white"
              >
                Change Email
              </button>
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

export default EmailOtpLoginPage;
