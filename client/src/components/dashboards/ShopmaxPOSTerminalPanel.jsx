import React from 'react';
import {
  CreditCard,
  Plus,
  Minus,
  Trash2,
  Barcode,
  Camera,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { INITIAL_POS_ITEMS } from '../../data/shopmaxDashboardData';

export default function ShopmaxPOSTerminalPanel({
  posTab,
  setPosTab,
  posCart,
  setPosCart,
  handleQtyChange,
  handleRemovePosItem,
  subtotal,
  tax,
  grandTotal,
  setCheckoutModalOpen,
  setCardPaymentModalOpen,
  cameraActive,
  setCameraActive,
  scanSuccessMessage,
  scannedSku,
  setScannedSku,
  handleBarcodeScan,
  onNavigateTab,
}) {
  return (
    <div className="bg-[#0B1445]/90 border border-[#1E2968] rounded-2xl p-5 shadow-lg">
      {/* Tabs Header */}
      <div className="flex items-center gap-6 border-b border-[#1E2968] pb-2.5 mb-4">
        <button
          type="button"
          onClick={() => setPosTab('pos')}
          className={`text-sm font-bold pb-1 cursor-pointer transition-colors relative ${
            posTab === 'pos'
              ? 'text-white border-b-2 border-[#1265FF]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          POS Terminal
        </button>
        <button
          type="button"
          onClick={() => setPosTab('scanner')}
          className={`text-sm font-bold pb-1 cursor-pointer transition-colors relative ${
            posTab === 'scanner'
              ? 'text-white border-b-2 border-[#1265FF]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Barcode Scanner
        </button>

        {/* Quick Launch Fullscreen POS Terminal Station */}
        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('pos')}
            title="Launch Full Dedicated POS Terminal Station"
            className="ml-auto text-[11px] font-bold text-[#00D9FF] hover:text-white bg-[#1265FF]/20 hover:bg-[#1265FF]/40 border border-[#1265FF]/40 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>Full POS Terminal</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* TAB 1: POS TERMINAL */}
      {posTab === 'pos' && (
        <div className="space-y-4">
          {/* Watch Products List in Cart */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {posCart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#081033] border border-white/5 hover:border-[#1E2968] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-contain bg-black/40 border border-white/10 p-0.5 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/images/products/watch_placeholder.png';
                    }}
                  />
                  <div>
                    <h5 className="text-xs font-semibold text-white leading-tight">
                      {item.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.sku}
                    </p>
                    <p className="text-xs font-bold text-[#00D9FF] mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Qty and Delete */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#0B1445] border border-white/10 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, -1)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 text-xs font-bold text-white">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, 1)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePosItem(item.id)}
                    className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {posCart.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>POS Cart is empty.</p>
                <button
                  type="button"
                  onClick={() => setPosCart(INITIAL_POS_ITEMS)}
                  className="mt-2 text-xs text-[#00D9FF] hover:underline cursor-pointer"
                >
                  Reset sample items
                </button>
              </div>
            )}
          </div>

          {/* Subtotal, Tax, Total */}
          <div className="pt-3 border-t border-[#1E2968] space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-semibold text-white">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax (10%)</span>
              <span className="font-semibold text-white">
                ₹{tax.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1E2968]/70">
              <span>Total</span>
              <span className="text-base text-white font-extrabold">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1265FF] to-[#741BFF] text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Checkout</span>
            </button>

            <button
              type="button"
              onClick={() => setCardPaymentModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#081033] border border-blue-500/30 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#0c194e] hover:border-blue-400 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#00D9FF]" />
              <span>Pay with Card</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: BARCODE SCANNER */}
      {posTab === 'scanner' && (
        <div className="space-y-4">
          {/* Viewfinder box */}
          <div className="relative rounded-2xl bg-black/60 border-2 border-dashed border-[#1265FF]/60 p-4 text-center overflow-hidden">
            <div className="h-28 flex flex-col items-center justify-center">
              <Barcode className="w-12 h-12 text-[#00D9FF] mb-2" />
              <p className="text-xs font-semibold text-white">
                {cameraActive
                  ? 'Camera Active — Scanning Laser Armed'
                  : 'Hardware & Camera Scanner Ready'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Point barcode reader or enter SKU code below
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCameraActive(!cameraActive)}
              className="mt-2 text-[11px] font-bold text-[#00D9FF] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraActive ? 'Stop Camera' : 'Activate Camera Scanner'}</span>
            </button>
          </div>

          {/* Feedback message */}
          {scanSuccessMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{scanSuccessMessage}</span>
            </div>
          )}

          {/* Manual SKU input form */}
          <form onSubmit={handleBarcodeScan} className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-300 block">
              Fast SKU / Barcode Entry:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scannedSku}
                onChange={(e) => setScannedSku(e.target.value)}
                placeholder="e.g. WH-ROL-001, WH-OMG-001"
                className="flex-1 bg-[#081033] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-[#1265FF]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1265FF] hover:bg-[#0e52d6] text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0"
              >
                Scan & Add
              </button>
            </div>
          </form>

          {/* Quick Scan Badges */}
          <div className="space-y-1.5 pt-2 border-t border-[#1E2968]">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Quick Sample Barcodes:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[
                { code: 'WH-ROL-001', label: 'Rolex' },
                { code: 'WH-OMG-001', label: 'Omega' },
                { code: 'WH-TAG-001', label: 'TAG Heuer' },
                { code: 'WH-TIS-001', label: 'Tissot' },
              ].map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => {
                    setScannedSku(b.code);
                  }}
                  className="px-2 py-1 rounded-lg bg-[#081033] border border-white/10 hover:border-[#1265FF] text-slate-300 hover:text-white cursor-pointer"
                >
                  {b.label} ({b.code})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
