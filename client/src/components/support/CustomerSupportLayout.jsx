import React, { useEffect } from 'react';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
import CustomerSupportSidebar from './CustomerSupportSidebar';
import CustomerSupportHeader from './CustomerSupportHeader';

export const CustomerSupportLayout = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  searchQuery,
  setSearchQuery,
  onOpenCreateTicket,
  onOpenQuickChat,
  children,
}) => {
  const { user, setUser, switchRole } = useAuth();

  // Auto-switch to Customer Support profile in demo/review mode so visitor never gets locked out
  useEffect(() => {
    if (
      user?.role !== ROLES.CUSTOMER_SUPPORT &&
      user?.role !== 'Customer Support Executive' &&
      user?.role !== 'Customer Support Manager' &&
      user?.role !== ROLES.SUPER_ADMIN &&
      user?.role !== 'Super Admin'
    ) {
      if (switchRole) {
        switchRole(ROLES.CUSTOMER_SUPPORT);
      } else if (setUser) {
        const supportAccount = MOCK_STAFF_ACCOUNTS[ROLES.CUSTOMER_SUPPORT] || {
          id: 'usr_support_exec',
          name: 'Pooja Sharma',
          email: 'support@watchhub.com',
          role: ROLES.CUSTOMER_SUPPORT,
          avatar: '🎧',
          permissions: ['tickets.manage', 'refunds.request', 'orders.lookup', 'all.support'],
        };
        setUser(supportAccount);
      }
    }
  }, [user, setUser, switchRole]);

  return (
    <div className="min-h-screen bg-[#070918] text-[#FFFFFF] flex flex-col font-sans antialiased selection:bg-[#00D9E8]/30 selection:text-white">
      {/* Top Header */}
      <CustomerSupportHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateTicket={onOpenCreateTicket}
        onOpenQuickChat={onOpenQuickChat}
      />

      {/* Main Workspace with Fixed Sidebar */}
      <div className="flex-1 flex min-h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <CustomerSupportSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 bg-[#070918] custom-scrollbar overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerSupportLayout;
