import React from 'react';
import { IndianRupee, TrendingUp, Download, Calendar, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const EarningsPayoutsModule = () => {
  const payoutHistory = [
    { id: 'PAY-8921', date: '15 Nov 2026', amount: '₹12,450', status: 'Settled', orders: 78, bank: 'HDFC Bank •••• 4021' },
    { id: 'PAY-8842', date: '08 Nov 2026', amount: '₹11,800', status: 'Settled', orders: 74, bank: 'HDFC Bank •••• 4021' },
    { id: 'PAY-8760', date: '01 Nov 2026', amount: '₹13,200', status: 'Settled', orders: 82, bank: 'HDFC Bank •••• 4021' },
    { id: 'PAY-8699', date: '25 Oct 2026', amount: '₹10,750', status: 'Settled', orders: 68, bank: 'HDFC Bank •••• 4021' },
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-amber-400" />
            <span>Rider Earnings &amp; Direct Bank Payouts</span>
          </h2>
          <p className="text-xs text-gray-400">
            Real-time delivery compensation, peak-hour incentives, and weekly settlement ledgers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Earnings statement downloaded as CSV.')}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Statement</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">Today's Earnings</span>
          <div className="text-2xl font-black text-white font-mono">₹1,850</div>
          <span className="text-[10px] text-emerald-400 font-bold block">12 Completed Deliveries</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">This Week</span>
          <div className="text-2xl font-black text-white font-mono">₹12,450</div>
          <span className="text-[10px] text-cyan-400 font-bold block">+₹1,250 Peak Incentive</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">Monthly Total</span>
          <div className="text-2xl font-black text-white font-mono">₹48,200</div>
          <span className="text-[10px] text-purple-400 font-bold block">312 Verified Deliveries</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1022] border border-white/10 space-y-1">
          <span className="text-xs text-gray-400 font-medium">Next Payout</span>
          <div className="text-2xl font-black text-amber-400 font-mono">₹6,200</div>
          <span className="text-[10px] text-gray-400 font-bold block">Scheduled: 22 Nov 2026</span>
        </div>
      </div>

      {/* Settlement History */}
      <div className="rounded-2xl bg-[#0B1022] border border-white/10 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Direct Bank Payout Ledger</h3>
          <span className="text-xs text-cyan-400 font-mono">Linked: HDFC Bank •••• 4021</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#050816] text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Settlement Date</th>
                <th className="py-3 px-4">Deliveries</th>
                <th className="py-3 px-4">Destination Account</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {payoutHistory.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{p.id}</td>
                  <td className="py-3 px-4 text-gray-300">{p.date}</td>
                  <td className="py-3 px-4 text-gray-300">{p.orders} orders</td>
                  <td className="py-3 px-4 text-gray-400 font-mono">{p.bank}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white font-mono">{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsPayoutsModule;
