import React, { useState } from 'react';
import SuperAdminNavbar from './SuperAdminNavbar';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminGlobalSearch from './SuperAdminGlobalSearch';

export default function SuperAdminLayout({
  user,
  onLogout,
  activeTab,
  setActiveTab,
  children,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070B17] text-[#F8FAFC] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Header Navbar */}
      <SuperAdminNavbar
        user={user}
        onLogout={onLogout}
        onOpenSearch={() => setSearchOpen(true)}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Sidebar */}
        <SuperAdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onLogout={onLogout}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global Search Modal (Ctrl + K) */}
      <SuperAdminGlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
