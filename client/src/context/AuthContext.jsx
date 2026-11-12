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
    email: 'customer@watchhub.com',
    phone: '+91 98765 43210',
    role: ROLES.CUSTOMER,
    avatar: '👤',
    permissions: ['orders.own', 'cart.own', 'wishlist.own'],
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('watchhub_auth_user');
    return saved ? JSON.parse(saved) : MOCK_STAFF_ACCOUNTS[ROLES.CUSTOMER];
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

  // Helper to get registered users from localStorage
  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('watchhub_registered_users');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Helper to save registered user
  const saveRegisteredUser = (userData) => {
    try {
      const all = getRegisteredUsers();
      all[userData.email.toLowerCase()] = userData;
      localStorage.setItem('watchhub_registered_users', JSON.stringify(all));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  };

  // Register new account with role selection (Customer, Admin, Store Manager, etc.)
  const register = async (name, email, password, phone = '', role = ROLES.CUSTOMER) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      
      const roleAvatars = {
        [ROLES.SUPER_ADMIN]: '👑',
        [ROLES.STORE_ADMIN]: '🏪',
        [ROLES.INVENTORY_MANAGER]: '📦',
        [ROLES.DELIVERY_MANAGER]: '🚚',
        [ROLES.CUSTOMER_SUPPORT]: '🎧',
        [ROLES.CUSTOMER]: '👤',
      };

      const rolePermissions = {
        [ROLES.SUPER_ADMIN]: ['all'],
        [ROLES.STORE_ADMIN]: ['products.manage', 'categories.manage', 'offers.manage', 'orders.manage'],
        [ROLES.INVENTORY_MANAGER]: ['inventory.manage', 'stock.adjust', 'warehouses.manage'],
        [ROLES.DELIVERY_MANAGER]: ['orders.assigned', 'shipments.manage', 'tracking.update'],
        [ROLES.CUSTOMER_SUPPORT]: ['tickets.manage', 'refunds.request', 'orders.lookup'],
        [ROLES.CUSTOMER]: ['orders.own', 'cart.own', 'wishlist.own'],
      };

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone.trim(),
        role: role || ROLES.CUSTOMER,
        avatar: roleAvatars[role] || '👤',
        permissions: rolePermissions[role] || ['orders.own', 'cart.own', 'wishlist.own'],
        createdAt: new Date().toISOString(),
      };

      saveRegisteredUser(newUser);
      setUser(newUser);
      setToken('jwt_user_token_' + Date.now());
      localStorage.setItem('watchhub_token', 'jwt_user_token_' + Date.now());
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login handler with credentials verification
  const login = async (identifier, password, selectedRole = null) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      const cleanEmail = (identifier || '').trim().toLowerCase();
      const registered = getRegisteredUsers();

      // 1. Check if user exists in custom registered accounts
      if (registered[cleanEmail]) {
        const regUser = registered[cleanEmail];
        if (regUser.password && regUser.password !== password) {
          // Check if reset password was set
          const savedPwd = localStorage.getItem(`pwd_${cleanEmail}`);
          if (savedPwd && savedPwd === password) {
            // Password matches reset password
          } else {
            return {
              success: false,
              message: 'Incorrect password for this email. Use "Forgot password?" to reset.',
            };
          }
        }
        setUser(regUser);
        setToken('jwt_registered_token_' + Date.now());
        localStorage.setItem('watchhub_token', 'jwt_registered_token_' + Date.now());
        return { success: true, user: regUser };
      }

      // 2. Check if matching Staff Demo role
      let matchedUser = null;
      if (selectedRole && MOCK_STAFF_ACCOUNTS[selectedRole]) {
        matchedUser = { ...MOCK_STAFF_ACCOUNTS[selectedRole] };
        // If email was modified by user
        if (cleanEmail && !cleanEmail.includes(matchedUser.email.toLowerCase())) {
          matchedUser.email = cleanEmail;
          matchedUser.name = cleanEmail.split('@')[0];
        }
      } else {
        // Find staff by email
        matchedUser = Object.values(MOCK_STAFF_ACCOUNTS).find(
          (u) => u.email.toLowerCase() === cleanEmail
        );
      }

      // 3. If still not matched, dynamically create customer profile
      if (!matchedUser) {
        matchedUser = {
          id: `usr_${Date.now()}`,
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: ROLES.CUSTOMER,
          avatar: '👤',
          permissions: ['orders.own', 'cart.own', 'wishlist.own'],
        };
        // Auto-save for next login
        saveRegisteredUser({ ...matchedUser, password });
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
      await new Promise((res) => setTimeout(res, 450));
      const googleUser = customGoogleUser || {
        id: `usr_google_${Date.now()}`,
        name: 'Shreyas Y.',
        email: 'shreyas.watchhub@gmail.com',
        role: ROLES.CUSTOMER,
        avatar: '👤',
        provider: 'Google OAuth 2.0',
        permissions: ['orders.own', 'cart.own', 'wishlist.own'],
      };
      saveRegisteredUser(googleUser);
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

  // Reset password handler (supports email or mobile number)
  const resetPassword = async (identifier, newPassword) => {
    try {
      await new Promise((res) => setTimeout(res, 350));
      const cleanId = (identifier || '').trim().toLowerCase();
      const cleanPhone = cleanId.replace(/[^0-9]/g, '');

      // Store password for this identifier directly
      localStorage.setItem(`pwd_${cleanId}`, newPassword);
      if (cleanPhone.length >= 10) {
        localStorage.setItem(`pwd_${cleanPhone.slice(-10)}`, newPassword);
        localStorage.setItem(`pwd_customer@watchhub.com`, newPassword);
      }

      // Update in registered users database
      const all = getRegisteredUsers();
      let matchedEmail = cleanId;

      if (!cleanId.includes('@') && cleanPhone.length >= 10) {
        for (const [em, u] of Object.entries(all)) {
          const userPhone = (u.phone || '').replace(/[^0-9]/g, '');
          if (userPhone && userPhone.includes(cleanPhone.slice(-10))) {
            matchedEmail = em;
            break;
          }
        }
        if (!all[matchedEmail]) {
          matchedEmail = 'customer@watchhub.com';
        }
      }

      if (all[matchedEmail]) {
        all[matchedEmail].password = newPassword;
      }
      if (all['customer@watchhub.com']) {
        all['customer@watchhub.com'].password = newPassword;
      }
      localStorage.setItem('watchhub_registered_users', JSON.stringify(all));

      return { success: true, email: matchedEmail, message: 'Password updated successfully!' };
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
        register,
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

