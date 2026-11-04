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

// Mock Data for Assigned Orders
const INITIAL_ASSIGNED_ORDERS = [
  {
    id: '#WH12548',
    customer: 'Ananya Singh',
    city: 'Lucknow, UP',
    watch: 'Rolex Submariner Date 41mm',
    sku: 'W-ROLEX-SUB-41',
    qty: 1,
    priority: 'Urgent Express',
    zone: 'Zone A - Luxury Vault',
    assignedTo: 'Vikram Joshi',
    slaTime: '1h 20m left',
    status: 'Ready to Pick',
    price: '₹11,40,000',
    packaging: 'Luxury Wooden Box'
  },
  {
    id: '#WH12547',
    customer: 'Rahul Verma',
    city: 'Kanpur, UP',
    watch: 'Omega Speedmaster Professional Moonwatch',
    sku: 'W-OMEGA-MOON-01',
    qty: 1,
    priority: 'High',
    zone: 'Zone A - Luxury Vault',
    assignedTo: 'Ramesh Patel',
    slaTime: '2h 45m left',
    status: 'Picking in Progress',
    price: '₹6,40,000',
    packaging: 'Luxury Wooden Box'
  },
  {
    id: '#WH12546',
    customer: 'Priya Yadav',
    city: 'Varanasi, UP',
    watch: 'Cartier Santos de Cartier Large',
    sku: 'W-CART-SANTOS-LG',
    qty: 1,
    priority: 'Standard',
    zone: 'Zone B - Standard Watches',
    assignedTo: 'Sunil Kumar',
    slaTime: '4h 10m left',
    status: 'Ready to Pick',
    price: '₹7,15,000',
    packaging: 'Luxury Wooden Box'
  },
  {
    id: '#WH12545',
    customer: 'Rohit Kumar',
    city: 'Lucknow, UP',
    watch: 'Titan Edge Ceramic Slim',
    sku: 'W-TITAN-EDGE-CER',
    qty: 2,
    priority: 'Standard',
    zone: 'Zone B - Standard Watches',
    assignedTo: 'Deepak Rao',
    slaTime: '5h 00m left',
    status: 'Ready to Pick',
    price: '₹59,998',
    packaging: 'Standard Navy Box'
  },
  {
    id: '#WH12544',
    customer: 'Sneha Patel',
    city: 'Ahmedabad, GJ',
    watch: 'Seiko Prospex Speedtimer Solar',
    sku: 'W-SEIKO-SPEED-01',
    qty: 1,
    priority: 'High',
    zone: 'Zone B - Standard Watches',
    assignedTo: 'Ramesh Patel',
    slaTime: '3h 15m left',
    status: 'Picking in Progress',
    price: '₹58,000',
    packaging: 'Standard Navy Box'
  },
  {
    id: '#WH12543',
    customer: 'Kunal Kapoor',
    city: 'Delhi NCR',
    watch: 'Apple Watch Ultra 2 Titanium 49mm',
    sku: 'W-APPLE-ULTRA-2',
    qty: 1,
    priority: 'Urgent Express',
    zone: 'Zone C - Smartwatches',
    assignedTo: 'Vikram Joshi',
    slaTime: '0h 45m left',
    status: 'Ready to Pick',
    price: '₹89,900',
    packaging: 'Tamper-Evident Box'
  }
];

