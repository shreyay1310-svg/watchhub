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

export function App() {
  return (
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
  );
}

export default App;
