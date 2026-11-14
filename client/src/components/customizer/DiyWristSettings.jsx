import React from 'react';
import { Minus, Plus, Ruler, Layers } from 'lucide-react';

export const DiyWristSettings = ({
  config,
  onChange,
  onOpenSizeGuide,
}) => {
  const { bandMode, wristSizeCm, activeBandTab, band1, band2 } = config;

  // Wrist conversion
  const wristInches = (wristSizeCm / 2.54).toFixed(1);

  // Handle wrist size changes (+/- 0.5 cm)
  const handleWristChange = (delta) => {
    const newCm = Math.min(22, Math.max(12, +(wristSizeCm + delta).toFixed(1)));
    
    // Auto calculate bead count: (wrist in mm - watch body gap ~40mm) / beadSize
    const availableLengthMm = Math.max(80, newCm * 10 - 40);
    const beadCount1 = Math.round(availableLengthMm / (band1.beadSize || 8));
    const beadCount2 = Math.round(availableLengthMm / (band2.beadSize || 8));

    onChange({
      ...config,
      wristSizeCm: newCm,
      band1: {
        ...band1,
        lengthCm: newCm,
        beadsCount: beadCount1,
      },
      band2: {
        ...band2,
        lengthCm: newCm,
        beadsCount: beadCount2,
      },
    });
  };

  const handleBandModeChange = (mode) => {
    onChange({
      ...config,
      bandMode: mode,
      activeBandTab: 1, // reset to tab 1
    });
  };

  const handleActiveBandTabChange = (tab) => {
    onChange({
      ...config,
      activeBandTab: tab,
    });
  };

  return (
    <div className="rounded-2xl p-4 md:p-5 bg-[#0B1026]/90 backdrop-blur-xl border border-purple-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-white uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Band Configuration
        </h3>
      </div>

      {/* Single Band vs Double Band selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#050816] rounded-xl border border-white/5 mb-4">
        <button
          type="button"
          onClick={() => handleBandModeChange('single')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
            bandMode === 'single'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Single Band
        </button>

        <button
          type="button"
          onClick={() => handleBandModeChange('double')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
            bandMode === 'double'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Double Band
        </button>
      </div>

      {/* Estimated Wrist Size */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-300 font-medium">Estimated Wrist Size</span>
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-[11px] transition-colors"
          >
            <Ruler className="w-3 h-3" />
            Size Guide
          </button>
        </div>

        {/* Stepper matching: [-  14.3 cm (5.6 in)  +] */}
        <div className="flex items-center justify-between bg-[#050816] rounded-xl border border-white/10 px-3 py-2">
          <button
            type="button"
            onClick={() => handleWristChange(-0.5)}
            disabled={wristSizeCm <= 12}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center disabled:opacity-30 transition-colors"
            title="Decrease wrist size"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="text-center">
            <span className="text-sm font-bold text-white font-mono tracking-wide">
              {wristSizeCm} cm
            </span>
            <span className="text-xs text-slate-400 ml-1.5">
              ({wristInches} in)
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleWristChange(0.5)}
            disabled={wristSizeCm >= 22}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-purple-600/30 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center disabled:opacity-30 transition-colors"
            title="Increase wrist size"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Band Selection Tabs matching: [Band 1 | 14.3 cm] [Band 2 | 14.3 cm] */}
      <div className={`grid ${bandMode === 'double' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
        <button
          type="button"
          onClick={() => handleActiveBandTabChange(1)}
          className={`py-2 px-3 rounded-xl border text-center transition-all duration-300 ${
            activeBandTab === 1
              ? 'bg-purple-600/25 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
              : 'bg-[#050816]/70 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          <div className="text-xs font-semibold">Band 1 (Inner)</div>
          <div className="text-[11px] text-purple-300 font-mono mt-0.5">
            {band1.lengthCm} cm &bull; {band1.beadsCount} beads
          </div>
        </button>

        {bandMode === 'double' && (
          <button
            type="button"
            onClick={() => handleActiveBandTabChange(2)}
            className={`py-2 px-3 rounded-xl border text-center transition-all duration-300 ${
              activeBandTab === 2
                ? 'bg-purple-600/25 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-[#050816]/70 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className="text-xs font-semibold">Band 2 (Outer)</div>
            <div className="text-[11px] text-purple-300 font-mono mt-0.5">
              {band2.lengthCm} cm &bull; {band2.beadsCount} beads
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default DiyWristSettings;
