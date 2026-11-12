import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, Gift, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms & Privacy Policy.');
      return;
    }

    setError('');
    setLoading(true);
    const res = await register(name, email, password, phone);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-screen bg-watch-navy flex flex-col font-poppins">
      <nav className="h-16 px-6 sm:px-12 bg-watch-navy-dark border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-watch-gold flex items-center justify-center text-lg border border-watch-gold/40 shadow">
            ⌚
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white leading-none">
              Watch<span className="text-watch-gold">Hub</span>
            </h1>
            <p className="text-[9px] text-gray-400 mt-0.5">Premium Watches for Every Style</p>
          </div>
        </Link>
        <Link to="/login" className="text-xs text-watch-gold font-semibold hover:underline">
          Already have an account? Login
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#0a111c]">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-[#0b1320] border border-white/5 grid grid-cols-1 md:grid-cols-12">
          {/* Left Panel */}
          <div className="md:col-span-5 p-8 flex flex-col justify-between bg-gradient-to-br from-[#0c1524] to-[#121926] text-white">
            <div>
              <span className="text-xs font-bold text-watch-gold tracking-widest uppercase block mb-1">
                Join WatchHub VIP
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-6">
                Create Your <br />
                <span className="text-watch-gold">Member Account</span>
              </h2>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 text-watch-gold flex-shrink-0" />
                  <span>Flat 15% Welcome Discount on your first order</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-watch-gold flex-shrink-0" />
                  <span>Priority Free Express Shipping across India</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-watch-gold flex-shrink-0" />
                  <span>Complimentary 2-Year Extended Protection Plan</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 text-xs text-gray-400">
              Trusted by 50,000+ watch enthusiasts in India.
            </div>
          </div>

          {/* Right Signup Form */}
          <div className="md:col-span-7 bg-white p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-1">Create Account</h3>
            <p className="text-xs text-gray-500 mb-5">Fill in your information below to register.</p>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Singh"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-300 focus:border-watch-gold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-300 focus:border-watch-gold outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-300 focus:border-watch-gold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 chars"
                      className="w-full h-10 pl-9 pr-8 rounded-lg border border-gray-300 focus:border-watch-gold outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-300 focus:border-watch-gold outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-watch-gold"
                />
                <span className="text-gray-600 text-[11px]">
                  I agree to the <a href="javascript:void(0)" className="text-watch-gold font-bold hover:underline">Terms of Service</a> & <a href="javascript:void(0)" className="text-watch-gold font-bold hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 btn-gold text-xs shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Create VIP Account'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;

