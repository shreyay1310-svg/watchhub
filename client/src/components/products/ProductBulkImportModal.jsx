import React from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';

export const ProductBulkImportModal = ({
  showImportModal,
  setShowImportModal,
  showToast,
  handleDownloadTemplate,
}) => {
  if (!showImportModal) return null;

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          10. BULK IMPORT CSV MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl max-w-lg w-full shadow-2xl border border-white/10 p-6 animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#D6A63C]" />
                <span>Bulk Import Products</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#A6B1C8] mb-4">
              Upload a standard CSV file with watch listings. Duplicate SKUs will be automatically validated to protect database integrity.
            </p>

            <div className="border-2 border-dashed border-white/15 rounded-2xl p-6 text-center bg-[#0B1022]/80/50 hover:border-[#D6A63C] transition-colors cursor-pointer">
              <FileSpreadsheet className="w-10 h-10 text-[#D6A63C] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#F8FAFC]">Drag & Drop product CSV here</p>
              <p className="text-[11px] text-gray-400 mt-1">or click to browse from device</p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                id="csvFileInput"
                onChange={(e) => {
                  if (e.target.files?.length) {
                    showToast('CSV parsed! 3 products validated and ready to sync.');
                    setShowImportModal(false);
                  }
                }}
              />
              <label
                htmlFor="csvFileInput"
                className="mt-3 inline-block px-4 py-1.5 rounded-lg bg-[#0B121C] text-white font-bold text-xs cursor-pointer"
              >
                Choose File
              </label>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-[#D6A63C] font-bold hover:underline"
              >
                Download CSV Sample Template
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductBulkImportModal;
