import React, { useState, useEffect } from 'react';
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
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on Escape key & lock body scroll
  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-[#070918] text-[#FFFFFF] flex flex-col font-sans antialiased selection:bg-[#00D9E8]/30 selection:text-white relative">
      {/* Top Header */}
      <CustomerSupportHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateTicket={onOpenCreateTicket}
        onOpenQuickChat={onOpenQuickChat}
      />

      {/* Main Workspace with Responsive Sidebar */}
      <div className="flex-1 flex min-h-[calc(100vh-64px)] relative">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/75 z-40 lg:hidden backdrop-blur-xs transition-opacity cursor-pointer"
            aria-label="Close navigation drawer"
          />
        )}

        {/* Left Sidebar */}
        <CustomerSupportSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (setActiveTab) setActiveTab(tab);
            setMobileSidebarOpen(false);
          }}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 lg:p-8 space-y-6 bg-[#070918] custom-scrollbar overflow-x-hidden min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerSupportLayout;
