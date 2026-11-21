import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  KeyRound,
  CheckCircle2,
  Navigation,
  ShieldAlert,
} from 'lucide-react';

export const AssignedDeliveriesModule = ({
  deliveries = [],
  onOpenOtpModal,
  onOpenIssueModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.productName.toLowerCase().includes(search.toLowerCase()) ||
      d.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' ? true : d.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-cyan-400" />
            <span>Assigned Deliveries Roster</span>
          </h2>
          <p className="text-xs text-gray-400">
            Real-time delivery queue with encrypted customer handover verification.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter parcels..."
              className="pl-8 pr-3 py-1.5 bg-[#0B1022] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-[#0B1022] border border-white/10 rounded-xl text-xs text-white focus:outline-hidden"
          >
            <option value="All">All Status</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Assigned">Assigned</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Grid of Parcels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="p-5 rounded-2xl bg-[#0B1022] border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono font-black text-cyan-400 text-sm">{d.orderNumber || `#${d.id}`}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'Delivered'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : d.status === 'Assigned'
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <div className="flex items-center gap-3.5 my-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#050816] border border-white/10 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={d.productImage || '/images/products/rolex-submariner.png'}
                    alt={d.productName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-white text-sm truncate">{d.productName}</h4>
                  <p className="text-xs text-amber-400 font-bold mt-0.5">{d.amount}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">Customer: {d.customer}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#050816] border border-white/5 space-y-1 text-xs text-gray-300">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{d.address}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                  <span>Distance: {d.distance}</span>
                  <span className="text-cyan-400 font-bold">Secured Luxury Transit</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${d.customerPhone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Customer</span>
              </a>

              {d.status !== 'Delivered' ? (
                <button
                  type="button"
                  onClick={() => onOpenOtpModal && onOpenOtpModal(d)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Enter OTP</span>
                </button>
              ) : (
                <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedDeliveriesModule;
