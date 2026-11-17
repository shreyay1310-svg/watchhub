import React, { useState } from 'react';
import {
  Users,
  Truck,
  Plus,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Bike,
  ShieldCheck,
  Edit2,
  X,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DeliveryPartnersModule = ({
  couriers,
  riders,
  onAddPartner,
  onAddRider,
  onToggleRiderStatus,
  onTogglePartnerStatus,
}) => {
  const [activeTab, setActiveTab] = useState('partners'); // 'partners' | 'riders'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);

  // New Partner Form
  const [newPartner, setNewPartner] = useState({
    name: '',
    code: '',
    contactPerson: '',
    phone: '',
    email: '',
    serviceAreas: 'Tier 1 & Metros',
    sla: '24-48 Hours',
    rating: 4.8,
  });

  // New Rider Form
  const [newRider, setNewRider] = useState({
    name: '',
    phone: '',
    email: '',
    area: 'South Delhi & Connaught Place',
    city: 'New Delhi',
    vehicleType: 'Electric Scooter',
    vehicleNumber: '',
  });

  // KPI Calculations
  const totalPartners = couriers.length;
  const activePartners = couriers.filter((c) => c.status === 'Active').length;
  const availableRiders = riders.filter((r) => r.status === 'Available').length;
  const busyRiders = riders.filter((r) => r.status === 'On Delivery' || r.status === 'Busy').length;
  const offlineRiders = riders.filter((r) => r.status === 'Offline').length;

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    if (!newPartner.name) return;
    onAddPartner({
      id: `cp_${Date.now()}`,
      ...newPartner,
      logo: '🚚',
      totalShipments: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
      status: 'Active',
    });
    setShowAddPartnerModal(false);
    setNewPartner({ name: '', code: '', contactPerson: '', phone: '', email: '', serviceAreas: 'Tier 1 & Metros', sla: '24-48 Hours', rating: 4.8 });
  };

  const handleRiderSubmit = (e) => {
    e.preventDefault();
    if (!newRider.name) return;
    onAddRider({
      id: `rd_${Date.now()}`,
      empId: `WH-RD-${Math.floor(100 + Math.random() * 900)}`,
      ...newRider,
      status: 'Available',
      activeOrders: 0,
      completedToday: 0,
      failedAttempts: 0,
      successRate: '100%',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      currentLocation: {
        lat: 28.6139,
        lng: 77.2090,
        areaName: newRider.area,
        lastPing: 'Just now',
      },
    });
    setShowAddRiderModal(false);
    setNewRider({ name: '', phone: '', email: '', area: 'South Delhi', city: 'New Delhi', vehicleType: 'Electric Scooter', vehicleNumber: '' });
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Delivery Partners & Fleet Fleet Management
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Manage national courier integrations (Blue Dart, Delhivery, DTDC, etc.) and in-house city riders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddRiderModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#28334B] text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Bike className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>Add Rider</span>
          </button>

          <button
            onClick={() => setShowAddPartnerModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer border border-[#8B00FF]/50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Courier Partner</span>
          </button>
        </div>
      </div>

      {/* 2. FIVE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Courier Partners</span>
          <span className="text-2xl font-bold text-white block mt-1">{totalPartners}</span>
          <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">{activePartners} Active Integrations</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Total Riders Fleet</span>
          <span className="text-2xl font-bold text-[#6500FF] block mt-1">{riders.length}</span>
          <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">In-house Personnel</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Available Riders</span>
          <span className="text-2xl font-bold text-[#00C98B] block mt-1">{availableRiders}</span>
          <span className="text-[10px] text-[#00C98B] mt-0.5 block">Ready for Dispatch</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">On Delivery / Busy</span>
          <span className="text-2xl font-bold text-[#00D5FF] block mt-1">{busyRiders}</span>
          <span className="text-[10px] text-[#00D5FF] mt-0.5 block">Active on Street</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Offline Riders</span>
          <span className="text-2xl font-bold text-[#A7B1C2] block mt-1">{offlineRiders}</span>
          <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">Off Duty</span>
        </div>
      </div>

      {/* 3. SUB-NAVIGATION TABS: PARTNERS VS RIDERS */}
      <div className="flex items-center gap-2 border-b border-[#28334B] pb-1">
        <button
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold text-xs transition-colors cursor-pointer border-b-2 ${
            activeTab === 'partners'
              ? 'border-[#00D5FF] text-[#00D5FF] bg-white/5'
              : 'border-transparent text-[#A7B1C2] hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Courier Partners ({couriers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('riders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold text-xs transition-colors cursor-pointer border-b-2 ${
            activeTab === 'riders'
              ? 'border-[#6500FF] text-[#00D5FF] bg-white/5'
              : 'border-transparent text-[#A7B1C2] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>City Riders Fleet ({riders.length})</span>
        </button>
      </div>

      {/* TAB A: COURIER PARTNERS TABLE */}
      {activeTab === 'partners' && (
        <div className="rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#081529] border-b border-[#28334B] text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3.5 pl-4">Partner</th>
                  <th className="py-3.5 px-3">Partner ID & Code</th>
                  <th className="py-3.5 px-3">Contact Person</th>
                  <th className="py-3.5 px-3">Phone & Email</th>
                  <th className="py-3.5 px-3">Service Areas</th>
                  <th className="py-3.5 px-3">Total Shipments</th>
                  <th className="py-3.5 px-3">Success Rate</th>
                  <th className="py-3.5 px-3">Rating</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#28334B] text-white">
                {couriers.map((partner) => {
                  const successRate = partner.totalShipments > 0
                    ? Math.round((partner.successfulDeliveries / partner.totalShipments) * 100)
                    : 100;
                  return (
                    <tr key={partner.id} className="hover:bg-white/5 transition-colors">
                      {/* Logo & Name */}
                      <td className="py-3 pl-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{partner.logo}</span>
                          <div>
                            <span className="font-bold text-white block">{partner.name}</span>
                            <span className="text-[10px] text-[#A7B1C2]">{partner.sla}</span>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#00D5FF] whitespace-nowrap">
                        {partner.code}
                      </td>

                      {/* Contact Person */}
                      <td className="py-3 px-3 font-medium text-white whitespace-nowrap">
                        {partner.contactPerson}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3 text-[#A7B1C2] whitespace-nowrap text-[11px]">
                        <div>{partner.phone}</div>
                        <div className="text-[10px] text-gray-400">{partner.email}</div>
                      </td>

                      {/* Service Areas */}
                      <td className="py-3 px-3 text-white max-w-[200px] truncate" title={partner.serviceAreas}>
                        {partner.serviceAreas}
                      </td>

                      {/* Shipments */}
                      <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                        {partner.totalShipments}
                      </td>

                      {/* Success Rate */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-bold text-[#00C98B]">{successRate}%</span>
                        <span className="text-[10px] text-[#A7B1C2] block">({partner.successfulDeliveries} done)</span>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[#E9B94F] font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{partner.rating}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            partner.status === 'Active'
                              ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {partner.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 pr-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onTogglePartnerStatus(partner.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                            partner.status === 'Active'
                              ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                              : 'bg-[#00C98B]/10 text-[#00C98B] border-[#00C98B]/30 hover:bg-[#00C98B]/20'
                          }`}
                        >
                          {partner.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB B: CITY RIDERS FLEET TABLE */}
      {activeTab === 'riders' && (
        <div className="rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#081529] border-b border-[#28334B] text-[11px] font-bold text-[#A7B1C2] uppercase tracking-wider whitespace-nowrap">
                  <th className="py-3.5 pl-4">Rider</th>
                  <th className="py-3.5 px-3">Emp ID</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">Assigned City & Area</th>
                  <th className="py-3.5 px-3">Vehicle</th>
                  <th className="py-3.5 px-3">Availability</th>
                  <th className="py-3.5 px-3">Active Drops</th>
                  <th className="py-3.5 px-3">Completed Today</th>
                  <th className="py-3.5 px-3">Success Rate</th>
                  <th className="py-3.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#28334B] text-white">
                {riders.map((rider) => (
                  <tr key={rider.id} className="hover:bg-white/5 transition-colors">
                    {/* Rider Photo & Name */}
                    <td className="py-3 pl-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={rider.avatar}
                          alt={rider.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#28334B]"
                        />
                        <div>
                          <span className="font-bold text-white block">{rider.name}</span>
                          <span className="text-[10px] text-[#A7B1C2]">{rider.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Emp ID */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#00D5FF] whitespace-nowrap">
                      {rider.empId}
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-3 text-[#A7B1C2] whitespace-nowrap">
                      {rider.phone}
                    </td>

                    {/* Area */}
                    <td className="py-3 px-3 max-w-[180px]">
                      <span className="font-semibold text-white block">{rider.city}</span>
                      <span className="text-[11px] text-[#A7B1C2] truncate block" title={rider.area}>
                        {rider.area}
                      </span>
                    </td>

                    {/* Vehicle */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-white block font-medium">{rider.vehicleType}</span>
                      <span className="text-[10px] text-[#E9B94F] font-mono">{rider.vehicleNumber}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rider.status === 'Available'
                            ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30'
                            : rider.status === 'On Delivery'
                            ? 'bg-[#00D5FF]/20 text-[#00D5FF] border border-[#00D5FF]/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}
                      >
                        {rider.status}
                      </span>
                    </td>

                    {/* Active Deliveries */}
                    <td className="py-3 px-3 font-bold text-[#E9B94F] whitespace-nowrap">
                      {rider.activeOrders}
                    </td>

                    {/* Completed Today */}
                    <td className="py-3 px-3 font-bold text-[#00C98B] whitespace-nowrap">
                      {rider.completedToday}
                    </td>

                    {/* Success Rate */}
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {rider.successRate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onToggleRiderStatus(rider.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-[#00D5FF] border border-[#28334B] transition-colors cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD COURIER PARTNER */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
              <h3 className="font-serif font-bold text-base text-white">
                Add Courier Integration Partner
              </h3>
              <button onClick={() => setShowAddPartnerModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePartnerSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Partner Name</label>
                <input
                  type="text"
                  required
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="e.g. FedEx Priority Express"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Partner Code</label>
                  <input
                    type="text"
                    required
                    value={newPartner.code}
                    onChange={(e) => setNewPartner({ ...newPartner, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FEDEX"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Guaranteed SLA</label>
                  <input
                    type="text"
                    value={newPartner.sla}
                    onChange={(e) => setNewPartner({ ...newPartner, sla: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={newPartner.contactPerson}
                  onChange={(e) => setNewPartner({ ...newPartner, contactPerson: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                    placeholder="+91 98..."
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Operations Email</label>
                  <input
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                    placeholder="ops@partner.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold"
                >
                  Register Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RIDER */}
      {showAddRiderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#28334B]">
              <h3 className="font-serif font-bold text-base text-white">
                Add In-House Delivery Rider
              </h3>
              <button onClick={() => setShowAddRiderModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRiderSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Rider Full Name</label>
                <input
                  type="text"
                  required
                  value={newRider.name}
                  onChange={(e) => setNewRider({ ...newRider, name: e.target.value })}
                  placeholder="e.g. Manpreet Singh"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newRider.phone}
                    onChange={(e) => setNewRider({ ...newRider, phone: e.target.value })}
                    placeholder="+91 98..."
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Assigned City</label>
                  <input
                    type="text"
                    value={newRider.city}
                    onChange={(e) => setNewRider({ ...newRider, city: e.target.value })}
                    placeholder="New Delhi"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Assigned Delivery Corridor / Area</label>
                <input
                  type="text"
                  value={newRider.area}
                  onChange={(e) => setNewRider({ ...newRider, area: e.target.value })}
                  placeholder="e.g. Connaught Place & Chanakyapuri"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Vehicle Type</label>
                  <select
                    value={newRider.vehicleType}
                    onChange={(e) => setNewRider({ ...newRider, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  >
                    <option value="Electric Scooter">Electric Scooter (EV)</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Secure Van">Secure Van</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Vehicle Plate No.</label>
                  <input
                    type="text"
                    value={newRider.vehicleNumber}
                    onChange={(e) => setNewRider({ ...newRider, vehicleNumber: e.target.value.toUpperCase() })}
                    placeholder="DL 01 EV 1234"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowAddRiderModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold"
                >
                  Onboard Rider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartnersModule;
