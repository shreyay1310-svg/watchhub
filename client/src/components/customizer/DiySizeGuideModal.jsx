import React from 'react';
import { X, Ruler, CheckCircle2, AlertCircle } from 'lucide-react';

const WRIST_SIZE_TABLE = [
  { cm: '14.0 - 14.5 cm', inches: '5.5" - 5.7"', fit: 'Extra Small (XS)', beads8mm: '14 - 15 beads' },
  { cm: '14.5 - 15.5 cm', inches: '5.7" - 6.1"', fit: 'Small (S)', beads8mm: '15 - 17 beads' },
  { cm: '15.5 - 16.5 cm', inches: '6.1" - 6.5"', fit: 'Medium (M)', beads8mm: '17 - 19 beads' },
  { cm: '16.5 - 18.0 cm', inches: '6.5" - 7.1"', fit: 'Large (L)', beads8mm: '19 - 21 beads' },
  { cm: '18.0 - 20.0 cm', inches: '7.1" - 7.9"', fit: 'Extra Large (XL)', beads8mm: '21 - 24 beads' },
];

export const DiySizeGuideModal = ({ isOpen, onClose, onSelectSize }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#090E24] border border-purple-500/30 p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              Wrist Size & Fitting Guide
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              How to measure your wrist for a tailored, snug beaded smartwatch bracelet.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
            <div className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <span className="font-semibold text-white">Use a flexible measuring tape or strip of paper:</span> Wrap it snugly around your wrist just behind the wrist bone where you typically wear your watch.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
            <div className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <span className="font-semibold text-white">Mark the exact overlap:</span> Note the measurement in centimeters (cm). Do NOT add extra slack—our studio algorithm automatically compensates for the elastic cord tension and bead curvature.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
            <div className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <span className="font-semibold text-white">Elastic comfort stretch:</span> WatchHub beaded bracelets are hand-strung on multi-strand Japanese stretch cord providing 2-3 cm of comfortable flexibility.
            </div>
          </div>
        </div>

        {/* Reference Table */}
        <div className="rounded-2xl overflow-hidden border border-white/10 mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141A3D] text-slate-300 border-b border-white/10 font-semibold">
              <tr>
                <th className="py-3 px-3">Wrist Size</th>
                <th className="py-3 px-3">Inches</th>
                <th className="py-3 px-3">Fit Category</th>
                <th className="py-3 px-3">Bead Count (8mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {WRIST_SIZE_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-medium text-purple-300">{row.cm}</td>
                  <td className="py-2.5 px-3 font-mono">{row.inches}</td>
                  <td className="py-2.5 px-3">{row.fit}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{row.beads8mm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommended presets */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">Quick Select:</span>
          <div className="flex items-center gap-2">
            {[14.3, 15.5, 16.5, 17.5].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  if (onSelectSize) onSelectSize(preset);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-mono font-medium transition-colors"
              >
                {preset} cm
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiySizeGuideModal;
