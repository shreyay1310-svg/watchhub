import React, { useEffect } from 'react';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
import DeliveryManagerSidebar from './DeliveryManagerSidebar';
import DeliveryManagerHeader from './DeliveryManagerHeader';

export const DeliveryManagerLayout = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  onOpenCreateShipment,
  onOpenSupportModal,
  children,
}) => {
  const { user, setUser } = useAuth();

  // Auto-switch to Delivery Manager profile in demo/review mode so visitor never gets locked out
  useEffect(() => {
    if (user?.role !== ROLES.DELIVERY_MANAGER && user?.role !== ROLES.SUPER_ADMIN) {
      const dmAccount = MOCK_STAFF_ACCOUNTS[ROLES.DELIVERY_MANAGER] || {
        id: 'usr_delivery_mgr',
        name: 'Karan Verma',
        email: 'delivery@watchhub.com',
        role: ROLES.DELIVERY_MANAGER,
        avatar: '🚚',
        permissions: ['orders.assigned', 'shipments.manage', 'tracking.update', 'all.delivery'],
      };
      if (setUser) {
        setUser(dmAccount);
      }
    }
  }, [user, setUser]);

  return (
    <div className="min-h-screen bg-[#070918] text-[#FFFFFF] flex flex-col font-sans antialiased selection:bg-[#6500FF]/30 selection:text-white">
      {/* Top Header */}
      <DeliveryManagerHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateShipment={onOpenCreateShipment}
        onOpenSupportModal={onOpenSupportModal}
      />

      {/* Main Workspace with Fixed Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <DeliveryManagerSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#070918] custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DeliveryManagerLayout;
