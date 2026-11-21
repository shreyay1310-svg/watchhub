import React, { useState } from 'react';
import { CheckSquare, Search, CheckCircle2, Calendar, IndianRupee, ShieldCheck } from 'lucide-react';

export const CompletedOrdersModule = ({ deliveries = [] }) => {
  const [filterPeriod, setFilterPeriod] = useState('Today');
  const [search, setSearch] = useState('');

  const completedList = [
    {
      id: 'WH12540',
      customer: 'Karan Mehra',
      productName: 'Tissot PRX Powermatic 80',
      deliveredAt: 'Today, 11:15 AM',
      amount: '₹68,500',
      payoutEarned: '₹150',
      paymentMethod: 'Prepaid NetBanking',
      verifiedOtp: '•••• (Verified)',
      address: 'Hazratganj Main Road, Lucknow',
    },
    {
      id: 'WH12539',
      customer: 'Deepika Sen',
      productName: 'Rado Captain Cook Automatic',
      deliveredAt: 'Today, 10:30 AM',
      amount: '₹1,95,000',
      payoutEarned: '₹175',
      paymentMethod: 'Prepaid UPI',
      verifiedOtp: '•••• (Verified)',
      address: 'Vikas Nagar Sector 4, Lucknow',
    },
    {
      id: 'WH12538',
      customer: 'Sameer Joshi',
      productName: 'Seiko Prospex Speedtimer',
      deliveredAt: 'Today, 09:45 AM',
      amount: '₹59,000',
      payoutEarned: '₹140',
      paymentMethod: 'Cash on Delivery',
      verifiedOtp: '•••• (Verified)',
      address: 'Jankipuram Extension, Lucknow',
    },
    ...deliveries
      .filter((d) => d.status === 'Delivered')
      .map((d) => ({
        id: d.id,
        customer: d.customer,
        productName: d.productName,
        deliveredAt: 'Just Now',
        amount: d.amount,
        payoutEarned: '₹150',
        paymentMethod: d.paymentMethod,
        verifiedOtp: '•••• (Verified)',
        address: d.address,
      })),
  ];

  const filtered = completedList.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.customer.toLowerCase().includes(search.toLowerCase()) ||
      c.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span>Completed Orders &amp; Handover Proofs</span>
          </h2>
          <p className="text-xs text-gray-400">
            Successfully delivered luxury timepieces with verified customer signatures &amp; OTP tokens.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search completed..."
              className="pl-8 pr-3 py-1.5 bg-[#0B1022] border border-white/10 rounded-xl text-xs text-white"
            />
          </div>

          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-1.5 bg-[#0B1022] border border-white/10 rounded-xl text-xs text-white focus:outline-hidden"
          >
            <option value="Today">Today (12)</option>
            <option value="Yesterday">Yesterday (14)</option>
            <option value="This Week">This Week (78)</option>
            <option value="This Month">This Month (312)</option>
          </select>
        </div>
      </div>

      {/* Completed Orders Table */}
      <div className="rounded-2xl bg-[#0B1022] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#050816] text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Timepiece</th>
                <th className="py-3 px-4">Delivery Time</th>
                <th className="py-3 px-4">Handover Verification</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Rider Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    #{item.id}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold">
                    {item.customer}
                    <span className="block text-[10px] text-gray-400 truncate max-w-[140px]">
                      {item.address}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-200">
                    {item.productName}
                  </td>
                  <td className="py-3 px-4 text-gray-400 font-mono">
                    {item.deliveredAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      OTP Verified
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-300">{item.paymentMethod}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    +{item.payoutEarned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompletedOrdersModule;
