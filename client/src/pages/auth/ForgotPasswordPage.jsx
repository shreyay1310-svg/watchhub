import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight, AlertTriangle, KeyRound, CheckCircle2 } from 'lucide-react';
import GoldenStarsBackground from '../../components/common/GoldenStarsBackground';
import { safeAuthFetch } from '../../utils/authApiHelper';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('phone'); // 'phone' or 'email'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (method === 'email') {
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
    } else {
      const cleanDigits = phone.replace(/[^0-9]/g, '');
      if (cleanDigits.length < 10) {
        setError('Please enter a valid 10-digit mobile phone number.');
        return;
      }
    }

    setLoading(true);

    try {
      if (method === 'phone') {
        const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
        const result = await safeAuthFetch('/api/auth/forgot-password-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: cleanPhone }),
        });

        if (!result.ok) {
          setError(result.error);
          setLoading(false);
          return;
        }

        navigate(`/reset-password?phone=${encodeURIComponent(cleanPhone)}`);
      } else {
        const result = await safeAuthFetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        if (!result.ok) {
          setError(result.error);
          setLoading(false);
          return;
        }

        navigate(`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }
    } catch {
      setError('An unexpected communication error occurred. Please try again.');
      setLoading(false);
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
            Account Recovery
          </p>
        </div>

        {/* Method Toggle: Phone SMS vs Email */}
        <div className="grid grid-cols-2 p-1 bg-[#111729] rounded-2xl border border-[#252D42] mb-5">
          <button
            type="button"
            onClick={() => { setMethod('phone'); setError(''); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              method === 'phone'
                ? 'bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] shadow-md'
                : 'text-[#A7B1C2] hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Via Phone SMS</span>
          </button>
          <button
            type="button"
            onClick={() => { setMethod('email'); setError(''); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              method === 'email'
                ? 'bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] shadow-md'
                : 'text-[#A7B1C2] hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Via Email</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-[#A7B1C2] text-center leading-relaxed">
            {method === 'phone'
              ? 'Enter your registered 10-digit mobile phone number. We will dispatch a 6-digit OTP code directly via SMS.'
              : 'Enter the email address registered with your WatchHub account. We will dispatch a 6-digit password reset code to your inbox.'}
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {method === 'phone' ? (
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                Registered Mobile Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#00D9E8] pointer-events-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full bg-[#111729] text-white text-xs pl-12 pr-3 py-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8] placeholder:text-[#64748B]"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-[#A7B1C2] block mb-1.5">
                Registered Email Address
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
          )}

          <button
            type="submit"
            disabled={loading || (method === 'phone' ? phone.length < 10 : !email)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00D9E8] via-[#00B4D8] to-[#00D9E8] text-[#070918] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,217,232,0.3)] hover:shadow-[0_0_30px_rgba(0,217,232,0.5)] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Sending Reset Code...</span>
            ) : (
              <>
                <span>Send Reset Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs">
            <Link to="/login" className="text-[#A7B1C2] hover:text-white transition-colors">
              &larr; Return to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
