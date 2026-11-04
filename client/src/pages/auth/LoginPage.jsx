import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import heroCleanCard from '../../assets/images/hero-clean-card.jpg';

export const LoginPage = () => {
  const { login } = useAuth();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account.trim()) {
      setError('Please enter your email or mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);
    const res = await login(account, password, selectedRole);
    setLoading(false);

    if (res.success) {
      if (res.user.role === ROLES.CUSTOMER) {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-watch-navy flex flex-col font-poppins">
      {/* 1. Dark Top Navbar */}
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
        <div className="flex items-center gap-6 text-xs text-white">
          <Link to="/wishlist" className="hover:text-watch-gold">🤍 Wishlist</Link>
          <Link to="/cart" className="hover:text-watch-gold">🛒 Cart</Link>
          <Link to="/dashboard" className="text-watch-gold font-semibold hover:underline">👑 Staff Portal</Link>
        </div>
      </nav>

      {/* 2. Hero Login Area with Reference Visual */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#0a111c]">
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl relative bg-[#0b1320] border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
            {/* Left Promotional Panel */}
            <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between relative z-10 bg-gradient-to-br from-[#0c1524] via-[#09111c] to-[#121926]">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-0.5 bg-watch-gold rounded"></div>
                  <span className="text-xs font-semibold text-watch-gold tracking-wide">Welcome to WatchHub</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-8">
                  Premium Watches <br />
                  <span className="text-gray-100">for Every Style</span>
                </h2>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">100% Original</p>
                      <p className="text-gray-400 text-[11px]">Branded Watches</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Free Delivery</p>
                      <p className="text-gray-400 text-[11px]">on orders above ₹999</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-watch-gold/10 border border-watch-gold/30 flex items-center justify-center text-watch-gold">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Easy Returns</p>
                      <p className="text-gray-400 text-[11px]">Within 7 Days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Role Switcher for instant testing */}
              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1.5 font-bold">
                  ⚡ Quick Demo Role Sign-In:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                  {Object.values(ROLES).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r);
                        setAccount(`${r.toLowerCase().replace(/\s+/g, '')}@watchhub.in`);
                        setPassword('password123');
                      }}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        selectedRole === r
                          ? 'bg-watch-gold text-watch-navy-dark font-bold'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Login Card (Clean White) */}
            <div className="md:col-span-5 bg-white p-8 sm:p-10 flex flex-col justify-center">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Login to <span className="text-watch-gold-dark">WatchHub</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Access your account to shop, track orders, manage wishlist and more.
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="Enter your email or mobile number"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-watch-gold focus:ring-2 focus:ring-watch-gold/20 outline-none text-gray-800 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-300 focus:border-watch-gold focus:ring-2 focus:ring-watch-gold/20 outline-none text-gray-800 text-xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-right mt-1.5">
                    <a href="javascript:void(0)" onClick={() => alert('Password reset link sent to registered email.')} className="text-blue-600 hover:underline text-[11px] font-medium">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="relative my-5 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-3 text-[11px] text-gray-400">or login with</span>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => alert('Redirecting to Google OAuth authentication...')}
                  className="w-full h-10 border border-gray-300 hover:border-gray-400 rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => alert('Redirecting to Facebook authentication...')}
                  className="w-full h-10 border border-gray-300 hover:border-gray-400 rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </button>
              </div>

              <div className="text-center mt-5 text-xs text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-watch-gold font-bold hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

