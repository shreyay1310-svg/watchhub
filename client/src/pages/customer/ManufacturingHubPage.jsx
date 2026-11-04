import React from 'react';
import CustomerNavbar from '../../components/common/Header';
import ManufacturingHubModule from '../../components/dashboards/modules/ManufacturingHubModule';

export const ManufacturingHubPage = () => {
  return (
    <div className="min-h-screen bg-watch-light flex flex-col font-poppins">
      <CustomerNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1">
        <ManufacturingHubModule />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 text-xs text-gray-500 text-center">
        <span>WatchHub Global Horological Intelligence & Manufacturing Network • v2.4</span>
      </footer>
    </div>
  );
};

export default ManufacturingHubPage;

