import React from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  DollarSign,
  Smartphone,
  Building,
  CheckCircle2,
  Printer,
  FileText,
  Download,
  Mail,
  Share2,
  Lock,
} from 'lucide-react';

export default function POSCheckoutModals({
  paymentModalOpen,
  setPaymentModalOpen,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  grandTotal,
  formatPrice,
  cashTendered,
  setCashTendered,
  cashChangeToReturn,
  cashRemainingBalance,
  splitDetails,
  setSplitDetails,
  isAuthorizingPayment,
  handleProcessPayment,
  invoiceModalOpen,
  setInvoiceModalOpen,
  activeInvoice,
  showToast,
  handleNewSale,
}) {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          MODAL 1: PAYMENT CHECKOUT MODAL
          ════════════════════════════════════════════════════════════════ */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-fade-in text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1265FF]/20 text-[#00D5FF] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-white">POS Payment Gateway</h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Terminal Auth: WH-POS-04 • Bill #{Math.floor(1000 + Math.random() * 9000)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Payable Highlight */}
            <div className="p-4 rounded-2xl bg-[#080923] border border-[#23275E] text-center">
              <span className="text-[10.5px] text-slate-400 uppercase font-mono block">
                Total Amount Payable
              </span>
              <span className="text-3xl font-bold font-mono text-[#E9B94F]">
                {formatPrice(grandTotal)}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Client: {selectedCustomer.name} ({selectedCustomer.phone})
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-2 font-mono text-xs">
              {[
                { id: 'Card', label: 'Credit Card', icon: CreditCard },
                { id: 'Cash', label: 'Cash', icon: DollarSign },
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'Split', label: 'Split Pay', icon: Layers },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${paymentMethod === m.id
                      ? 'bg-gradient-to-tr from-[#6500FF] to-[#1265FF] text-white border-transparent shadow-lg font-bold'
                      : 'bg-[#080923] border-[#23275E] text-slate-300 hover:border-slate-400'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10.5px]">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode-Specific Content */}
            {paymentMethod === 'Cash' && (
              <div className="space-y-3 bg-[#080923] p-3.5 rounded-2xl border border-[#23275E]">
                <label className="text-[11px] text-slate-400 font-mono block">
                  Cash Amount Tendered:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder="Enter cash amount received..."
                    className="w-full h-10 pl-8 pr-3 bg-[#11123D] border border-white/10 rounded-xl text-white font-mono text-sm outline-none focus:border-[#E9B94F]"
                  />
                </div>

                {/* Quick denomination chips */}
                <div className="flex gap-2">
                  {[grandTotal, grandTotal + 500, grandTotal + 2000].map((amt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCashTendered(amt.toString())}
                      className="px-2 py-1 rounded-lg bg-[#11123D] border border-[#23275E] text-[10px] font-mono text-slate-300 hover:text-white"
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between font-mono text-xs pt-1 border-t border-white/5">
                  <span className="text-slate-400">Change to Return:</span>
                  <span className="text-[#00C98B] font-bold text-sm">
                    {formatPrice(cashChangeToReturn)}
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="p-4 rounded-2xl bg-[#080923] border border-[#23275E] text-center space-y-2">
                <CreditCard className="w-8 h-8 text-[#00D5FF] mx-auto animate-pulse" />
                <p className="font-bold text-white text-xs">Waiting for Card Swipe / Insert</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  ICICI EDC Terminal #8821 Connected • Dip Chip or Tap Contactless NFC
                </p>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                  ✓ EMV Pin Pad Ready
                </span>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-[#080923] border border-[#23275E] text-center space-y-2.5">
                <div className="w-32 h-32 rounded-xl bg-white p-2 mx-auto flex items-center justify-center shadow-lg">
                  <QrCode className="w-28 h-28 text-black" />
                </div>
                <p className="text-xs font-mono text-white font-bold">
                  VPA: watchhub.boutique04@icici
                </p>
                <p className="text-[10px] text-slate-400">
                  Scan via GPay, PhonePe, Paytm, BHIM or any Banking UPI App
                </p>
              </div>
            )}

            {paymentMethod === 'Split' && (
              <div className="space-y-2.5 bg-[#080923] p-3.5 rounded-2xl border border-[#23275E] font-mono">
                <div>
                  <label className="text-[10.5px] text-slate-400">Cash Portion:</label>
                  <input
                    type="number"
                    value={splitCashAmount}
                    onChange={(e) => setSplitCashAmount(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-full h-8 px-2.5 bg-[#11123D] border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-slate-400">Card / UPI Portion:</label>
                  <input
                    type="number"
                    value={splitCardAmount}
                    onChange={(e) => setSplitCardAmount(e.target.value)}
                    placeholder="Remaining balance"
                    className="w-full h-8 px-2.5 bg-[#11123D] border border-white/10 rounded-lg text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Complete Payment Button */}
            <button
              type="button"
              disabled={paymentProcessing}
              onClick={handleProcessPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {paymentProcessing ? 'Authorizing Merchant Payment...' : 'AUTHORIZE & PRINT RECEIPT'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 2: LUXURY TAX INVOICE & RECEIPT MODAL
          ════════════════════════════════════════════════════════════════ */}
      {invoiceModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11123D] border border-[#E9B94F]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8 animate-fade-in text-xs text-white">
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between border-b border-[#23275E] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  <h2 className="text-xl font-serif font-bold tracking-tight text-white">
                    WATCHHUB LUXURY HOROLOGY
                  </h2>
                </div>
                <p className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                  Flagship Boutique • 14/B Heritage Chambers, Palladium Mall, Mumbai
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  GSTIN: 27AAACW8892K1Z5 • CIN: U33100MH2024PTC392811
                </p>
              </div>

              <div className="text-right font-mono">
                <span className="px-2.5 py-1 rounded bg-[#E9B94F]/20 text-[#E9B94F] font-bold text-[11px] border border-[#E9B94F]/40 block mb-1">
                  ORIGINAL TAX INVOICE
                </span>
                <p className="text-xs font-bold text-white">{activeInvoice.invoiceNumber}</p>
                <p className="text-[10px] text-slate-400">{activeInvoice.date}</p>
              </div>
            </div>

            {/* Client & Cashier Strip */}
            <div className="grid grid-cols-2 gap-4 bg-[#080923] p-3.5 rounded-2xl border border-[#23275E] font-mono text-[11px]">
              <div>
                <span className="text-slate-500 uppercase text-[9.5px] block">Billed To:</span>
                <span className="text-white font-bold block">{activeInvoice.customer}</span>
                <span className="text-slate-400 block">{activeInvoice.customerPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 uppercase text-[9.5px] block">Cashier / POS:</span>
                <span className="text-white font-bold block">{activeInvoice.cashier}</span>
                <span className="text-slate-400 block">Terminal #04 (ICICI Merchant)</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-[#23275E] rounded-xl overflow-x-auto font-mono">
              <table className="w-full text-left min-w-[480px]">
                <thead className="bg-[#080923] text-slate-400 text-[10px] uppercase border-b border-[#23275E]">
                  <tr>
                    <th className="py-2 px-3">Item / Timepiece</th>
                    <th className="py-2 px-2 text-center">SKU</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23275E]/60 text-xs">
                  {activeInvoice.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{it.name}</span>
                        <span className="text-[10px] text-[#E9B94F]">{it.brand}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center text-slate-400 text-[11px]">
                        {it.sku}
                      </td>
                      <td className="py-2.5 px-2 text-center text-white font-bold">{it.qty}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {formatPrice(it.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-bold">
                        {formatPrice(it.price * it.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="space-y-1.5 font-mono text-xs max-w-xs ml-auto">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white">{formatPrice(activeInvoice.grossSubtotal)}</span>
              </div>
              {activeInvoice.totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount:</span>
                  <span>-{formatPrice(activeInvoice.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>CGST (9%):</span>
                <span className="text-white">{formatPrice(activeInvoice.cgstAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SGST (9%):</span>
                <span className="text-white">{formatPrice(activeInvoice.sgstAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#E9B94F] pt-2 border-t border-[#23275E]">
                <span>Grand Total Paid:</span>
                <span>{formatPrice(activeInvoice.total)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Payment Mode:</span>
                <span className="text-slate-300 font-bold">{activeInvoice.paymentMethod}</span>
              </div>
            </div>

            {/* Guarantee & Return Policy Footnote */}
            <div className="bg-[#080923] p-3 rounded-xl border border-white/5 space-y-1 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 text-[#E9B94F] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WatchHub International Guarantee & Terms</span>
              </div>
              <p>
                • All watches include certified manufacturer warranties with complimentary 2-year
                in-house atelier service coverage.
              </p>
              <p>
                • 7-Day Unworn Exchange Policy applicable in original luxury box packaging with warranty
                cards intact.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#23275E]">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('🖨️ Printing thermal tax receipt slip...');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#1265FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('📥 PDF Invoice downloaded to local storage.')}
                className="px-4 py-2.5 rounded-xl bg-[#080923] hover:bg-[#1A1E52] border border-[#23275E] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={() => showToast(`✉️ Invoice emailed to ${activeInvoice.customerEmail || 'client'}`)}
                className="px-4 py-2.5 rounded-xl bg-[#080923] hover:bg-[#1A1E52] border border-[#23275E] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#E9B94F]" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInvoiceModalOpen(false);
                  setActiveInvoice(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Done / Next Sale
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
