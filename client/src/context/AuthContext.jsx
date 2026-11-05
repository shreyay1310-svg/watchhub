import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ROLES = {
  CUSTOMER: 'Customer',
  SUPER_ADMIN: 'Super Admin',
  STORE_ADMIN: 'Store Admin',
  INVENTORY_MANAGER: 'Inventory Manager',
  DELIVERY_MANAGER: 'Delivery Manager',
  CUSTOMER_SUPPORT: 'Customer Support Executive',
};

// Default mock user profiles for development & testing of all 6 roles
export const MOCK_STAFF_ACCOUNTS = {
  [ROLES.SUPER_ADMIN]: {
    id: 'usr_super_admin',
    name: 'Vikramaditya Singhania',
    email: 'superadmin@watchhub.in',
    role: ROLES.SUPER_ADMIN,
    avatar: '👑',
    permissions: ['all'],
  },
  [ROLES.STORE_ADMIN]: {
    id: 'usr_store_admin',
    name: 'Rajesh Mehra',
    email: 'storeadmin@watchhub.in',
    role: ROLES.STORE_ADMIN,
    avatar: '🏪',
    permissions: ['products.manage', 'categories.manage', 'offers.manage', 'orders.manage'],
  },
  [ROLES.INVENTORY_MANAGER]: {
    id: 'usr_inv_mgr',
    name: 'Suresh Patel',
    email: 'inventory@watchhub.in',
    role: ROLES.INVENTORY_MANAGER,
    avatar: '📦',
    permissions: ['inventory.manage', 'stock.adjust', 'warehouses.manage'],
  },
  [ROLES.DELIVERY_MANAGER]: {
    id: 'usr_delivery_mgr',
    name: 'Amit Sharma',
    email: 'delivery@watchhub.in',
    role: ROLES.DELIVERY_MANAGER,
    avatar: '🚚',
    permissions: ['orders.assigned', 'shipments.manage', 'tracking.update'],
  },
  [ROLES.CUSTOMER_SUPPORT]: {
    id: 'usr_support_exec',
    name: 'Neha Kapoor',
    email: 'support@watchhub.in',
    role: ROLES.CUSTOMER_SUPPORT,
    avatar: '🎧',
    permissions: ['tickets.manage', 'refunds.request', 'orders.lookup'],
  },
  [ROLES.CUSTOMER]: {
    id: 'usr_customer_demo',
    name: 'Ananya Singh',
    email: 'ananya@gmail.com',
    role: ROLES.CUSTOMER,
    avatar: '👤',
    permissions: ['orders.own', 'cart.own', 'wishlist.own'],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('watchhub_auth_user');
    return saved ? JSON.parse(saved) : MOCK_STAFF_ACCOUNTS[ROLES.SUPER_ADMIN];
  });
  const [token, setToken] = useState(() => localStorage.getItem('watchhub_token') || 'mock_jwt_token_2026');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('watchhub_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('watchhub_auth_user');
    }
  }, [user]);

  // Login handler
  const login = async (identifier, password, selectedRole = null) => {
    setLoading(true);
    try {
      // Simulate API verification
      await new Promise((res) => setTimeout(res, 800));

      let matchedUser = null;
      if (selectedRole && MOCK_STAFF_ACCOUNTS[selectedRole]) {
        matchedUser = MOCK_STAFF_ACCOUNTS[selectedRole];
      } else {
        // Find by email or fallback to customer
        matchedUser = Object.values(MOCK_STAFF_ACCOUNTS).find(
          (u) => u.email.toLowerCase() === identifier.toLowerCase()
        ) || {
          id: `usr_${Date.now()}`,
          name: identifier.split('@')[0],
          email: identifier,
          role: ROLES.CUSTOMER,
          avatar: '👤',
          permissions: ['orders.own'],
        };
      }

      setUser(matchedUser);
      setToken('mock_jwt_token_val_2026');
      localStorage.setItem('watchhub_token', 'mock_jwt_token_val_2026');
      return { success: true, user: matchedUser };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login handler
  const loginWithGoogle = async (customGoogleUser = null) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      const googleUser = customGoogleUser || {
        id: `usr_google_${Date.now()}`,
        name: 'Ananya Singh',
        email: 'ananya.singh@gmail.com',
        role: ROLES.CUSTOMER,
        avatar: '👤',
        provider: 'Google',
        permissions: ['orders.own', 'cart.own', 'wishlist.own'],
      };
      setUser(googleUser);
      setToken('mock_jwt_google_token_2026');
      localStorage.setItem('watchhub_token', 'mock_jwt_google_token_2026');
      localStorage.setItem('watchhub_auth_user', JSON.stringify(googleUser));
      return { success: true, user: googleUser };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password handler
  const resetPassword = async (email, newPassword) => {
    try {
      await new Promise((res) => setTimeout(res, 400));
      localStorage.setItem(`pwd_${email.toLowerCase()}`, newPassword);
      return { success: true, message: 'Password updated successfully!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Switch role directly (for testing all 6 dashboards seamlessly)
  const switchRole = (roleName) => {
    if (MOCK_STAFF_ACCOUNTS[roleName]) {
      setUser(MOCK_STAFF_ACCOUNTS[roleName]);
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
        token,
        loading,
        login,
        loginWithGoogle,
        resetPassword,
        logout,
        switchRole,
        isAuthenticated: !!user,
        role: user?.role || ROLES.CUSTOMER,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

