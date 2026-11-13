import React, { useState } from 'react';
import {
  WATCH_TYPES,
  DIAL_CONFIG,
  CASE_CONFIG,
  STRAP_CONFIG,
  MOVEMENT_CONFIG,
  FEATURES_CONFIG,
} from '../../../data/customWatchData';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Settings,
  DollarSign,
  Search,
  Filter,
  Check,
  Eye,
  FileText,
  Truck,
} from 'lucide-react';

export const CustomizationManagementModule = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'pricing', 'compatibility'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock initial bespoke orders for admin management
  const [orders, setOrders] = useState([
    {
      id: 'BESPOKE-9401',
      customer: 'Dr. Vikram Malhotra',
      email: 'vikram.m@gmail.com',
      date: '13 Nov 2026, 02:40 PM',
      watchType: 'Automatic Watch (42mm)',
      specs: 'Sunburst Navy Blue Dial • Grade 5 Titanium Case • Italian Brown Leather (22mm) • Sapphire Crystal',
      engraving: '"V.M. • 2026 • Per Aspera Ad Astra"',
      status: 'Pending Review',
      calculatedPrice: 24799,
      approvedQuote: 24799,
      deliveryTarget: '21 Nov 2026',
    },
    {
      id: 'BESPOKE-9402',
      customer: 'Ananya Deshmukh',
      email: 'ananya.d@outlook.com',
      date: '13 Nov 2026, 11:15 AM',
      watchType: 'Skeleton Watch (38mm)',
      specs: 'Skeleton Dial • 18K Rose Gold-Plated Case • Milanese Mesh (18mm) • Exhibition Back Case',
      engraving: '"A.D. • Forever Yours"',
      status: 'Component Milling',
      calculatedPrice: 31299,
      approvedQuote: 31299,
      deliveryTarget: '24 Nov 2026',
    },
    {
      id: 'BESPOKE-9403',
      customer: 'Sameer Sen',
      email: 'sameer.sen@techcorp.in',
      date: '12 Nov 2026, 05:20 PM',
      watchType: 'Chronograph Watch (44mm)',
      specs: 'Matte Black Dial • Black 316L Case • FKM Diver Rubber (24mm) • Chrono Sub-Dials • 100M Water Res.',
      engraving: '"S.S. 007"',
      status: 'Dial Crafting',
      calculatedPrice: 19899,
      approvedQuote: 19899,
      deliveryTarget: '19 Nov 2026',
    },
    {
      id: 'BESPOKE-9404',
      customer: 'Pooja Bhatt',
      email: 'pooja.b@gmail.com',
      date: '11 Nov 2026, 04:00 PM',
      watchType: 'Minimalist Watch (34mm)',
      specs: 'Glossy White Dial • Silver Case • Tan Leather (16mm) • Roman Numerals',
      engraving: '"Love, 2026"',
      status: 'Quality Passed & Shipped',
      calculatedPrice: 11299,
      approvedQuote: 11299,
      deliveryTarget: '15 Nov 2026',
    },
  ]);

  const handleApproveOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'Approved & Scheduled for Milling' }
          : o
      )
    );
  };

  const handleRejectOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Rejected (Incompatible Specs)' } : o
      )
    );
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.watchType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status.includes(statusFilter);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-7 font-poppins">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-watch-gold/20 flex items-center justify-center text-amber-900 font-bold text-sm">
              ✏️
            </span>
            <h2 className="text-xl font-bold text-gray-900">Custom Watch Studio Management</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Review custom customer designs, approve bespoke quotations, configure component pricing & production stages.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#0B121C] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Custom Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-[#0B121C] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Component Pricing
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          TAB 1: CUSTOM ORDERS LIST & APPROVAL
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div className="mt-5 space-y-4">
          {/* Search & Status Filter Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer or watch type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-watch-gold"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              {['All', 'Pending Review', 'Milling', 'Dial Crafting', 'Shipped'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-amber-100 text-amber-950 border border-watch-gold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B121C] text-gray-300 text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Watch Specifications</th>
                  <th className="py-3 px-4">Laser Engraving</th>
                  <th className="py-3 px-4">Estimated Quote</th>
                  <th className="py-3 px-4">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No custom watch orders matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <span className="text-watch-gold block">{o.id}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{o.date}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block">{o.customer}</span>
                        <span className="text-[10px] text-gray-400">{o.email}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-gray-900 block text-[11.5px]">{o.watchType}</span>
                        <span className="text-[10.5px] text-gray-500 line-clamp-2">{o.specs}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-amber-900 font-bold">
                        {o.engraving}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-gray-900 text-sm">
                          ₹{o.calculatedPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-600 block font-bold">Direct Approved</span>
                      </td>

                      <td className="py-3.5 px-4 space-y-1.5">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="text-[11px] font-bold p-1 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none block w-full"
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Approved & Scheduled for Milling">Approved & Milling</option>
                          <option value="Component Milling">Component Milling</option>
                          <option value="Dial Crafting">Dial Crafting</option>
                          <option value="Hand Assembly">Hand Assembly</option>
                          <option value="Quality Passed & Shipped">Quality Passed & Shipped</option>
                          <option value="Rejected (Incompatible Specs)">Rejected</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApproveOrder(o.id)}
                            className="p-1 px-2 rounded-md bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectOrder(o.id)}
                            className="p-1 px-2 rounded-md bg-red-100 text-red-700 font-bold text-[10px] hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB 2: COMPONENT PRICING CONFIGURATOR
          ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pricing' && (
        <div className="mt-5 space-y-6">
          <p className="text-xs text-gray-500">
            Real-time component price configuration. Changing values updates the Customer Studio Price Calculator immediately.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Watch Type Base Pricing */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
              <h4 className="text-xs font-bold text-gray-900 pb-2 border-b border-gray-200 mb-3 flex items-center justify-between">
                <span>Architecture Base Pricing (₹)</span>
                <span className="text-[10px] text-emerald-600 font-bold">8 Supported Types</span>
              </h4>
              <div className="space-y-2">
                {WATCH_TYPES.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <span>{t.icon}</span> {t.name}
                    </span>
                    <span className="font-mono font-bold text-gray-900">₹{t.basePrice.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case & Movement Upgrades */}
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
              <h4 className="text-xs font-bold text-gray-900 pb-2 border-b border-gray-200 mb-3 flex items-center justify-between">
                <span>Case & Movement Upgrades (₹)</span>
                <span className="text-[10px] text-amber-800 font-bold">Materials & Calibers</span>
              </h4>
              <div className="space-y-2">
                {CASE_CONFIG.materials.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-800">{m.name} ({m.grade})</span>
                    <span className="font-mono font-bold text-gray-900">
                      {m.price > 0 ? `+₹${m.price.toLocaleString('en-IN')}` : 'Included'}
                    </span>
                  </div>
                ))}
                {MOVEMENT_CONFIG.map((mv) => (
                  <div key={mv.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                      <span>{mv.icon}</span> {mv.name}
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {mv.price > 0 ? `+₹${mv.price.toLocaleString('en-IN')}` : 'Included'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationManagementModule;