// Mock Shipments Data
const INITIAL_SHIPMENTS = [
  {
    id: '#SHP-9901',
    manifestId: 'MNF-BLU-20261104-01',
    orderId: '#WH12548',
    customer: 'Ananya Singh',
    destination: 'Lucknow, UP (226010)',
    courier: 'BlueDart Air Express',
    awb: 'BLU-88912401',
    weight: '0.45 kg',
    status: 'Delivered',
    dispatchTime: '03 Nov, 08:30 PM',
    step: 5,
    eta: 'Delivered 04 Nov, 02:30 PM'
  },
  {
    id: '#SHP-9902',
    manifestId: 'MNF-DLV-20261104-02',
    orderId: '#WH12547',
    customer: 'Rahul Verma',
    destination: 'Kanpur, UP (208001)',
    courier: 'Delhivery Surface Plus',
    awb: 'DLV-44219088',
    weight: '0.62 kg',
    status: 'Out for Delivery',
    dispatchTime: '04 Nov, 04:15 AM',
    step: 4,
    eta: 'Today by 06:00 PM'
  },
  {
    id: '#SHP-9903',
    manifestId: 'MNF-SHD-20261104-03',
    orderId: '#WH12546',
    customer: 'Priya Yadav',
    destination: 'Varanasi, UP (221002)',
    courier: 'Shadowfax Priority',
    awb: 'SHD-90124455',
    weight: '0.50 kg',
    status: 'In Transit',
    dispatchTime: '04 Nov, 09:30 AM',
    step: 3,
    eta: 'Tomorrow, 05 Nov'
  },
  {
    id: '#SHP-9904',
    manifestId: 'MNF-BLU-20261104-01',
    orderId: '#WH12545',
    customer: 'Rohit Kumar',
    destination: 'Lucknow, UP (226024)',
    courier: 'BlueDart Air Express',
    awb: 'BLU-88904512',
    weight: '0.85 kg',
    status: 'Delivered',
    dispatchTime: '02 Nov, 07:00 PM',
    step: 5,
    eta: 'Delivered 03 Nov, 04:15 PM'
  },
  {
    id: '#SHP-9905',
    manifestId: 'MNF-DHL-20261104-04',
    orderId: '#WH12543',
    customer: 'Kunal Kapoor',
    destination: 'Delhi NCR (110001)',
    courier: 'DHL Express VIP',
    awb: 'DHL-77319920',
    weight: '0.38 kg',
    status: 'Packed & Manifested',
    dispatchTime: 'Handover in 30 mins',
    step: 2,
    eta: 'Tomorrow Morning 10:00 AM'
  }
];

