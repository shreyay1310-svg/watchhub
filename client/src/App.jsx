import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppUpdateProvider } from './context/AppUpdateContext';
import { CurrencyLanguageProvider } from './context/CurrencyLanguageContext';
import AppUpdateModal from './components/mobile/AppUpdateModal';
import AppRoutes from './routes/AppRoutes';
import CursorGlow from './components/neon/CursorGlow';
import ParticleBackground from './components/neon/ParticleBackground';

// Top-level Error Boundary to eliminate any possibility of a raw blank screen
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[Global App Error Boundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070918] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#11172C] border border-[#28334B] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center text-2xl font-bold">
              ⌚
            </div>
            <h1 className="text-xl font-bold font-serif">WatchHub Portal Recovery</h1>
            <p className="text-xs text-[#A7B1C2]">
              {this.state.error?.message || 'A temporary rendering buffer issue occurred.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#6500FF]/30 cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-[#28334B] cursor-pointer"
              >
                Go to Storefront
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
        <AuthProvider>
          <CartProvider>
            <CurrencyLanguageProvider>
              <AppUpdateProvider>
                {/* Cinematic Swiss Luxury Dark Canvas */}
                <div className="relative min-h-screen bg-[#020813] text-[#F8FAFC] selection:bg-[#F4B942] selection:text-black font-sans">
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
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}

export default App;
