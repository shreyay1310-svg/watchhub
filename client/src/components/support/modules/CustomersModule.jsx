import React, { useState } from 'react';
import {
  Search,
  User,
  Star,
  ShoppingBag,
  LifeBuoy,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export const CustomersModule = ({
  customers = [],
  setCustomers,
  onOpenCreateTicketForCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [newNote, setNewNote] = useState('');

  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      cust.name?.toLowerCase().includes(q) ||
      cust.email?.toLowerCase().includes(q) ||
      cust.phone?.toLowerCase().includes(q) ||
      cust.city?.toLowerCase().includes(q);

    const matchesTier =
      tierFilter === 'All' || cust.tier?.toLowerCase() === tierFilter.toLowerCase();

    return matchesSearch && matchesTier;
  });

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCustomer) return;
    const noteObj = {
      id: `note_${Date.now()}`,
      author: 'Pooja Sharma',
      text: newNote.trim(),
      date: 'Just now',
    };

    const updated = customers.map((c) => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          internalNotes: [...(c.internalNotes || []), noteObj],
        };
      }
      return c;
    });

    setCustomers(updated);
    setSelectedCustomer({
      ...selectedCustomer,
      internalNotes: [...(selectedCustomer.internalNotes || []), noteObj],
    });
    setNewNote('');
  };

  const getTierBadge = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
      case 'gold':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'silver':
        return 'bg-[#94A3B8]/15 text-[#94A3B8] border-[#94A3B8]/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Customer 360 Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {customers.length} Profiles
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Holistic view of luxury timepiece collectors, order histories, tickets & lifetime spend
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Total Registered Clients</span>
          <p className="text-2xl font-bold text-white mt-1">14,820</p>
          <div className="flex items-center gap-1.5 text-xs text-[#10B981] mt-2 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% new collectors this quarter</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">VIP Concierge Collectors</span>
          <p className="text-2xl font-bold text-[#E7B43F] mt-1">1,420</p>
          <div className="flex items-center gap-1.5 text-xs text-[#A7B1C2] mt-2">
            <span>Spend &gt; ₹5,00,000 threshold</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Active Support Cases</span>
          <p className="text-2xl font-bold text-[#00D9E8] mt-1">128</p>
          <div className="flex items-center gap-1.5 text-xs text-[#10B981] mt-2 font-semibold">
            <span>98.2% on-time SLA response</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Average CSAT Score</span>
          <p className="text-2xl font-bold text-white mt-1">4.9 / 5.0</p>
          <div className="flex items-center gap-1 text-xs text-[#E7B43F] mt-2 font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Based on 3,450 client ratings</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collectors by name, email, phone, city..."
            className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
          />
        </div>

        <div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full bg-[#111729] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
          >
            <option value="All">All Membership Tiers</option>
            <option value="Platinum">Platinum Concierge</option>
            <option value="Gold">Gold Member</option>
            <option value="Silver">Silver Member</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#091426] border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                <th className="py-3.5 px-4 font-semibold">City</th>
                <th className="py-3.5 px-4 font-semibold">VIP Tier</th>
                <th className="py-3.5 px-4 font-semibold">Lifetime Spend</th>
                <th className="py-3.5 px-4 font-semibold">Total Orders</th>
                <th className="py-3.5 px-4 font-semibold">Support Tickets</th>
                <th className="py-3.5 px-4 font-semibold text-right">Profile 360</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-[#64748B]">
                    No customer profiles found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-[#070918]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/30 flex items-center justify-center font-bold text-white text-xs">
                          {cust.name ? cust.name[0] : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-[#00D9E8] transition-colors">
                            {cust.name}
                          </p>
                          <p className="text-[10px] text-[#64748B]">Member #{cust.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2]">
                      <p className="text-white">{cust.email}</p>
                      <p className="text-[10px] text-[#64748B]">{cust.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2]">{cust.city || 'Mumbai, IN'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getTierBadge(
                          cust.tier
                        )}`}
                      >
                        {cust.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#E7B43F]">
                      ₹{cust.totalSpend?.toLocaleString() || '1,50,000'}
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">
                      {cust.totalOrders || 1} Orders
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium">{cust.ticketCount || 1}</span>
                      {cust.openTickets > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 font-bold">
                          {cust.openTickets} Open
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-bold text-[11px] transition-colors border border-[#00D9E8]/30"
                      >
                        View 360
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360 Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-4xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#252D42]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center font-bold text-white text-lg">
                  {selectedCustomer.name ? selectedCustomer.name[0] : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTierBadge(
                        selectedCustomer.tier
                      )}`}
                    >
                      {selectedCustomer.tier} Concierge
                    </span>
                  </div>
                  <p className="text-xs text-[#A7B1C2]">{selectedCustomer.email} • {selectedCustomer.phone}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#64748B] hover:text-white p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-2 space-y-6 custom-scrollbar mt-4">
              {/* Collector Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#111729] border border-[#252D42]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Lifetime Spend</span>
                  <p className="text-base font-bold text-[#E7B43F] mt-0.5">
                    ₹{selectedCustomer.totalSpend?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#111729] border border-[#252D42]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Total Orders</span>
                  <p className="text-base font-bold text-white mt-0.5">{selectedCustomer.totalOrders} Timepieces</p>
                </div>
                <div className="p-3 rounded-xl bg-[#111729] border border-[#252D42]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Support Tickets</span>
                  <p className="text-base font-bold text-[#00D9E8] mt-0.5">{selectedCustomer.ticketCount} Cases</p>
                </div>
                <div className="p-3 rounded-xl bg-[#111729] border border-[#252D42]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Member Since</span>
                  <p className="text-base font-bold text-white mt-0.5">{selectedCustomer.joined || 'March 2024'}</p>
                </div>
              </div>

              {/* Timepiece Order History */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#00D9E8]" />
                  Purchased Timepieces & Orders
                </h4>
                <div className="space-y-2">
                  {(selectedCustomer.recentOrders || [
                    {
                      orderId: 'WH-ORD-9024',
                      watch: 'Rolex Submariner Date 41mm',
                      price: '₹1,25,000',
                      status: 'Delivered',
                      date: '12 Nov 2026',
                    },
                    {
                      orderId: 'WH-ORD-8810',
                      watch: 'Omega Speedmaster Professional',
                      price: '₹84,000',
                      status: 'Delivered',
                      date: '28 Aug 2026',
                    },
                  ]).map((order, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#111729] border border-[#252D42] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#00D9E8]">#{order.orderId}</span>
                          <span className="font-semibold text-white">{order.watch}</span>
                        </div>
                        <p className="text-[10px] text-[#A7B1C2] mt-0.5">Purchased on {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#E7B43F]">{order.price}</p>
                        <span className="text-[10px] font-semibold text-[#10B981]">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Concierge Notes */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E7B43F]" />
                  Concierge & Preference Notes
                </h4>
                <div className="space-y-2 mb-3">
                  {(selectedCustomer.internalNotes || [
                    {
                      id: 'n1',
                      author: 'Pooja Sharma',
                      text: 'Prefers stainless steel bracelets sized to 7.25 inches. Always requests BlueDart Critical Express delivery.',
                      date: '10 Nov 2026',
                    },
                  ]).map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-[#070918] border border-[#252D42] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[#A7B1C2]">
                        <span className="font-semibold text-[#E7B43F]">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-white/90">{note.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add concierge note for this collector..."
                    className="flex-1 bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-[#00D9E8] text-[#070918] font-bold text-xs rounded-xl hover:bg-[#00B4D8] transition-colors cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersModule;
