import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Printer,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  FileText,
  ChevronRight,
  Filter,
  Check,
  ExternalLink,
  Plus,
  Compass,
  Box,
  BadgeCheck
} from 'lucide-react';

import { INITIAL_ASSIGNED_ORDERS, INITIAL_SHIPMENTS, INITIAL_RETURNS } from '../../../data/fulfillmentMockData';
import PickPackSubTab from '../../delivery/PickPackSubTab';
export const DeliveryModule = ({ activeSubTab = 'assigned_orders', onSubTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeSubTab);
  const [assignedOrders, setAssignedOrders] = useState(INITIAL_ASSIGNED_ORDERS);
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [returns, setReturns] = useState(INITIAL_RETURNS);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  // Workstation (Pick & Pack) state
  const [packOrder, setPackOrder] = useState(INITIAL_ASSIGNED_ORDERS[0]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannedMatched, setScannedMatched] = useState(false);
  const [qcState, setQcState] = useState({
    dialChecked: true,
    movementChecked: true,
    strapPolished: true,
    warrantyCardInserted: true,
    authenticitySealed: true
  });
  const [selectedBox, setSelectedBox] = useState('Luxury Wooden Box');
  const [packedSuccess, setPackedSuccess] = useState(false);

  // Tracking state
  const [selectedTrackingAWB, setSelectedTrackingAWB] = useState(INITIAL_SHIPMENTS[1]);
  const [trackInput, setTrackInput] = useState('');

  // Sync with prop if parent changes
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  const switchTab = (tab) => {
    setCurrentTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Barcode scanning simulation
  const handleBarcodeScan = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    if (barcodeInput.toLowerCase().includes(packOrder.sku.toLowerCase()) || barcodeInput.includes('WH') || barcodeInput.length >= 6) {
      setScannedMatched(true);
      alert(`✅ SKU Barcode "${barcodeInput}" verified! Watch matched with Order ${packOrder.id}.`);
    } else {
      alert(`⚠️ Barcode mismatch! Expected SKU: ${packOrder.sku}`);
    }
  };

  // Complete Packing action
  const handleCompletePacking = () => {
    setPackedSuccess(true);
    setTimeout(() => {
      // Remove from assigned and add to shipments
      const newShipment = {
        id: `#SHP-${Math.floor(1000 + Math.random() * 9000)}`,
        manifestId: 'MNF-BLU-20261104-01',
        orderId: packOrder.id,
        customer: packOrder.customer,
        destination: packOrder.city,
        courier: 'BlueDart Air Express',
        awb: `BLU-${Math.floor(10000000 + Math.random() * 90000000)}`,
        weight: '0.52 kg',
        status: 'Packed & Manifested',
        dispatchTime: 'Ready for Courier Handover',
        step: 2,
        eta: 'Delivery in 24-48 Hours'
      };
      setShipments([newShipment, ...shipments]);
      setAssignedOrders(assignedOrders.filter(o => o.id !== packOrder.id));
      alert(`🎉 Package sealed! AWB ${newShipment.awb} generated for ${packOrder.customer}. Handover manifest updated.`);
      setPackedSuccess(false);
      if (assignedOrders.length > 1) {
        setPackOrder(assignedOrders.find(o => o.id !== packOrder.id));
      }
    }, 1200);
  };

  // Advance shipment milestone for demo
  const handleAdvanceMilestone = (shpId) => {
    setShipments(shipments.map(s => {
      if (s.id === shpId) {
        const nextStep = Math.min(5, s.step + 1);
        const statusMap = {
          2: 'Packed & Manifested',
          3: 'In Transit',
          4: 'Out for Delivery',
          5: 'Delivered'
        };
        const updated = {
          ...s,
          step: nextStep,
          status: statusMap[nextStep] || s.status
        };
        if (selectedTrackingAWB?.id === s.id) {
          setSelectedTrackingAWB(updated);
        }
        return updated;
      }
      return s;
    }));
  };

  // Approve Return QC
  const handleApproveReturn = (retId) => {
    setReturns(returns.map(r => r.id === retId ? { ...r, actionStatus: 'QC Approved - Restocked', pickupStatus: 'Restocked to Inventory' } : r));
    alert(`✅ Return ${retId} approved! Watch passed physical inspection and has been reshelved in inventory.`);
  };

  const filteredAssigned = assignedOrders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.watch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || o.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Upper Module Sub-Tab Switcher Bar (Matches User Reference Screenshots) */}
      <div className="bg-[#10182D]/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => switchTab('assigned_orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'assigned_orders'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>📋</span> Assigned Orders
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
              {assignedOrders.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('pick_pack')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'pick_pack'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>📦</span> Pick & Pack Workstation
          </button>

          <button
            onClick={() => switchTab('shipments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'shipments'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>🚚</span> Shipments & Carrier Manifests
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full font-bold">
              {shipments.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('track_orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'track_orders'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>📍</span> Track Orders (AWB Timeline)
          </button>

          <button
            onClick={() => switchTab('returns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'returns'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>🔄</span> Returns & Cancellations
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full font-bold">
              {returns.length}
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-[#A6B1C8] font-semibold pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Fulfillment SLA: 98.6% On-Time</span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: ASSIGNED ORDERS (📋 Assigned Orders)
          ========================================================================= */}
      {currentTab === 'assigned_orders' && (
        <div className="space-y-5">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Pick Queue</span>
              <p className="text-2xl font-black text-[#F8FAFC] mt-1">{assignedOrders.length}</p>
              <span className="text-[10px] text-amber-600 font-bold">● Awaiting physical pick</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Urgent Express SLA</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {assignedOrders.filter(o => o.priority.includes('Urgent')).length}
              </p>
              <span className="text-[10px] text-rose-500 font-bold">⚡ Same-day dispatch required</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Active Pickers</span>
              <p className="text-2xl font-black text-blue-600 mt-1">4 Staff</p>
              <span className="text-[10px] text-blue-500 font-bold">● Vault & Standard zones</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Avg Pick Duration</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">14.2 min</p>
              <span className="text-[10px] text-emerald-500 font-bold">● Below 20m target</span>
            </div>
          </div>

          {/* Search, Filter & Bulk Assign Bar */}
          <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order #, customer, watch..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-white/15 text-xs outline-none focus:border-watch-gold"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="h-9 px-3 rounded-lg border border-white/15 text-xs font-semibold text-[#A6B1C8] outline-none"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent Express">Urgent Express</option>
                <option value="High">High</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('📄 Warehouse Pick List Generated for all 6 orders! Sent to Warehouse Thermal Printers.')}
                className="h-9 px-3.5 bg-white/5 hover:bg-gray-200 text-[#F8FAFC] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print Pick Sheets
              </button>
              <button
                onClick={() => {
                  alert('✅ All available staff auto-balanced across Vault and Packaging Bays.');
                }}
                className="h-9 px-3.5 bg-watch-navy-dark text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-black transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-watch-gold" /> Auto-Assign Pickers
              </button>
            </div>
          </div>

          {/* Assigned Orders Table */}
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1022]/80 text-[#A6B1C8] font-semibold uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Order ID & Destination</th>
                    <th className="py-3 px-4">Watch Item & SKU</th>
                    <th className="py-3 px-4">Storage Zone</th>
                    <th className="py-3 px-4">Priority & SLA</th>
                    <th className="py-3 px-4">Assigned Picker</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssigned.map((order) => (
                    <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#F8FAFC] block">{order.id}</span>
                        <span className="text-[11px] text-[#A6B1C8]">{order.customer} • {order.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{order.watch}</span>
                        <span className="font-mono text-[10px] text-gray-400">SKU: {order.sku} (Qty: {order.qty})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-[#A6B1C8] border border-white/10">
                          {order.zone}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                            order.priority.includes('Urgent')
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : order.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.priority}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-amber-500" /> {order.slaTime}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-[#F8FAFC]">
                          <span className="w-6 h-6 rounded-full bg-watch-navy-dark text-watch-gold text-[10px] flex items-center justify-center font-bold">
                            {order.assignedTo.charAt(0)}
                          </span>
                          <span>{order.assignedTo}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            setPackOrder(order);
                            switchTab('pick_pack');
                          }}
                          className="px-3 py-1.5 bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark font-extrabold rounded-lg text-xs flex items-center gap-1 transition-all shadow-sm"
                        >
                          <Package className="w-3.5 h-3.5" /> Start Packing
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

      {/* =========================================================================
          VIEW 2: PICK & PACK WORKSTATION (📦 Pick & Pack)
          ========================================================================= */}
      {currentTab === 'pick_pack' && (
        <PickPackSubTab
          packOrder={packOrder}
          barcodeInput={barcodeInput}
          setBarcodeInput={setBarcodeInput}
          handleBarcodeScan={handleBarcodeScan}
          scannedMatched={scannedMatched}
          selectedBox={selectedBox}
          setSelectedBox={setSelectedBox}
          qcState={qcState}
          setQcState={setQcState}
          handleCompletePacking={handleCompletePacking}
          packedSuccess={packedSuccess}
        />
      )}

      {/* =========================================================================
          VIEW 3: SHIPMENTS & CARRIER MANIFESTS (🚚 Shipments)
          ========================================================================= */}
      {currentTab === 'shipments' && (
        <div className="space-y-5">
          {/* Courier Carrier Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { courier: 'BlueDart Air', count: '14 Parcels', eta: 'Next Day Air', color: 'border-l-4 border-blue-600' },
              { courier: 'Delhivery Surface', count: '9 Parcels', eta: '48-72h Doorstep', color: 'border-l-4 border-rose-600' },
              { courier: 'Shadowfax Priority', count: '8 Parcels', eta: 'Hyperlocal 24h', color: 'border-l-4 border-amber-600' },
              { courier: 'DHL Global Express', count: '5 Parcels', eta: 'International / VIP', color: 'border-l-4 border-emerald-600' }
            ].map((c) => (
              <div key={c.courier} className={`bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm ${c.color}`}>
                <span className="text-xs font-bold text-[#F8FAFC] block">{c.courier}</span>
                <p className="text-xl font-extrabold text-[#F8FAFC] mt-1">{c.count}</p>
                <span className="text-[10px] text-[#A6B1C8] font-semibold">{c.eta}</span>
              </div>
            ))}
          </div>

          {/* Manifest Controls */}
          <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-xs font-bold text-[#F8FAFC]">Active Carrier Dispatch Manifests</h4>
              <p className="text-[11px] text-[#A6B1C8]">Official handover sheets signed by warehouse security & courier driver.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('📄 Manifest MNF-BLU-20261104-01 downloaded in PDF format.')}
                className="h-9 px-3.5 bg-white/5 hover:bg-gray-200 text-[#F8FAFC] text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Download Manifest PDF
              </button>
              <button
                onClick={() => alert('🚚 BlueDart & Delhivery dispatch vans notified. Pickup scheduled for 05:00 PM today.')}
                className="h-9 px-3.5 bg-watch-navy-dark text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-black"
              >
                <Truck className="w-3.5 h-3.5 text-watch-gold" /> Request Carrier Pickup Van
              </button>
            </div>
          </div>

          {/* Shipments Table */}
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1022]/80 text-[#A6B1C8] font-semibold uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Shipment & Order</th>
                    <th className="py-3 px-4">Customer & Destination</th>
                    <th className="py-3 px-4">Carrier & Tracking AWB</th>
                    <th className="py-3 px-4">Manifest ID</th>
                    <th className="py-3 px-4">Status & ETA</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shipments.map((shp) => (
                    <tr key={shp.id} className="hover:bg-[#0B1022]/80/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#F8FAFC] block">{shp.id}</span>
                        <span className="text-[10px] font-mono text-gray-400">Order: {shp.orderId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{shp.customer}</span>
                        <span className="text-[11px] text-[#A6B1C8]">{shp.destination}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{shp.courier}</span>
                        <span className="font-mono text-[11px] text-watch-gold font-bold">{shp.awb}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10.5px] text-[#A6B1C8] bg-white/5 px-2 py-0.5 rounded">
                          {shp.manifestId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          shp.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : shp.status === 'Out for Delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : shp.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {shp.status}
                        </span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">{shp.eta}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedTrackingAWB(shp);
                              switchTab('track_orders');
                            }}
                            className="px-2.5 py-1 bg-white/5 hover:bg-gray-200 text-[#F8FAFC] rounded font-semibold text-[11px] flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-rose-500" /> Track
                          </button>
                          {shp.step < 5 && (
                            <button
                              onClick={() => handleAdvanceMilestone(shp.id)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded font-bold text-[10px] border border-amber-200"
                              title="Simulate Next Transit Stage"
                            >
                              + Step
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: TRACK ORDERS (📍 Track Orders Timeline)
          ========================================================================= */}
      {currentTab === 'track_orders' && (
        <div className="space-y-5">
          {/* Search AWB Bar */}
          <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Compass className="w-5 h-5 text-watch-gold" /> Real-Time Courier Transit & Milestone Tracker
              </h4>
              <p className="text-xs text-[#A6B1C8] mt-0.5">
                Query BlueDart, Delhivery, Shadowfax or DHL live tracking endpoints.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-80">
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter AWB # (e.g. BLU-889124)"
                className="flex-1 h-9 px-3 rounded-lg border border-white/15 text-xs font-mono outline-none focus:border-watch-gold"
              />
              <button
                onClick={() => {
                  const match = shipments.find(s => s.awb.toLowerCase().includes(trackInput.toLowerCase()) || s.orderId.toLowerCase().includes(trackInput.toLowerCase()));
                  if (match) setSelectedTrackingAWB(match);
                  else alert('AWB not found in active batch.');
                }}
                className="px-3.5 h-9 bg-watch-navy-dark text-white rounded-lg text-xs font-bold hover:bg-black"
              >
                Track
              </button>
            </div>
          </div>

          {/* Active Selected Shipment Timeline Card */}
          {selectedTrackingAWB && (
            <div className="bg-[#10182D]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#F8FAFC] font-mono">
                      {selectedTrackingAWB.awb}
                    </span>
                    <span className="px-2.5 py-0.5 bg-watch-gold/20 text-watch-navy-dark text-xs font-bold rounded-full">
                      {selectedTrackingAWB.courier}
                    </span>
                  </div>
                  <p className="text-xs text-[#A6B1C8] mt-1">
                    Order Ref: <span className="font-bold text-[#F8FAFC]">{selectedTrackingAWB.orderId}</span> • Customer: <span className="font-bold text-[#F8FAFC]">{selectedTrackingAWB.customer}</span> ({selectedTrackingAWB.destination})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdvanceMilestone(selectedTrackingAWB.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Simulate Next Transit Milestone ⏩
                  </button>
                </div>
              </div>

              {/* 5-Step Visual Timeline */}
              <div className="relative">
                <div className="hidden sm:block absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-0">
                  <div
                    className="h-full bg-watch-gold transition-all duration-500"
                    style={{ width: `${((selectedTrackingAWB.step - 1) / 4) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                  {[
                    { step: 1, title: 'Order Picked', desc: 'Vault Mumbai', time: '02 Nov, 10:30 AM' },
                    { step: 2, title: 'Packed & Manifested', desc: 'Bench #04 QC Passed', time: '02 Nov, 02:15 PM' },
                    { step: 3, title: 'In Transit', desc: 'Air Cargo 6E-442 Hub', time: '03 Nov, 08:45 AM' },
                    { step: 4, title: 'Out for Delivery', desc: 'Rider: Manoj Sharma', time: '04 Nov, 09:00 AM' },
                    { step: 5, title: 'Delivered', desc: 'OTP Verified & Signed', time: selectedTrackingAWB.status === 'Delivered' ? '04 Nov, 02:30 PM' : 'Pending' }
                  ].map((milestone) => {
                    const isDone = selectedTrackingAWB.step >= milestone.step;
                    const isCurrent = selectedTrackingAWB.step === milestone.step;
                    return (
                      <div key={milestone.step} className="flex sm:flex-col items-center text-left sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                            isCurrent
                              ? 'bg-watch-navy-dark text-watch-gold ring-4 ring-amber-200'
                              : isDone
                              ? 'bg-watch-gold text-watch-navy-dark'
                              : 'bg-white/5 text-gray-400 border border-white/10'
                          }`}
                        >
                          {isDone ? <Check className="w-5 h-5" /> : milestone.step}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-watch-navy-dark' : isDone ? 'text-[#F8FAFC]' : 'text-gray-400'}`}>
                            {milestone.title}
                          </p>
                          <p className="text-[10.5px] text-[#A6B1C8]">{milestone.desc}</p>
                          <p className="text-[9.5px] text-gray-400 font-mono mt-0.5">{milestone.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Milestone Log Table */}
              <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 space-y-2">
                <h5 className="text-xs font-bold text-[#F8FAFC]">Carrier Scans & Waypoint History</h5>
                <div className="space-y-2 text-xs divide-y divide-gray-100">
                  <div className="pt-1.5 flex justify-between items-center text-[#A6B1C8]">
                    <span>📍 Package reached delivery facility (Lucknow Hub - Amausi)</span>
                    <span className="font-mono text-[10px] text-gray-400">04 Nov 2026, 07:15 AM</span>
                  </div>
                  <div className="pt-1.5 flex justify-between items-center text-[#A6B1C8]">
                    <span>✈️ Inter-facility linehaul departure from Mumbai Central Hub</span>
                    <span className="font-mono text-[10px] text-gray-400">03 Nov 2026, 11:45 PM</span>
                  </div>
                  <div className="pt-1.5 flex justify-between items-center text-[#A6B1C8]">
                    <span>📦 Manifest generated and package handed over to carrier</span>
                    <span className="font-mono text-[10px] text-gray-400">02 Nov 2026, 06:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 5: RETURNS & CANCELLATIONS (🔄 Returns & Cancellations)
          ========================================================================= */}
      {currentTab === 'returns' && (
        <div className="space-y-5">
          {/* Reverse Logistics Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Reverse Pickups</span>
              <p className="text-2xl font-black text-[#F8FAFC] mt-1">{returns.length}</p>
              <span className="text-[10px] text-amber-600 font-bold">● In transit to hub</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Pending Physical QC</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {returns.filter(r => r.actionStatus.includes('Pending')).length}
              </p>
              <span className="text-[10px] text-rose-500 font-bold">● Requires loupe inspection</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Restocked This Week</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">28 Units</p>
              <span className="text-[10px] text-emerald-500 font-bold">● 100% Mint condition</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Avg Return Turnaround</span>
              <p className="text-2xl font-black text-blue-600 mt-1">36 hrs</p>
              <span className="text-[10px] text-blue-500 font-bold">● From pickup to refund</span>
            </div>
          </div>

          {/* Returns Inspection Queue */}
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">Return Pickup & Inward Quality Desk</h4>
                <p className="text-[11px] text-[#A6B1C8]">Inspect returned watches before authorizing refund or restocking.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1022]/80 text-[#A6B1C8] font-semibold uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Return ID & Order</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Watch & Return Reason</th>
                    <th className="py-3 px-4">Reverse AWB</th>
                    <th className="py-3 px-4">Inspection QC Checklist</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {returns.map((ret) => (
                    <tr key={ret.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#F8FAFC] block">{ret.id}</span>
                        <span className="text-[10px] text-gray-400">Order: {ret.orderId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{ret.customer}</span>
                        <span className="text-[11px] text-[#A6B1C8]">{ret.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{ret.watch}</span>
                        <span className="text-[10.5px] text-rose-600 font-medium">Reason: {ret.reason}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{ret.courier}</span>
                        <span className="font-mono text-[10px] text-[#A6B1C8]">{ret.awb}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded ${ret.qcChecks.boxIntact ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Box {ret.qcChecks.boxIntact ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded ${ret.qcChecks.warrantyCardPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Card {ret.qcChecks.warrantyCardPresent ? '✓' : '✗'}
                          </span>
                          <span className={`px-2 py-0.5 rounded ${ret.qcChecks.scratchFree ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            Scratch-free {ret.qcChecks.scratchFree ? '✓' : '✗'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {ret.actionStatus.includes('Approved') ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Restocked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveReturn(ret.id)}
                            className="px-3 py-1.5 bg-watch-navy-dark hover:bg-black text-watch-gold font-bold text-xs rounded-lg transition-colors"
                          >
                            Pass QC & Restock
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryModule;
