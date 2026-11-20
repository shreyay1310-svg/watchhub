import React from 'react';
import { Search, Download } from 'lucide-react';

export default function InventorySearchFilterBar({
  tableSearch,
  setTableSearch,
  setCurrentPage,
  filterCategory,
  setFilterCategory,
  filterBrand,
  setFilterBrand,
  filterWarehouse,
  setFilterWarehouse,
  filterStatus,
  setFilterStatus,
  handleResetFilters,
  handleExportCSV,
}) {
  return (
    <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={tableSearch}
          onChange={(e) => {
            setTableSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by Product Name, SKU or Brand..."
          className="w-full bg-[#050816] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400"
        />
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-gray-200 focus:outline-hidden cursor-pointer"
        >
          <option value="All">Category (All)</option>
          <option value="Luxury">Luxury</option>
          <option value="Men's">Men's</option>
          <option value="Women's">Women's</option>
          <option value="Sports">Sports</option>
          <option value="Smartwatches">Smartwatches</option>
        </select>

        {/* Brand Dropdown */}
        <select
          value={filterBrand}
          onChange={(e) => {
            setFilterBrand(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-gray-200 focus:outline-hidden cursor-pointer"
        >
          <option value="All">Brand (All)</option>
          <option value="Rolex">Rolex</option>
          <option value="Omega">Omega</option>
          <option value="Cartier">Cartier</option>
          <option value="Patek Philippe">Patek Philippe</option>
          <option value="Apple">Apple</option>
        </select>

        {/* Warehouse Dropdown */}
        <select
          value={filterWarehouse}
          onChange={(e) => {
            setFilterWarehouse(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-gray-200 focus:outline-hidden cursor-pointer"
        >
          <option value="All">Warehouse (All)</option>
          <option value="Main">Main Warehouse</option>
          <option value="Delhi">Delhi Warehouse</option>
          <option value="Mumbai">Mumbai Warehouse</option>
        </select>

        {/* Stock Status Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-xs font-semibold text-gray-200 focus:outline-hidden cursor-pointer"
        >
          <option value="All">Stock Status (All)</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        {/* Reset Filters Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/10 font-semibold transition-colors cursor-pointer"
          title="Reset Filters"
        >
          Reset
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:opacity-95 font-black shadow-neon-cyan transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
