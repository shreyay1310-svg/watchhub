import React from 'react';
import {
  Box,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Check,
} from 'lucide-react';

export default function PickPackSubTab({
  packOrder,
  barcodeInput,
  setBarcodeInput,
  handleBarcodeScan,
  scannedMatched,
  selectedBox,
  setSelectedBox,
  qcState,
  setQcState,
  handleCompletePacking,
  packedSuccess,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Order Selected & Barcode Matcher */}
      <div className="lg:col-span-5 space-y-5">
        {/* Active Order Card */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                Packaging Bench #04
              </span>
              <h4 className="text-base font-black text-[#F8FAFC]">{packOrder.id}</h4>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
              {packOrder.priority}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Customer:</span>
              <span className="font-bold text-[#F8FAFC]">{packOrder.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Destination:</span>
              <span className="font-bold text-[#F8FAFC]">{packOrder.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Watch Model:</span>
              <span className="font-bold text-watch-navy-dark">{packOrder.watch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">SKU Code:</span>
              <span className="font-mono font-bold text-[#F8FAFC]">{packOrder.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A6B1C8]">Order Value:</span>
              <span className="font-extrabold text-emerald-600 text-sm">{packOrder.price}</span>
            </div>
          </div>

          {/* Barcode Scanner Tool */}
          <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 space-y-2">
            <label className="text-[11px] font-bold text-[#A6B1C8] flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-watch-gold" /> Scan Serial / SKU Barcode
            </label>
            <form onSubmit={handleBarcodeScan} className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder={`e.g. ${packOrder.sku}`}
                className="flex-1 h-9 px-3 rounded-lg border border-white/15 text-xs font-mono outline-none focus:border-watch-gold"
              />
              <button
                type="submit"
                className="px-3 bg-watch-navy-dark text-white rounded-lg text-xs font-bold hover:bg-black cursor-pointer"
              >
                Verify
              </button>
            </form>
            {scannedMatched ? (
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Barcode Authenticated & Serial Verified
              </p>
            ) : (
              <p className="text-[10px] text-gray-400">
                Scan the barcode physically or type SKU code to proceed to label print.
              </p>
            )}
          </div>
        </div>

        {/* Packaging Box Selection */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
            <Box className="w-4 h-4 text-watch-gold" /> Select Packaging Casing
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { name: 'Luxury Wooden Box', tag: 'Luxury / Vault', desc: 'Piano black lacquer & velvet cushion' },
              { name: 'Standard Navy Box', tag: 'Standard Retail', desc: 'Magnetic WatchHub gold foil box' },
              { name: 'Tamper-Evident Box', tag: 'Smartwatches', desc: 'Electrostatic bubble padded case' },
              { name: 'Travel Leather Pouch', tag: 'Special Request', desc: 'Handcrafted genuine leather case' }
            ].map((box) => (
              <button
                key={box.name}
                type="button"
                onClick={() => setSelectedBox(box.name)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedBox === box.name
                    ? 'border-watch-gold bg-amber-50/60 shadow-sm ring-1 ring-watch-gold'
                    : 'border-white/10 bg-[#10182D]/90 backdrop-blur-md hover:bg-[#0B1022]/80'
                }`}
              >
                <span className="font-bold text-[#F8FAFC] block text-xs">{box.name}</span>
                <span className="text-[10px] text-watch-gold font-bold block">{box.tag}</span>
                <span className="text-[9.5px] text-gray-400 block mt-0.5">{box.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Pre-Shipment QC Checklist & Thermal Label Generator */}
      <div className="lg:col-span-7 space-y-5">
        {/* Pre-Shipment Quality Control Checklist */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Mandatory 5-Point Quality & Packaging Inspection
            </h4>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              100% Passed
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'dialChecked', label: 'Sapphire Crystal & Bezel Inspection', desc: 'Zero micro-scratches, dust particles, or bezel misalignment under 10x loupe.' },
              { key: 'movementChecked', label: 'Watch Movement & Chronograph Testing', desc: 'Hacking seconds, date change wheel, and crown screw-down confirmed working.' },
              { key: 'strapPolished', label: 'Bracelet & Clasp Deployment Safety', desc: 'Links securely pinned, double-locking foldover clasp latches smoothly.' },
              { key: 'warrantyCardInserted', label: 'Official International Warranty Card Enclosed', desc: 'Stamped with WatchHub Authorized Dealer seal and 24-Month guarantee.' },
              { key: 'authenticitySealed', label: 'Tamper-Proof Holographic Void Seal Applied', desc: 'Security sticker affixed across packaging seam with unique QR verification.' }
            ].map((chk) => (
              <label
                key={chk.key}
                className="flex items-start gap-3 p-3 bg-[#0B1022]/80 hover:bg-white/5/70 rounded-xl cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={qcState[chk.key]}
                  onChange={(e) => setQcState({ ...qcState, [chk.key]: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-watch-gold rounded focus:ring-watch-gold accent-amber-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-[#F8FAFC] block">{chk.label}</span>
                  <span className="text-[#A6B1C8] text-[11px]">{chk.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Thermal Shipping Label Preview & Dispatch */}
        <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-watch-navy-dark" /> Thermal Shipping Label & Barcode
            </h4>
            <span className="text-[10px] font-mono text-gray-400">Carrier: BlueDart Air Express</span>
          </div>

          {/* Mock Shipping Label */}
          <div className="border-2 border-dashed border-white/15 p-4 rounded-xl bg-[#0B1022]/80/50 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-start border-b border-white/15 pb-2">
              <div>
                <h5 className="font-black text-sm text-[#F8FAFC] tracking-wider">WATCHHUB LUXURY DISPATCH</h5>
                <p className="text-[10px] text-[#A6B1C8]">Hub: Mumbai Fulfilment Vault #01 • GST: 27AAAAA0000A1Z5</p>
              </div>
              <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
                FRAGILE / HIGH VALUE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Ship To:</span>
                <span className="font-bold text-[#F8FAFC] block">{packOrder.customer}</span>
                <span className="text-[#A6B1C8]">{packOrder.city}</span>
                <span className="text-[#A6B1C8] block">Phone: +91 98765 *****</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Order Details:</span>
                <span className="font-bold text-[#F8FAFC] block">{packOrder.id}</span>
                <span className="text-[#A6B1C8] block">{packOrder.watch}</span>
                <span className="text-[#A6B1C8] block">Weight: 0.52 KG • Pkg: {selectedBox}</span>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="pt-2 text-center border-t border-white/10">
              <div className="h-10 bg-repeat-x mx-auto max-w-sm rounded flex items-center justify-center tracking-widest text-lg font-black text-[#F8FAFC]">
                ||| | |||| || | ||||| || ||| |||| | |||||
              </div>
              <span className="text-[10px] text-[#A6B1C8] tracking-widest">
                AWB: BLU-88912401-IN • PREPAID
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => alert('🖨️ Thermal Label Sent to Citizen CL-S621 Barcode Printer!')}
              className="px-4 py-2 border border-white/15 hover:bg-white/5 rounded-xl text-xs font-bold text-[#A6B1C8] flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Label
            </button>
            <button
              type="button"
              onClick={handleCompletePacking}
              className="btn-gold px-5 py-2 text-xs font-black rounded-xl flex items-center gap-2 shadow-luxury cursor-pointer"
            >
              {packedSuccess ? (
                <>
                  <Check className="w-4 h-4 animate-spin" /> Packaging Sealed...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Complete Packing & Handover to Carrier
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
