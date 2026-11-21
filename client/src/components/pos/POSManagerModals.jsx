import React from 'react';
import {
  X,
  Lock,
  Key,
  Play,
  Trash2,
  Printer,
  UserPlus,
  CheckCircle2,
  Award,
  Sparkles,
  FileText,
  Calendar,
} from 'lucide-react';

export default function POSManagerModals({
  managerPinModalOpen,
  setManagerPinModalOpen,
  managerPin,
  setManagerPin,
  managerPinError,
  handleAuthorizeManagerPin,
  heldSalesModalOpen,
  setHeldSalesModalOpen,
  heldSalesList = [],
  handleResumeSale,
  setHeldSalesList,
  showToast,
  historyModalOpen,
  setHistoryModalOpen,
  salesHistory = [],
  setActiveInvoice,
  setInvoiceModalOpen,
  zReportModalOpen,
  setZReportModalOpen,
  currentDateTime,
  formatPrice,
  showAddCustomerModal,
  setShowAddCustomerModal,
  newCustomerForm,
  setNewCustomerForm,
  customersList,
  setCustomersList,
  setSelectedCustomer,
}) {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════
          MODAL 3: MANAGER SECURITY PIN AUTHORIZATION
          ════════════════════════════════════════════════════════════════ */}
      {managerPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-rose-500/50 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Manager Approval Required</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Discounts greater than 20% exceed cashier threshold. Please enter Manager PIN.
              </p>
              <p className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">
                (Authorized PIN: 7788)
              </p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={managerPinInput}
              onChange={(e) => setManagerPinInput(e.target.value)}
              placeholder="Enter 4-Digit PIN..."
              className="w-full h-11 text-center font-mono text-lg tracking-widest bg-[#080923] border border-white/20 rounded-xl outline-none focus:border-rose-400"
            />

            {managerPinError && (
              <p className="text-[10.5px] text-rose-400 text-center font-mono font-semibold">
                {managerPinError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setManagerPinModalOpen(false);
                  setManagerPinInput('');
                  setManagerPinError(null);
                }}
                className="flex-1 py-2 rounded-xl bg-[#080923] text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorizeManagerPin}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold"
              >
                Authorize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 4: HELD SALES MANAGEMENT
          ════════════════════════════════════════════════════════════════ */}
      {heldSalesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Pause className="w-4 h-4 text-[#E9B94F]" />
                <span>Held / Parked Sales ({heldSales.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setHeldSalesModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {heldSales.length === 0 ? (
                <p className="py-6 text-center text-slate-500 font-mono">No currently held sales.</p>
              ) : (
                heldSales.map((h) => (
                  <div
                    key={h.id}
                    className="p-3 rounded-xl bg-[#080923] border border-[#23275E] flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-white block">{h.customer}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {h.id} • {h.timestamp} • {h.items.length} items
                      </span>
                      <span className="text-xs font-mono font-bold text-[#E9B94F] block mt-0.5">
                        {formatPrice(h.total)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleResumeSale(h)}
                        className="px-3 py-1.5 rounded-lg bg-[#6500FF] hover:bg-[#1265FF] text-white font-bold font-mono text-[11px]"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHeldSales(heldSales.filter((item) => item.id !== h.id));
                          showToast('Discarded held ticket');
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                        title="Discard"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 5: TRANSACTION HISTORY & REPRINT
          ════════════════════════════════════════════════════════════════ */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-4xl w-full space-y-4 shadow-2xl text-xs text-white max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  POS Register Transaction History
                </h3>
                <p className="text-[10.5px] text-slate-400 font-mono">
                  All counter sales, payment settlements and invoices for Terminal #04
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left font-mono text-[11px] min-w-[550px]">
                <thead className="bg-[#080923] text-slate-400 text-[10px] uppercase border-b border-[#23275E]">
                  <tr>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Items Summary</th>
                    <th className="py-2.5 px-2 text-center">Payment</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#23275E]/60">
                  {completedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{tx.invoiceNumber}</span>
                        <span className="text-[9.5px] text-slate-500">{tx.date}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-200 block">{tx.customer}</span>
                        <span className="text-[9.5px] text-slate-500">{tx.customerPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate">
                        {tx.productsText}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#6500FF]/20 text-[#00D5FF] text-[10px]">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        {formatPrice(tx.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInvoice(tx);
                            setHistoryModalOpen(false);
                            setInvoiceModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-[#1265FF] hover:bg-[#00D5FF] hover:text-black text-white text-[10px] font-bold"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 6: Z-REPORT / DAILY SALES SUMMARY
          ════════════════════════════════════════════════════════════════ */}
      {zReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-serif font-bold text-white">Daily Z-Report Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => setZReportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-[#080923] p-4 rounded-2xl border border-[#23275E] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Date:</span>
                <span className="text-white">
                  {currentDateTime.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Register Sales:</span>
                <span className="text-emerald-400 font-bold">{formatPrice(2485075)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Completed Orders:</span>
                <span className="text-white">28 Transactions</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Average Order Value:</span>
                <span className="text-white">{formatPrice(88752)}</span>
              </div>
              <div className="border-t border-[#23275E] pt-2 flex justify-between text-slate-400">
                <span>Card Settlements:</span>
                <span className="text-white">{formatPrice(1250075)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>UPI Collections:</span>
                <span className="text-white">{formatPrice(820000)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cash in Drawer:</span>
                <span className="text-white">{formatPrice(415000)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.print();
                showToast('🖨️ Printing Daily Z-Report Slip...');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official EOD Z-Report</span>
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 7: ADD NEW CUSTOMER MODAL
          ════════════════════════════════════════════════════════════════ */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11123D] border border-[#23275E] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white">
            <div className="flex items-center justify-between border-b border-[#23275E] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#00D5FF]" />
                <span>Register New VIP Client</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">Full Name:</label>
                <input
                  type="text"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Birla"
                  className="w-full h-9 px-3 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">
                  Mobile Number:
                </label>
                <input
                  type="text"
                  value={newCustomerForm.phone}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                  }
                  placeholder="+91 98200 00000"
                  className="w-full h-9 px-3 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, email: e.target.value })
                  }
                  placeholder="client@luxury.com"
                  className="w-full h-9 px-3 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#6500FF]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 font-mono block">
                  Membership Tier:
                </label>
                <select
                  value={newCustomerForm.tier}
                  onChange={(e) =>
                    setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })
                  }
                  className="w-full h-9 px-2 bg-[#080923] border border-white/10 rounded-xl text-white text-xs outline-none"
                >
                  <option value="Gold Member">Gold Member (2% Privilege)</option>
                  <option value="Platinum VIP">Platinum VIP (3% Privilege)</option>
                  <option value="Diamond VIP">Diamond VIP (5% Privilege)</option>
                  <option value="Connoisseur VIP">Connoisseur VIP (7% Privilege)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!newCustomerForm.name || !newCustomerForm.phone) {
                  showToast('⚠️ Please enter name and mobile number.');
                  return;
                }
                const created = {
                  id: `c_${Date.now()}`,
                  name: newCustomerForm.name,
                  phone: newCustomerForm.phone,
                  email: newCustomerForm.email || 'client@watchhub.in',
                  tier: newCustomerForm.tier,
                  points: 500, // Welcome points
                  totalSpent: 0,
                  ordersCount: 0,
                  discountRate:
                    newCustomerForm.tier === 'Diamond VIP'
                      ? 5
                      : newCustomerForm.tier === 'Connoisseur VIP'
                        ? 7
                        : 2,
                };
                setCustomersList([created, ...customersList]);
                setSelectedCustomer(created);
                setShowAddCustomerModal(false);
                setNewCustomerForm({ name: '', phone: '', email: '', tier: 'Gold Member' });
                showToast(`✨ Client ${created.name} registered and selected!`);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#1265FF] text-white font-bold text-xs"
            >
              Save & Attach to Current Bill
            </button>
          </div>
        </div>
      )}
    </>
  );
}
