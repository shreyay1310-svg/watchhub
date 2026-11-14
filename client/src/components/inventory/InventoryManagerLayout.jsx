import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldAlert, RefreshCw, LogOut, ArrowRight, Lock } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import InventoryManagerHeader from './InventoryManagerHeader';
import InventoryManagerSidebar from './InventoryManagerSidebar';

export default function InventoryManagerLayout({
  children,
  activeTab,
  onSelectTab,
  selectedWarehouse,
  onSelectWarehouse,
  onSearch,
  onOpenNotifications,
  onOpenSupport,
}) {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Strict Authentication check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Strict RBAC Role check: Only Inventory Manager or Super Admin
  const isAuthorizedRole =
    user.role === ROLES.INVENTORY_MANAGER ||
    user.role === 'Inventory Manager' ||
    user.role === ROLES.SUPER_ADMIN ||
    user.role === 'Super Admin';

  if (!isAuthorizedRole) {
    return (
      <div className="min-h-screen bg-[#071426] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl border border-gray-100 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#071426] mb-2">
            Inventory Role Authentication Required
          </h2>
          <p className="text-gray-600 text-xs mb-6 leading-relaxed">
            You are currently logged in as <strong className="text-[#071426]">{user.name}</strong> with role{' '}
            <span className="inline-block px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-800">
              {user.role}
            </span>
            . This portal is strictly restricted to <strong className="text-[#D6A63C]">Inventory Managers</strong>.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                switchRole(ROLES.INVENTORY_MANAGER);
                navigate('/inventory-manager/dashboard');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#D6A63C] hover:bg-[#c49532] text-[#071426] font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Verify &amp; Switch to Inventory Manager Role</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (user.role === ROLES.STORE_ADMIN) navigate('/store-admin/dashboard');
                else if (user.role === ROLES.DELIVERY_MANAGER) navigate('/delivery-manager/dashboard');
                else if (user.role === ROLES.CUSTOMER_SUPPORT) navigate('/customer-support/dashboard');
                else navigate('/');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Go to My Authorized Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#071426] flex flex-col font-sans">
      {/* Dedicated Inventory Sidebar */}
      <InventoryManagerSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenSupport={onOpenSupport}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Dedicated Inventory Header */}
        <InventoryManagerHeader
          onToggleSidebar={() => {
            if (window.innerWidth < 1024) {
              setMobileSidebarOpen(!mobileSidebarOpen);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          selectedWarehouse={selectedWarehouse}
          onSelectWarehouse={onSelectWarehouse}
          onSearch={onSearch}
          onOpenNotifications={onOpenNotifications}
          onOpenSupport={onOpenSupport}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
