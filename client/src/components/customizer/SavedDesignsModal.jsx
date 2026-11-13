import React from 'react';
import { X, Trash2, ArrowRight, Clock, BookmarkCheck } from 'lucide-react';

export const SavedDesignsModal = ({
  isOpen,
  onClose,
  savedDesigns = [],
  onLoadDesign,
  onDeleteDesign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-poppins">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative animate-scale-up max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-watch-gold/20 flex items-center justify-center text-amber-900 font-bold">
              🔖
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Your Saved Watch Designs</h3>
              <p className="text-[11px] text-gray-400">Load or revisit previous bespoke configurations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Designs List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedDesigns.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              <BookmarkCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-gray-700">No Saved Designs Yet</p>
              <p className="text-[11px] mt-1">
                Customize your watch and click "Save Design" to keep it stored here.
              </p>
            </div>
          ) : (
            savedDesigns.map((design, idx) => (
              <div
                key={design.id || idx}
                className="p-3.5 rounded-2xl border border-gray-200 hover:border-watch-gold bg-gray-50/50 hover:bg-amber-50/20 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: design.dial?.customHex || '#1B3B6F' }}
                  >
                    <span className="text-xs">⌚</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{design.name || 'Custom Timepiece'}</h4>
                    <p className="text-[10.5px] text-gray-500">
                      {design.dial?.shape} • {design.dial?.size}mm • {design.case?.material} • {design.strap?.material}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{design.savedAt || 'Recently Saved'}</span>
                      {design.personalization?.backEngraving && (
                        <span className="text-amber-800 font-bold">
                          • "{design.personalization.backEngraving}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadDesign(design);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-watch-navy text-white hover:bg-watch-gold hover:text-black text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteDesign(design.id)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete Saved Design"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100 mt-4 text-center">
          <p className="text-[10.5px] text-gray-400">
            Designs are automatically saved to your browser and WatchHub customer account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavedDesignsModal;
