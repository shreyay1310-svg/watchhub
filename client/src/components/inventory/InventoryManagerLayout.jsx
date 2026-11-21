import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
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
  warehouses = [],
  reorderAlertsCount = 18,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeUser = user || MOCK_STAFF_ACCOUNTS[ROLES.INVENTORY_MANAGER];

  return (
    <div className="min-h-screen bg-[#080923] text-white flex flex-col font-sans relative">
      {/* Dedicated Inventory Sidebar */}
      <InventoryManagerSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenSupport={onOpenSupport}
        reorderAlertsCount={reorderAlertsCount}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sticky Header */}
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
          warehouses={warehouses}
          reorderAlertsCount={reorderAlertsCount}
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
