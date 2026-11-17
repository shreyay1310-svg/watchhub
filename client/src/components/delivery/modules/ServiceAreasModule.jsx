import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Search,
  Plus,
  Truck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Edit2,
  X,
  Compass,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ServiceAreasModule = ({
  serviceAreas = [],
  onAddArea = () => {},
  onToggleAreaStatus = () => {},
}) => {
  const safeAreas = Array.isArray(serviceAreas) ? serviceAreas : [];
  const [showAddModal, setShowAddModal] = useState(false);
  const [pinSearchQuery, setPinSearchQuery] = useState('');
  const [serviceCheckResult, setServiceCheckResult] = useState(null);

  // New Area Form
  const [newArea, setNewArea] = useState({
    areaName: '',
    city: '',
    state: '',
    pincodes: '',
    availability: 'Same-Day & 2-Hour Express',
    assignedPartner: 'Blue Dart & Shadowfax',
    assignedRidersCount: 4,
    avgEta: '1 - 3 Hours',
    deliveryCharge: 'Free (>₹10,000) / ₹150 Standard',
    hubAddress: '',
  });

  // Handle PIN / City Serviceability Check
  const handleCheckServiceability = (e) => {
    e.preventDefault();
    if (!pinSearchQuery.trim()) return;
    const q = pinSearchQuery.trim().toLowerCase();

    // Look for matching area by city name or pincode substring
    const matched = safeAreas.find(
      (a) =>
        a?.city?.toLowerCase().includes(q) ||
        a?.pincodes?.toLowerCase().includes(q) ||
        a?.areaName?.toLowerCase().includes(q)
    );

    if (matched && matched.status === 'Active') {
      setServiceCheckResult({
        available: true,
        area: matched.areaName,
        city: matched.city,
        eta: matched.avgEta,
        partners: matched.assignedPartner,
        charges: matched.deliveryCharge,
      });
    } else {
      setServiceCheckResult({
        available: false,
        query: pinSearchQuery,
        reason: 'Service currently expanding to this PIN code / city. Priority air courier (3-5 days) available.',
      });
    }
  };

  const handleAddAreaSubmit = (e) => {
    e.preventDefault();
    if (!newArea.areaName || !newArea.city) return;
    onAddArea({
      areaId: `SA-${newArea.city.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      ...newArea,
      status: 'Active',
    });
    setShowAddModal(false);
    setNewArea({
      areaName: '',
      city: '',
      state: '',
      pincodes: '',
      availability: 'Same-Day & 2-Hour Express',
      assignedPartner: 'Blue Dart & Shadowfax',
      assignedRidersCount: 4,
      avgEta: '1 - 3 Hours',
      deliveryCharge: 'Free (>₹10,000) / ₹150 Standard',
      hubAddress: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & TOP ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Service Areas & PIN Code Logistics Coverage
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Configure regional delivery hubs, PIN code eligibility matrices, hyper-local speed SLAs and delivery surcharges.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#7310FF] hover:to-[#9B10FF] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#6500FF]/30 transition-all cursor-pointer border border-[#8B00FF]/50"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Area</span>
        </button>
      </div>

      {/* 2. LIVE SERVICEABILITY PIN CODE CHECKER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#11172C] via-[#081529] to-[#11172C] border border-[#28334B] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00D5FF]" />
            <h3 className="font-serif font-bold text-sm text-white">
              Instant Customer PIN Code Serviceability Checker
            </h3>
          </div>
          <span className="text-xs text-[#A7B1C2]">Real-time carrier SLA validation</span>
        </div>

        <form onSubmit={handleCheckServiceability} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={pinSearchQuery}
              onChange={(e) => setPinSearchQuery(e.target.value)}
              placeholder="Enter customer PIN code (e.g. 110001, 122009, 400018) or City name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#081529] border border-[#28334B] text-xs text-white placeholder-[#A7B1C2]/60 focus:outline-none focus:border-[#6500FF]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold text-xs shadow-md shadow-[#6500FF]/30 cursor-pointer"
          >
            Check Serviceability
          </button>
        </form>

        {serviceCheckResult && (
          <div
            className={`p-4 rounded-xl border text-xs animate-fade-in ${
              serviceCheckResult.available
                ? 'bg-[#00C98B]/10 border-[#00C98B]/40 text-white'
                : 'bg-[#FF4966]/10 border-[#FF4966]/40 text-white'
            }`}
          >
            {serviceCheckResult.available ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#00C98B]/20 text-[#00C98B] flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-[#00C98B]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#00C98B] text-sm block">
                      Service Fully Available • {serviceCheckResult.area}
                    </span>
                    <span className="text-[11px] text-[#A7B1C2]">
                      City: {serviceCheckResult.city} • Partners: {serviceCheckResult.partners}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[#A7B1C2] block text-[10px]">Speed SLA:</span>
                    <span className="text-[#00D5FF]">{serviceCheckResult.eta}</span>
                  </div>
                  <div>
                    <span className="text-[#A7B1C2] block text-[10px]">Charges:</span>
                    <span className="text-[#E9B94F]">{serviceCheckResult.charges}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF4966]/20 text-[#FF4966] flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-[#FF4966]" />
                </div>
                <div>
                  <span className="font-bold text-[#FF4966] text-sm block">
                    Hyperlocal Same-Day Unavailable for "{serviceCheckResult.query}"
                  </span>
                  <p className="text-[11px] text-[#A7B1C2] mt-0.5">{serviceCheckResult.reason}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. SERVICE AREA CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeAreas.map((area) => (
          <div
            key={area.areaId}
            className="p-5 rounded-2xl bg-[#11172C] border border-[#28334B] hover:border-[#6500FF]/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#28334B] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center text-xs font-bold font-mono">
                    {area.areaId.slice(3, 6)}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#A7B1C2]">{area.areaId}</span>
                    <h3 className="font-bold text-sm text-white leading-tight">{area.city}</h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    area.status === 'Active'
                      ? 'bg-[#00C98B]/20 text-[#00C98B] border border-[#00C98B]/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {area.status}
                </span>
              </div>

              <h4 className="font-serif font-bold text-base text-white mb-1.5">
                {area.areaName}
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#081529] border border-[#28334B]">
                  <span className="text-[#A7B1C2] text-[10px] block font-semibold">Covered PIN Codes:</span>
                  <p className="font-mono text-[11px] text-[#00D5FF] mt-0.5 leading-relaxed">{area.pincodes}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#081529] border border-[#28334B]">
                    <span className="text-[#A7B1C2] text-[10px] block">Availability SLA</span>
                    <span className="font-bold text-white text-[11px] block mt-0.5">{area.availability}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#081529] border border-[#28334B]">
                    <span className="text-[#A7B1C2] text-[10px] block">Riders Allocated</span>
                    <span className="font-bold text-[#E9B94F] text-[11px] block mt-0.5">{area.assignedRidersCount} Active Riders</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#081529] border border-[#28334B]">
                  <span className="text-[#A7B1C2] text-[10px] block">Distribution Hub:</span>
                  <p className="text-white text-[11px] truncate mt-0.5" title={area.hubAddress}>
                    {area.hubAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#28334B] mt-4 flex items-center justify-between">
              <div>
                <span className="text-[#A7B1C2] text-[10px] block">Delivery Fee</span>
                <span className="text-xs font-bold text-[#00C98B]">{area.deliveryCharge}</span>
              </div>

              <button
                onClick={() => onToggleAreaStatus(area.areaId)}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#A7B1C2] hover:text-white border border-[#28334B]"
              >
                {area.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD SERVICE AREA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#11172C] border border-[#28334B] rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#28334B]">
              <h3 className="font-serif font-bold text-base text-white">
                Register New Service Area Corridor
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAreaSubmit} className="py-4 space-y-3 text-xs">
              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Area Name / Corridor</label>
                <input
                  type="text"
                  required
                  value={newArea.areaName}
                  onChange={(e) => setNewArea({ ...newArea, areaName: e.target.value })}
                  placeholder="e.g. Pune Central & Koregaon Park Corridor"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newArea.city}
                    onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                    placeholder="Pune"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">State</label>
                  <input
                    type="text"
                    value={newArea.state}
                    onChange={(e) => setNewArea({ ...newArea, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Covered PIN Codes (Comma-separated)</label>
                <textarea
                  rows="2"
                  value={newArea.pincodes}
                  onChange={(e) => setNewArea({ ...newArea, pincodes: e.target.value })}
                  placeholder="411001, 411004, 411006, 411014"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Availability SLA</label>
                  <input
                    type="text"
                    value={newArea.availability}
                    onChange={(e) => setNewArea({ ...newArea, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A7B1C2] font-semibold block mb-1">Assigned Riders Count</label>
                  <input
                    type="number"
                    value={newArea.assignedRidersCount}
                    onChange={(e) => setNewArea({ ...newArea, assignedRidersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A7B1C2] font-semibold block mb-1">Local Logistics Hub Address</label>
                <input
                  type="text"
                  value={newArea.hubAddress}
                  onChange={(e) => setNewArea({ ...newArea, hubAddress: e.target.value })}
                  placeholder="e.g. WatchHub Pune Micro-Hub, FC Road"
                  className="w-full px-3 py-2 rounded-xl bg-[#081529] border border-[#28334B] text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#28334B]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A7B1C2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] text-white font-bold"
                >
                  Save Service Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreasModule;
