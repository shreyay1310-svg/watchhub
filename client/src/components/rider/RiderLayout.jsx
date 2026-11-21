import React, { useState, useEffect } from 'react';
import RiderHeader from './RiderHeader';
import RiderSidebar from './RiderSidebar';

export const RiderLayout = ({
  activeTab = 'dashboard',
  setActiveTab,
  isOnDuty = true,
  setIsOnDuty,
  searchQuery = '',
  setSearchQuery,
  assignedCount = 4,
  children,
}) => {
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
    <div className="min-h-screen bg-[#050816] text-[#FFFFFF] flex flex-col font-sans antialiased selection:bg-[#00F2FE]/30 selection:text-white relative">
      {/* Top Rider Header */}
      <RiderHeader
        isOnDuty={isOnDuty}
        setIsOnDuty={setIsOnDuty}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace with Responsive Sidebar */}
      <div className="flex-1 flex min-h-[calc(100vh-64px)] relative">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 z-20 lg:hidden backdrop-blur-xs transition-opacity cursor-pointer"
            aria-label="Close navigation drawer"
          />
        )}

        {/* Left Rider Sidebar */}
        <RiderSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          assignedCount={assignedCount}
        />

        {/* Scrollable Content Viewport */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 space-y-6 bg-[#050816] custom-scrollbar overflow-x-hidden min-w-0 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RiderLayout;
