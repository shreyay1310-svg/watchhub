import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Palette, CircleDot, Plus, Minus, Check } from 'lucide-react';
import {
  DIY_BEADS_CATALOG,
  DIY_ACCESSORIES_CATALOG,
  DIY_COLORS_PALETTE,
  WATCH_BASES,
} from '../../data/diyCustomizerData';

const BEAD_CATEGORIES = [
  'All Beads',
  'Gemstone Beads',
  'Crystal Beads',
  'Natural Stone',
  'Pearl Beads',
  'Metal Beads',
];

export const DiyCataloguePanel = ({
  config,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState('beads'); // 'beads' | 'accessories' | 'colors' | 'watches'
  const [selectedSubCategory, setSelectedSubCategory] = useState('All Beads');
  const [searchQuery, setSearchQuery] = useState('');

  const activeBand = config.activeBandTab === 1 ? config.band1 : config.band2;
  const activeBandKey = config.activeBandTab === 1 ? 'band1' : 'band2';

  // Filter beads
  const filteredBeads = useMemo(() => {
    return DIY_BEADS_CATALOG.filter((bead) => {
      const matchesCategory =
        selectedSubCategory === 'All Beads' || bead.category === selectedSubCategory;
      const matchesSearch =
        searchQuery === '' ||
        bead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bead.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedSubCategory, searchQuery]);

  // Filter accessories
  const filteredAccessories = useMemo(() => {
    return DIY_ACCESSORIES_CATALOG.filter((acc) => {
      return (
        searchQuery === '' ||
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  // Select a bead for the active band
  const handleSelectBead = (bead) => {
    onChange({
      ...config,
      [activeBandKey]: {
        ...activeBand,
        primaryBead: bead,
      },
    });
  };

  // Change bead size
  const handleBeadSizeChange = (beadId, sizeMm) => {
    // Recalculate bead count: (wrist in mm - watch body gap ~40mm) / sizeMm
    const availableLengthMm = Math.max(80, config.wristSizeCm * 10 - 40);
    const newCount = Math.round(availableLengthMm / sizeMm);

    onChange({
      ...config,
      [activeBandKey]: {
        ...activeBand,
        beadSize: sizeMm,
        beadsCount: newCount,
      },
    });
  };

  // Adjust bead quantity
  const handleBeadQtyChange = (delta) => {
    const current = activeBand.beadsCount || 15;
    const updated = Math.min(30, Math.max(8, current + delta));
    onChange({
      ...config,
      [activeBandKey]: {
        ...activeBand,
        beadsCount: updated,
      },
    });
  };

  // Adjust accessory quantity
  const handleAccessoryQtyChange = (accId, delta) => {
    const currentList = [...(activeBand.accessories || [])];
    const existingIndex = currentList.findIndex((a) => a.id === accId);

    if (existingIndex > -1) {
      const newCount = currentList[existingIndex].count + delta;
      if (newCount <= 0) {
        currentList.splice(existingIndex, 1);
      } else {
        currentList[existingIndex] = { ...currentList[existingIndex], count: newCount };
      }
    } else if (delta > 0) {
      currentList.push({ id: accId, count: delta });
    }

    onChange({
      ...config,
      [activeBandKey]: {
        ...activeBand,
        accessories: currentList,
      },
    });
  };

  // Change watch base
  const handleSelectWatchBase = (base) => {
    onChange({
      ...config,
      watchBase: base,
    });
  };

  // Change palette color
  const handleSelectColor = (color) => {
    onChange({
      ...config,
      selectedColor: color,
    });
  };

  return (
    <div className="w-full rounded-2xl bg-[#0B1026]/90 backdrop-blur-xl border border-purple-500/20 shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-4 md:p-6">
      {/* Top Nav: Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        {/* Main Tabs matching Gemloo: [ Beads ] [ ✨ Accessories ] [ 🎨 Colors ] [ ⌚ Watch Base ] */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('beads')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'beads'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#050816] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            <CircleDot className="w-4 h-4 text-purple-300" />
            <span>Beads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accessories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'accessories'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#050816] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Accessories</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'colors'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#050816] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            <Palette className="w-4 h-4 text-cyan-300" />
            <span>Colors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('watches')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300 ${
              activeTab === 'watches'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'bg-[#050816] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
            }`}
          >
            <span>⌚ Watch Base</span>
          </button>
        </div>

        {/* Search Bar matching "Search beads, charms, spacers..." */}
        <div className="relative min-w-[240px] md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search beads, charms, spacers..."
            className="w-full bg-[#050816] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area: Subcategory Sidebar + Product Cards */}
      <div className="flex flex-col lg:flex-row gap-5 pt-4">
        {/* Left Subcategory Pills (when in Beads tab) */}
        {activeTab === 'beads' && (
          <div className="lg:w-44 shrink-0 flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {BEAD_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left whitespace-nowrap transition-all duration-200 ${
                  selectedSubCategory === cat
                    ? 'bg-purple-600/30 text-white border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Catalogue Cards */}
        <div className="flex-1">
          {/* TAB 1: BEADS */}
          {activeTab === 'beads' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {filteredBeads.map((bead) => {
                const isSelected = activeBand.primaryBead?.id === bead.id;
                const currentSize = isSelected ? activeBand.beadSize || 8 : bead.defaultSize;
                const currentQty = isSelected ? activeBand.beadsCount || 15 : 15;

                return (
                  <div
                    key={bead.id}
                    className={`relative rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 border ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#141A3D] to-[#0A0F26] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                        : 'bg-[#050816]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    {/* 3D Gemstone Sphere Visual */}
                    <div
                      onClick={() => handleSelectBead(bead)}
                      className="cursor-pointer w-full py-2 flex items-center justify-center group"
                    >
                      <div
                        className="w-16 h-16 rounded-full transition-transform duration-300 group-hover:scale-110 relative"
                        style={{
                          background: bead.gradient || bead.imageColor,
                          boxShadow: '0 8px 18px rgba(0,0,0,0.6), inset -3px -3px 8px rgba(0,0,0,0.5), inset 3px 3px 6px rgba(255,255,255,0.6)',
                        }}
                      >
                        {/* 3D Specular Highlight */}
                        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white/60 blur-[1px]" />
                      </div>
                    </div>

                    {/* Bead Title */}
                    <div className="text-center mt-1">
                      <div className="text-xs font-bold text-white tracking-wide truncate">
                        {bead.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {bead.category}
                      </div>
                    </div>

                    {/* Size Selector Pills: 6mm | 8mm | 10mm | 12mm */}
                    <div className="grid grid-cols-4 gap-1 my-2">
                      {bead.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            if (!isSelected) handleSelectBead(bead);
                            handleBeadSizeChange(bead.id, s);
                          }}
                          className={`py-1 text-[9px] font-mono rounded transition-colors ${
                            currentSize === s && isSelected
                              ? 'bg-purple-600 text-white font-bold'
                              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {s}mm
                        </button>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="text-center font-mono text-xs font-bold text-champagne-gold text-[#F4B942] mb-2">
                      ₹{bead.basePrice} <span className="text-[10px] font-normal text-slate-400">/ bead</span>
                    </div>

                    {/* Action Button: Stepper or "+ Add" */}
                    {isSelected ? (
                      <div className="flex items-center justify-between bg-black/40 rounded-xl border border-purple-500/40 p-1">
                        <button
                          type="button"
                          onClick={() => handleBeadQtyChange(-1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1">
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleBeadQtyChange(1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectBead(bead)}
                        className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: ACCESSORIES */}
          {activeTab === 'accessories' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredAccessories.map((acc) => {
                const existing = (activeBand.accessories || []).find((a) => a.id === acc.id);
                const count = existing ? existing.count : 0;

                return (
                  <div
                    key={acc.id}
                    className={`rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 border ${
                      count > 0
                        ? 'bg-gradient-to-b from-[#141A3D] to-[#0A0F26] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                        : 'bg-[#050816]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Visual */}
                    <div className="w-full py-3 flex items-center justify-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl relative shadow-lg"
                        style={{
                          background: acc.gradient || '#2A1F1D',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                        }}
                      >
                        <span>{acc.icon}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-center mt-1">
                      <div className="text-xs font-bold text-white tracking-wide truncate">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {acc.category}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center font-mono text-xs font-bold text-[#F4B942] my-2">
                      ₹{acc.price} <span className="text-[10px] font-normal text-slate-400">each</span>
                    </div>

                    {/* Stepper or Add button */}
                    {count > 0 ? (
                      <div className="flex items-center justify-between bg-black/40 rounded-xl border border-purple-500/40 p-1">
                        <button
                          type="button"
                          onClick={() => handleAccessoryQtyChange(acc.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAccessoryQtyChange(acc.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAccessoryQtyChange(acc.id, 1)}
                        className="w-full py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-400 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: COLORS */}
          {activeTab === 'colors' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {DIY_COLORS_PALETTE.map((c) => {
                const isSelected = config.selectedColor?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectColor(c)}
                    className={`rounded-2xl p-4 flex flex-col items-center justify-between transition-all duration-300 border text-center ${
                      isSelected
                        ? 'bg-purple-600/25 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                        : 'bg-[#050816]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 shadow-lg mb-2 relative"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: c.border,
                      }}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center text-black">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{c.label}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 4: WATCH BASES */}
          {activeTab === 'watches' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WATCH_BASES.map((base) => {
                const isSelected = config.watchBase?.id === base.id;
                return (
                  <div
                    key={base.id}
                    onClick={() => handleSelectWatchBase(base)}
                    className={`cursor-pointer rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 border ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#141A3D] to-[#0A0F26] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                        : 'bg-[#050816]/80 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-purple-300">{base.colorName}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="w-full h-24 rounded-xl flex items-center justify-center my-2 bg-black/40 border border-white/5">
                      <div
                        className="w-14 h-16 rounded-2xl border-2 shadow-lg flex items-center justify-center text-xs font-mono text-white"
                        style={{
                          backgroundColor: '#1E112A',
                          borderColor: base.bezelColor,
                        }}
                      >
                        10:09
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="text-xs font-bold text-white">{base.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                        {base.caseMaterial}
                      </div>
                      <div className="font-mono text-sm font-bold text-[#F4B942] mt-2">
                        ₹{base.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiyCataloguePanel;
