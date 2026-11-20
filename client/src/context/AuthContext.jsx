import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const ROLES = {
  CUSTOMER: 'Customer',
  SUPER_ADMIN: 'Super Admin',
  STORE_ADMIN: 'Store Admin',
  INVENTORY_MANAGER: 'Inventory Manager',
  DELIVERY_MANAGER: 'Delivery Manager',
  CUSTOMER_SUPPORT: 'Customer Support Executive',
  DELIVERY_PARTNER: 'Delivery Partner',
};

// Role UI Metadata (Display avatars and labels only; not used for authentication)
export const MOCK_STAFF_ACCOUNTS = {
  [ROLES.SUPER_ADMIN]: { role: ROLES.SUPER_ADMIN, name: 'Super Admin', avatar: '👑' },
  [ROLES.STORE_ADMIN]: { role: ROLES.STORE_ADMIN, name: 'Store Admin', avatar: '🏪' },
  [ROLES.INVENTORY_MANAGER]: { role: ROLES.INVENTORY_MANAGER, name: 'Inventory Manager', avatar: '📦' },
  [ROLES.DELIVERY_MANAGER]: { role: ROLES.DELIVERY_MANAGER, name: 'Delivery Manager', avatar: '🚚' },
  [ROLES.CUSTOMER_SUPPORT]: { role: ROLES.CUSTOMER_SUPPORT, name: 'Customer Support Executive', avatar: '🎧' },
  [ROLES.DELIVERY_PARTNER]: { role: ROLES.DELIVERY_PARTNER, name: 'Delivery Partner', avatar: '🛵' },
  [ROLES.CUSTOMER]: { role: ROLES.CUSTOMER, name: 'Customer', avatar: '👤' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('watchhub_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse saved user from localStorage', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('watchhub_token');
    // Ensure no legacy mock tokens persist in state
    if (savedToken && (savedToken.startsWith('mock_') || savedToken.startsWith('jwt_user_token_'))) {
      localStorage.removeItem('watchhub_token');
      return null;
    }
    return savedToken || null;
  });

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Initial authentication verification against backend /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const savedToken = localStorage.getItem('watchhub_token');
      if (!savedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('watchhub_auth_user');
          setAuthLoading(false);
        }
        return;
      }

      try {
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });

        if (response.data && response.data.status === 'success' && response.data.user) {
          if (isMounted) {
            const verifiedUser = response.data.user;
            setUser(verifiedUser);
            setToken(savedToken);
            localStorage.setItem('watchhub_auth_user', JSON.stringify(verifiedUser));
          }
        } else {
          throw new Error('Invalid authentication response');
        }
      } catch (err) {
        console.warn('[AuthContext] Session verification failed:', err.message);
        if (isMounted) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('watchhub_token');
          localStorage.removeItem('watchhub_auth_user');
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('watchhub_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('watchhub_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('watchhub_token', token);
    } else {
      localStorage.removeItem('watchhub_token');
    }
  }, [token]);

  // Register new account through database API
  const register = async (name, email, password, phone = '', role = ROLES.CUSTOMER) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone.trim(),
        role: role || ROLES.CUSTOMER,
      });

      if (response.data && response.data.status === 'success') {
        const newUser = response.data.user;
        const accessToken = response.data.accessToken;
        setUser(newUser);
        setToken(accessToken);
        setAuthLoading(false);
        localStorage.setItem('watchhub_token', accessToken);
        localStorage.setItem('watchhub_auth_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, message: response.data?.message || 'Registration failed.' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Production authentication: strictly verified by cryptographic backend API
  const login = async (identifier, password, selectedRole = null) => {
    setLoading(true);
    try {
      const cleanEmail = (identifier || '').trim().toLowerCase();
      const response = await api.post('/auth/login', {
        email: cleanEmail,
        password,
        role: selectedRole,
      });

      if (response.data && response.data.status === 'success' && response.data.user) {
        const serverUser = response.data.user;
        const serverToken = response.data.accessToken;

        setUser(serverUser);
        setToken(serverToken);
        setAuthLoading(false);
        localStorage.setItem('watchhub_token', serverToken);
        localStorage.setItem('watchhub_auth_user', JSON.stringify(serverUser));
        return { success: true, user: serverUser };
      }

      return {
        success: false,
        message: response.data?.message || 'Invalid credentials. Please verify your email and password.',
      };
    } catch (apiErr) {
      const message =
        apiErr.response?.data?.message ||
        'Authentication failed. Please verify your email and password.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login handler via API
  const loginWithGoogle = async (customGoogleUser = null) => {
    setLoading(true);
    try {
      if (!customGoogleUser || !customGoogleUser.token) {
        return {
          success: false,
          message: 'Google Sign-In requires an active Google OAuth token from Identity Provider.',
        };
      }
      const response = await api.post('/auth/google', { token: customGoogleUser.token });
      if (response.data && response.data.status === 'success') {
        const googleUser = response.data.user;
        const serverToken = response.data.accessToken;
        setUser(googleUser);
        setToken(serverToken);
        setAuthLoading(false);
        localStorage.setItem('watchhub_token', serverToken);
        localStorage.setItem('watchhub_auth_user', JSON.stringify(googleUser));
        return { success: true, user: googleUser };
      }
      return { success: false, message: response.data?.message || 'Google authentication failed.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Google authentication service unreachable.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Reset password handler via API
  const resetPassword = async (identifier, newPassword) => {
    try {
      const cleanId = (identifier || '').trim().toLowerCase();
      const response = await api.post('/auth/reset-password', {
        email: cleanId,
        newPassword,
      });
      if (response.data && response.data.status === 'success') {
        return { success: true, message: 'Password updated successfully. Please log in.' };
      }
      return { success: false, message: response.data?.message || 'Failed to update password.' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update password.',
      };
    }
  };

  // Switch role handler: restricted to active session role delegation
  const switchRole = (roleName) => {
    if (user && (user.role === ROLES.SUPER_ADMIN || user.role === roleName)) {
      const updatedUser = { ...user, activeRole: roleName };
      setUser(updatedUser);
      localStorage.setItem('watchhub_auth_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('watchhub_token');
    localStorage.removeItem('watchhub_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        loading,
        authLoading,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        switchRole,
        isAuthenticated: !!user && !!token && !authLoading,
        role: user?.activeRole || user?.role || ROLES.CUSTOMER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
