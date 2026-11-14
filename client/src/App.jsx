import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppUpdateProvider } from './context/AppUpdateContext';
import AppUpdateModal from './components/mobile/AppUpdateModal';
import AppRoutes from './routes/AppRoutes';
import CursorGlow from './components/neon/CursorGlow';
import ParticleBackground from './components/neon/ParticleBackground';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppUpdateProvider>
            {/* Global Futuristic Ambient Canvas */}
            <div className="relative min-h-screen bg-[#050816] text-[#F8FAFC] selection:bg-cyan-500 selection:text-black">
              <ParticleBackground density={30} />
              <CursorGlow />
              <div className="relative z-10">
                <AppRoutes />
              </div>
              <AppUpdateModal />
            </div>
          </AppUpdateProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
