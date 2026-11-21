import React, { useState } from 'react';
import { Clock, Search, MapPin, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const DeliveryHistoryModule = () => {
  const [search, setSearch] = useState('');

  const history = [
    { id: 'WH12537', customer: 'Vikas Tandon', product: 'Breitling Navitimer B01', date: '20 Nov 2026', status: 'Delivered', zone: 'Gomti Nagar', amount: '₹7,20,000' },
    { id: 'WH12536', customer: 'Meera Rao', product: 'Omega Seamaster Diver 300M', date: '20 Nov 2026', status: 'Delivered', zone: 'Aliganj', amount: '₹5,10,000' },
    { id: 'WH12535', customer: 'Abhishek Saxena', product: 'TAG Heuer Monaco Racing', date: '19 Nov 2026', status: 'Delivered', zone: 'Hazratganj', amount: '₹6,40,000' },
    { id: 'WH12534', customer: 'Sunita Mishra', product: 'Rolex Datejust 36mm', date: '19 Nov 2026', status: 'Customer Rescheduled', zone: 'Indira Nagar', amount: '₹8,90,000' },
    { id: 'WH12533', customer: 'Harsh Vardhan', product: 'Apple Watch Ultra 2 Titanium', date: '18 Nov 2026', status: 'Delivered', zone: 'Mahanagar', amount: '₹89,900' },
  ];

  const filtered = history.filter(
    (h) =>
      h.id.toLowerCase().includes(search.toLowerCase()) ||
      h.customer.toLowerCase().includes(search.toLowerCase()) ||
      h.product.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Complete Delivery Log &amp; Historical Ledger</span>
          </h2>
          <p className="text-xs text-gray-400">
            Archival records of completed routes, customer handovers, and transit timestamps.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search archival deliveries..."
            className="pl-8 pr-3 py-1.5 bg-[#0B1022] border border-white/10 rounded-xl text-xs text-white"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-[#0B1022] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#050816] text-[10px] text-gray-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Timepiece Item</th>
                <th className="py-3 px-4">Delivery Zone</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Final Outcome</th>
                <th className="py-3 px-4 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">#{item.id}</td>
                  <td className="py-3 px-4 text-white font-semibold">{item.customer}</td>
                  <td className="py-3 px-4 text-gray-200">{item.product}</td>
                  <td className="py-3 px-4 text-gray-400">{item.zone}</td>
                  <td className="py-3 px-4 text-gray-400">{item.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Delivered'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistoryModule;
