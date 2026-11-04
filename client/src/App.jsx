import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppUpdateProvider } from './context/AppUpdateContext';
import AppUpdateModal from './components/mobile/AppUpdateModal';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppUpdateProvider>
            <AppRoutes />
            <AppUpdateModal />
          </AppUpdateProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