// Mock Return Logistics Data
const INITIAL_RETURNS = [
  {
    id: '#RET-5501',
    orderId: '#WH12541',
    customer: 'Meera Rajput',
    city: 'Jaipur, RJ',
    watch: 'Casio G-Shock Mudmaster Master of G',
    reason: 'Too large for wrist / Size adjustment needed',
    courier: 'BlueDart Reverse Pickup',
    awb: 'BLU-REV-10928',
    pickupStatus: 'Received at Warehouse QC',
    qcChecks: {
      boxIntact: true,
      warrantyCardPresent: true,
      scratchFree: true,
      movementTested: true
    },
    actionStatus: 'Pending Inspection Approval',
    amount: '₹29,995'
  },
  {
    id: '#RET-5502',
    orderId: '#WH12539',
    customer: 'Alok Gupta',
    city: 'Chandigarh, PB',
    watch: 'Fossil Grant Chronograph Leather',
    reason: 'Wrong color strap received in box',
    courier: 'Delhivery Reverse',
    awb: 'DLV-REV-88712',
    pickupStatus: 'Out for Reverse Pickup',
    qcChecks: {
      boxIntact: false,
      warrantyCardPresent: true,
      scratchFree: true,
      movementTested: true
    },
    actionStatus: 'In Transit to Hub',
    amount: '₹12,495'
  },
  {
    id: '#RET-5503',
    orderId: '#WH12535',
    customer: 'Simran Walia',
    city: 'Pune, MH',
    watch: 'Tissot PRX Powermatic 80 Blue',
    reason: 'Changed mind / Preferred Green Dial',
    courier: 'Shadowfax Reverse',
    awb: 'SHD-REV-66152',
    pickupStatus: 'QC Passed & Restocked',
    qcChecks: {
      boxIntact: true,
      warrantyCardPresent: true,
      scratchFree: true,
      movementTested: true
    },
    actionStatus: 'Restocked to Inventory',
    amount: '₹68,000'
  }
];

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
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => switchTab('assigned_orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'assigned_orders'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
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
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📦</span> Pick & Pack Workstation
          </button>

          <button
            onClick={() => switchTab('shipments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'shipments'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
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
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📍</span> Track Orders (AWB Timeline)
          </button>

          <button
            onClick={() => switchTab('returns')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'returns'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🔄</span> Returns & Cancellations
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full font-bold">
              {returns.length}
            </span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 font-semibold pr-3">
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
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Pick Queue</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{assignedOrders.length}</p>
              <span className="text-[10px] text-amber-600 font-bold">● Awaiting physical pick</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Urgent Express SLA</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {assignedOrders.filter(o => o.priority.includes('Urgent')).length}
              </p>
              <span className="text-[10px] text-rose-500 font-bold">⚡ Same-day dispatch required</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Active Pickers</span>
              <p className="text-2xl font-black text-blue-600 mt-1">4 Staff</p>
              <span className="text-[10px] text-blue-500 font-bold">● Vault & Standard zones</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Avg Pick Duration</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">14.2 min</p>
              <span className="text-[10px] text-emerald-500 font-bold">● Below 20m target</span>
            </div>
          </div>

          {/* Search, Filter & Bulk Assign Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order #, customer, watch..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-xs outline-none focus:border-watch-gold"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="h-9 px-3 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 outline-none"
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
                className="h-9 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
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
                        <span className="font-mono font-bold text-gray-900 block">{order.id}</span>
                        <span className="text-[11px] text-gray-500">{order.customer} • {order.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{order.watch}</span>
                        <span className="font-mono text-[10px] text-gray-400">SKU: {order.sku} (Qty: {order.qty})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
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
                        <div className="flex items-center gap-1.5 font-semibold text-gray-800">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Order Selected & Barcode Matcher */}
          <div className="lg:col-span-5 space-y-5">
            {/* Active Order Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                    Packaging Bench #04
                  </span>
                  <h4 className="text-base font-black text-gray-900">{packOrder.id}</h4>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                  {packOrder.priority}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-bold text-gray-900">{packOrder.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination:</span>
                  <span className="font-bold text-gray-900">{packOrder.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Watch Model:</span>
                  <span className="font-bold text-watch-navy-dark">{packOrder.watch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SKU Code:</span>
                  <span className="font-mono font-bold text-gray-800">{packOrder.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Value:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{packOrder.price}</span>
                </div>
              </div>

              {/* Barcode Scanner Tool */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-watch-gold" /> Scan Serial / SKU Barcode
                </label>
                <form onSubmit={handleBarcodeScan} className="flex gap-2">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder={`e.g. ${packOrder.sku}`}
                    className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-xs font-mono outline-none focus:border-watch-gold"
                  />
                  <button
                    type="submit"
                    className="px-3 bg-watch-navy-dark text-white rounded-lg text-xs font-bold hover:bg-black"
                  >
                    Verify
                  </button>
                </form>
                {scannedMatched ? (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Barcode Authenticated & Serial Verified
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400">
                    Scan the barcode physically or type SKU code to proceed to label print.
                  </p>
                )}
              </div>
            </div>

            {/* Packaging Box Selection */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-watch-gold" /> Select Packaging Casing
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'Luxury Wooden Box', tag: 'Luxury / Vault', desc: 'Piano black lacquer & velvet cushion' },
                  { name: 'Standard Navy Box', tag: 'Standard Retail', desc: 'Magnetic WatchHub gold foil box' },
                  { name: 'Tamper-Evident Box', tag: 'Smartwatches', desc: 'Electrostatic bubble padded case' },
                  { name: 'Travel Leather Pouch', tag: 'Special Request', desc: 'Handcrafted genuine leather case' }
                ].map((box) => (
                  <button
                    key={box.name}
                    type="button"
                    onClick={() => setSelectedBox(box.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedBox === box.name
                        ? 'border-watch-gold bg-amber-50/60 shadow-sm ring-1 ring-watch-gold'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-bold text-gray-900 block text-xs">{box.name}</span>
                    <span className="text-[10px] text-watch-gold font-bold block">{box.tag}</span>
                    <span className="text-[9.5px] text-gray-400 block mt-0.5">{box.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Shipment QC Checklist & Thermal Label Generator */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pre-Shipment Quality Control Checklist */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Mandatory 5-Point Quality & Packaging Inspection
                </h4>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  100% Passed
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'dialChecked', label: 'Sapphire Crystal & Bezel Inspection', desc: 'Zero micro-scratches, dust particles, or bezel misalignment under 10x loupe.' },
                  { key: 'movementChecked', label: 'Watch Movement & Chronograph Testing', desc: 'Hacking seconds, date change wheel, and crown screw-down confirmed working.' },
                  { key: 'strapPolished', label: 'Bracelet & Clasp Deployment Safety', desc: 'Links securely pinned, double-locking foldover clasp latches smoothly.' },
                  { key: 'warrantyCardInserted', label: 'Official International Warranty Card Enclosed', desc: 'Stamped with WatchHub Authorized Dealer seal and 24-Month guarantee.' },
                  { key: 'authenticitySealed', label: 'Tamper-Proof Holographic Void Seal Applied', desc: 'Security sticker affixed across packaging seam with unique QR verification.' }
                ].map((chk) => (
                  <label
                    key={chk.key}
                    className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100/70 rounded-xl cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={qcState[chk.key]}
                      onChange={(e) => setQcState({ ...qcState, [chk.key]: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-watch-gold rounded focus:ring-watch-gold accent-amber-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">{chk.label}</span>
                      <span className="text-gray-500 text-[11px]">{chk.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Thermal Shipping Label Preview & Dispatch */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-watch-navy-dark" /> Thermal Shipping Label & Barcode
                </h4>
                <span className="text-[10px] font-mono text-gray-400">Carrier: BlueDart Air Express</span>
              </div>

              {/* Mock Shipping Label */}
              <div className="border-2 border-dashed border-gray-300 p-4 rounded-xl bg-gray-50/50 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-start border-b border-gray-300 pb-2">
                  <div>
                    <h5 className="font-black text-sm text-gray-900 tracking-wider">WATCHHUB LUXURY DISPATCH</h5>
                    <p className="text-[10px] text-gray-500">Hub: Mumbai Fulfilment Vault #01 • GST: 27AAAAA0000A1Z5</p>
                  </div>
                  <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
                    FRAGILE / HIGH VALUE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Ship To:</span>
                    <span className="font-bold text-gray-900 block">{packOrder.customer}</span>
                    <span className="text-gray-600">{packOrder.city}</span>
                    <span className="text-gray-500 block">Phone: +91 98765 *****</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Order Details:</span>
                    <span className="font-bold text-gray-900 block">{packOrder.id}</span>
                    <span className="text-gray-600 block">{packOrder.watch}</span>
                    <span className="text-gray-500 block">Weight: 0.52 KG • Pkg: {selectedBox}</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-2 text-center border-t border-gray-200">
                  <div className="h-10 bg-repeat-x mx-auto max-w-sm rounded flex items-center justify-center tracking-widest text-lg font-black text-gray-800">
                    ||| | |||| || | ||||| || ||| |||| | |||||
                  </div>
                  <span className="text-[10px] text-gray-500 tracking-widest">
                    AWB: BLU-88912401-IN • PREPAID
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => alert('🖨️ Thermal Label Sent to Citizen CL-S621 Barcode Printer!')}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Label
                </button>
                <button
                  type="button"
                  onClick={handleCompletePacking}
                  className="btn-gold px-5 py-2 text-xs font-black rounded-xl flex items-center gap-2 shadow-luxury"
                >
                  {packedSuccess ? (
                    <>
                      <Check className="w-4 h-4 animate-spin" /> Packaging Sealed...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Complete Packing & Handover to Carrier
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <div key={c.courier} className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm ${c.color}`}>
                <span className="text-xs font-bold text-gray-900 block">{c.courier}</span>
                <p className="text-xl font-extrabold text-gray-900 mt-1">{c.count}</p>
                <span className="text-[10px] text-gray-500 font-semibold">{c.eta}</span>
              </div>
            ))}
          </div>

          {/* Manifest Controls */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-xs font-bold text-gray-900">Active Carrier Dispatch Manifests</h4>
              <p className="text-[11px] text-gray-500">Official handover sheets signed by warehouse security & courier driver.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('📄 Manifest MNF-BLU-20261104-01 downloaded in PDF format.')}
                className="h-9 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg flex items-center gap-1.5"
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
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
                    <tr key={shp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-gray-900 block">{shp.id}</span>
                        <span className="text-[10px] font-mono text-gray-400">Order: {shp.orderId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{shp.customer}</span>
                        <span className="text-[11px] text-gray-500">{shp.destination}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{shp.courier}</span>
                        <span className="font-mono text-[11px] text-watch-gold font-bold">{shp.awb}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10.5px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
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
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold text-[11px] flex items-center gap-1"
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
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-watch-gold" /> Real-Time Courier Transit & Milestone Tracker
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Query BlueDart, Delhivery, Shadowfax or DHL live tracking endpoints.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-80">
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter AWB # (e.g. BLU-889124)"
                className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-xs font-mono outline-none focus:border-watch-gold"
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
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900 font-mono">
                      {selectedTrackingAWB.awb}
                    </span>
                    <span className="px-2.5 py-0.5 bg-watch-gold/20 text-watch-navy-dark text-xs font-bold rounded-full">
                      {selectedTrackingAWB.courier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Order Ref: <span className="font-bold text-gray-800">{selectedTrackingAWB.orderId}</span> • Customer: <span className="font-bold text-gray-800">{selectedTrackingAWB.customer}</span> ({selectedTrackingAWB.destination})
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
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}
                        >
                          {isDone ? <Check className="w-5 h-5" /> : milestone.step}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-watch-navy-dark' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {milestone.title}
                          </p>
                          <p className="text-[10.5px] text-gray-500">{milestone.desc}</p>
                          <p className="text-[9.5px] text-gray-400 font-mono mt-0.5">{milestone.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Milestone Log Table */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <h5 className="text-xs font-bold text-gray-800">Carrier Scans & Waypoint History</h5>
                <div className="space-y-2 text-xs divide-y divide-gray-100">
                  <div className="pt-1.5 flex justify-between items-center text-gray-700">
                    <span>📍 Package reached delivery facility (Lucknow Hub - Amausi)</span>
                    <span className="font-mono text-[10px] text-gray-400">04 Nov 2026, 07:15 AM</span>
                  </div>
                  <div className="pt-1.5 flex justify-between items-center text-gray-700">
                    <span>✈️ Inter-facility linehaul departure from Mumbai Central Hub</span>
                    <span className="font-mono text-[10px] text-gray-400">03 Nov 2026, 11:45 PM</span>
                  </div>
                  <div className="pt-1.5 flex justify-between items-center text-gray-700">
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
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Reverse Pickups</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{returns.length}</p>
              <span className="text-[10px] text-amber-600 font-bold">● In transit to hub</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Pending Physical QC</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {returns.filter(r => r.actionStatus.includes('Pending')).length}
              </p>
              <span className="text-[10px] text-rose-500 font-bold">● Requires loupe inspection</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Restocked This Week</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">28 Units</p>
              <span className="text-[10px] text-emerald-500 font-bold">● 100% Mint condition</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Avg Return Turnaround</span>
              <p className="text-2xl font-black text-blue-600 mt-1">36 hrs</p>
              <span className="text-[10px] text-blue-500 font-bold">● From pickup to refund</span>
            </div>
          </div>

          {/* Returns Inspection Queue */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Return Pickup & Inward Quality Desk</h4>
                <p className="text-[11px] text-gray-500">Inspect returned watches before authorizing refund or restocking.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
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
                        <span className="font-mono font-bold text-gray-900 block">{ret.id}</span>
                        <span className="text-[10px] text-gray-400">Order: {ret.orderId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{ret.customer}</span>
                        <span className="text-[11px] text-gray-500">{ret.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{ret.watch}</span>
                        <span className="text-[10.5px] text-rose-600 font-medium">Reason: {ret.reason}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{ret.courier}</span>
                        <span className="font-mono text-[10px] text-gray-500">{ret.awb}</span>
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
