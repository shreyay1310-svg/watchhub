import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppUpdateProvider } from './context/AppUpdateContext';
import { CurrencyLanguageProvider } from './context/CurrencyLanguageContext';
import { NetworkStatusProvider } from './context/NetworkStatusContext';
import AppUpdateModal from './components/mobile/AppUpdateModal';
import AppRoutes from './routes/AppRoutes';
import CursorGlow from './components/neon/CursorGlow';
import ParticleBackground from './components/neon/ParticleBackground';

// Top-level Error Boundary to eliminate any possibility of an untrapped crash
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Sanitize technical diagnostics (do not log sensitive tokens/passwords)
    console.error('[Global App Error Boundary]', error?.message || error, info?.componentStack);
  }

  getRoleDashboardPath() {
    try {
      const saved = localStorage.getItem('watchhub_auth_user');
      if (!saved) return '/';
      const user = JSON.parse(saved);
      const norm = (user.role || '').trim().toLowerCase();
      if (norm.includes('super admin')) return '/super-admin/dashboard';
      if (norm.includes('store admin')) return '/store-admin/dashboard';
      if (norm.includes('inventory')) return '/inventory-manager/dashboard';
      if (norm.includes('delivery manager')) return '/delivery-manager/dashboard';
      if (norm.includes('partner') || norm.includes('rider')) return '/delivery-partner/dashboard';
      if (norm.includes('support')) return '/customer-support/dashboard';
      return '/customer/dashboard';
    } catch {
      return '/';
    }
  }

  render() {
    if (this.state.hasError) {
      const targetDashboard = this.getRoleDashboardPath();
      const isStaffRole = targetDashboard !== '/' && targetDashboard !== '/customer/dashboard';

      return (
        <div className="min-h-screen bg-[#070918] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#11172C] border border-[#28334B] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center text-2xl font-bold">
              ⌚
            </div>
            <h1 className="text-xl font-bold font-serif">WatchHub Portal Recovery</h1>
            <p className="text-xs text-[#A7B1C2] leading-relaxed">
              {this.state.error?.message || 'A temporary rendering buffer issue occurred.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#6500FF]/30 cursor-pointer hover:brightness-110"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = targetDashboard;
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-[#28334B] cursor-pointer"
              >
                {isStaffRole ? 'Return to Dashboard' : 'Go to Storefront'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <NetworkStatusProvider>
          <AuthProvider>
            <CartProvider>
              <CurrencyLanguageProvider>
                <AppUpdateProvider>
                  {/* Cinematic Swiss Luxury Dark Canvas */}
                  <div className="relative min-h-screen bg-[#020813] text-[#F8FAFC] selection:bg-[#F4B942] selection:text-black font-sans overflow-x-hidden">
                    <ParticleBackground density={20} />
                    <CursorGlow />
                    <div className="relative z-10">
                      <AppRoutes />
                    </div>
                    <AppUpdateModal />
                  </div>
                </AppUpdateProvider>
              </CurrencyLanguageProvider>
            </CartProvider>
          </AuthProvider>
        </NetworkStatusProvider>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}

export default App;
