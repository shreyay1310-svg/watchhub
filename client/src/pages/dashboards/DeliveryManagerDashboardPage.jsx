import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, MOCK_STAFF_ACCOUNTS } from '../../context/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  Truck,
  Package,
  CheckCircle,
  RotateCcw,
  AlertTriangle,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Compass,
  MapPin,
  Phone,
  Eye,
  MoreVertical,
  X,
  Filter,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Clock,
  ShieldCheck,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Navigation,
  Send,
  MessageSquare,
  Building,
  UserCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  BadgeAlert,
  SlidersHorizontal,
} from 'lucide-react';

// Status colors
const STATUS_COLORS = {
  'Delivered': '#10B981',
  'Out for Delivery': '#3B82F6',
  'In Transit': '#F59E0B',
  'Assigned': '#D97706',
  'Picked Up': '#8B5CF6',
  'Failed': '#EF4444',
  'Returned': '#6B7280',
};

export default function DeliveryManagerDashboardPage() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 Days');

  // Filter state for orders table
  const [orderFilterTab, setOrderFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [areaFilter, setAreaFilter] = useState('All');
  const [riderFilter, setRiderFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Selected orders for bulk action
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Data states from backend
  const [loading, setLoading] = useState(true);
  const [deliveryData, setDeliveryData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showCreateShipmentModal, setShowCreateShipmentModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactTarget, setContactTarget] = useState(null);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [showFailedAttemptModal, setShowFailedAttemptModal] = useState(false);
  const [selectedOrderForFailure, setSelectedOrderForFailure] = useState(null);
  const [showFullMapModal, setShowFullMapModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Forms state
  const [shipmentForm, setShipmentForm] = useState({
    customer: '',
    customerPhone: '',
    customerEmail: '',
    productName: 'Rolex Submariner Date 41mm',
    address: '',
    area: 'Gomti Nagar, Lucknow',
    city: 'Lucknow',
    pincode: '226010',
    courierPartner: 'BlueDart Express',
    paymentType: 'Prepaid',
    orderAmount: 18999,
    priority: 'Urgent Express',
    timeSlot: '11:00 AM – 02:00 PM',
    assignedRiderId: 'rd_001',
  });

  const [assignForm, setAssignForm] = useState({
    riderId: 'rd_001',
    priority: 'Urgent Express',
    timeSlot: '11:00 AM – 02:00 PM',
  });

  const [partnerForm, setPartnerForm] = useState({
    name: '',
    phone: '',
    area: 'Gomti Nagar, Lucknow',
    vehicle: 'Two Wheeler (Motorcycle)',
    status: 'Available',
  });

  const [failureForm, setFailureForm] = useState({
    reason: 'Customer Unavailable',
    remarks: 'Customer requested evening re-attempt after 6:00 PM.',
    nextAttemptDate: 'Today, 06:00 PM',
  });

  // Show Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch Delivery Data from API
  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/delivery');
      if (!res.ok) throw new Error('Failed to load delivery data.');
      const json = await res.json();
      if (json.status === 'success') {
        setDeliveryData(json.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not fetch delivery details from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const el = document.getElementById('global-delivery-search');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Delivery Orders
  const orders = useMemo(() => {
    if (!deliveryData?.orders) return [];
    return deliveryData.orders.filter((order) => {
      // Tab filter
      if (orderFilterTab === 'Assigned' && order.status !== 'Assigned') return false;
      if (orderFilterTab === 'In Transit' && order.status !== 'In Transit' && order.status !== 'Picked Up') return false;
      if (orderFilterTab === 'Delivered' && order.status !== 'Delivered') return false;
      if (orderFilterTab === 'Failed' && order.status !== 'Failed') return false;

      // Status dropdown
      if (statusFilter !== 'All' && order.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // Area dropdown
      if (areaFilter !== 'All' && !order.area.toLowerCase().includes(areaFilter.toLowerCase())) return false;

      // Rider dropdown
      if (riderFilter !== 'All' && order.riderId !== riderFilter) return false;

      // Payment dropdown
      if (paymentFilter !== 'All' && order.paymentType.toLowerCase() !== paymentFilter.toLowerCase()) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          order.orderId.toLowerCase().includes(q) ||
          order.customer.toLowerCase().includes(q) ||
          order.awbNumber.toLowerCase().includes(q) ||
          order.productName.toLowerCase().includes(q) ||
          order.riderName.toLowerCase().includes(q) ||
          order.area.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [deliveryData, orderFilterTab, statusFilter, areaFilter, riderFilter, paymentFilter, searchQuery]);

  // Handle Order Selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o.orderId));
    }
  };

  // Handle Create Shipment
  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/delivery/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipmentForm),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Shipment created for ${shipmentForm.customer} with AWB ${data.data.awbNumber}`);
        setShowCreateShipmentModal(false);
        fetchDeliveryData();
      } else {
        alert(data.message || 'Error creating shipment.');
      }
    } catch (err) {
      alert('Network error creating shipment.');
    }
  };

  // Handle Assign Orders
  const handleAssignOrders = async (e) => {
    e.preventDefault();
    if (selectedOrderIds.length === 0) {
      alert('Please select at least one order.');
      return;
    }
    try {
      const res = await fetch('/api/delivery/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: selectedOrderIds,
          riderId: assignForm.riderId,
          priority: assignForm.priority,
          timeSlot: assignForm.timeSlot,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(data.message);
        setShowAssignModal(false);
        setSelectedOrderIds([]);
        fetchDeliveryData();
      } else {
        alert(data.message || 'Error assigning orders.');
      }
    } catch (err) {
      alert('Failed to assign orders.');
    }
  };

  // Handle Add Delivery Partner
  const handleAddPartner = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/delivery/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Rider ${partnerForm.name} registered.`);
        setShowAddPartnerModal(false);
        fetchDeliveryData();
      }
    } catch (err) {
      alert('Error registering partner.');
    }
  };

  // Handle Log Failure
  const handleLogFailure = async (e) => {
    e.preventDefault();
    if (!selectedOrderForFailure) return;
    try {
      const res = await fetch('/api/delivery/attempt-failure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForFailure.orderId,
          reason: failureForm.reason,
          remarks: failureForm.remarks,
          nextAttemptDate: failureForm.nextAttemptDate,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Failure recorded for ${selectedOrderForFailure.orderId}. Re-attempt scheduled.`);
        setShowFailedAttemptModal(false);
        fetchDeliveryData();
      }
    } catch (err) {
      alert('Error logging failure.');
    }
  };

  // Export Delivery CSV
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) return;
    const headers = ['Order ID', 'Customer', 'Product', 'Address', 'Rider', 'Courier', 'AWB', 'Status', 'ETA', 'Amount'];
    const rows = orders.map((o) => [
      o.orderId,
      `"${o.customer}"`,
      `"${o.productName}"`,
      `"${o.address}, ${o.area}"`,
      `"${o.riderName}"`,
      o.courierPartner,
      o.awbNumber,
      o.status,
      o.eta,
      o.formattedAmount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WatchHub_Deliveries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Delivery records exported to CSV successfully.');
  };

  // KPI Mini Wave Chart Mock Data
  const waveDataTotal = [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 28 }, { v: 35 }, { v: 40 }];
  const waveDataOut = [{ v: 12 }, { v: 18 }, { v: 15 }, { v: 22 }, { v: 24 }, { v: 28 }, { v: 32 }];
  const waveDataDelivered = [{ v: 35 }, { v: 38 }, { v: 42 }, { v: 48 }, { v: 52 }, { v: 55 }, { v: 62 }];
  const waveDataAttempts = [{ v: 18 }, { v: 15 }, { v: 16 }, { v: 12 }, { v: 10 }, { v: 9 }, { v: 8 }];
  const waveDataReturns = [{ v: 10 }, { v: 8 }, { v: 9 }, { v: 7 }, { v: 6 }, { v: 5 }, { v: 4 }];

  // Sidebar navigation menu
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'orders', label: 'Delivery Orders', icon: Truck, badge: '28' },
    { id: 'tracking', label: 'Shipment Tracking', icon: MapPin },
    { id: 'assign', label: 'Assign Deliveries', icon: Navigation },
    { id: 'partners', label: 'Delivery Partners', icon: Users },
    { id: 'routes', label: 'Route Planning', icon: Navigation },
    { id: 'attempts', label: 'Delivery Attempts', icon: RotateCcw },
    { id: 'returns', label: 'Returns & Pickups', icon: Package },
    { id: 'reports', label: 'Delivery Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentRole = user?.role || ROLES.DELIVERY_MANAGER;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-gray-800 flex flex-col font-poppins antialiased selection:bg-[#D6A63C]/30 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#071426] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#D6A63C]/40 flex items-center gap-3 animate-fade-in text-sm">
          <CheckCircle className="w-5 h-5 text-[#D6A63C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-[#071426] text-white sticky top-0 z-40 border-b border-white/10 shadow-md">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Toggle */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D6A63C] to-[#F3D78E] flex items-center justify-center text-[#071426] font-bold shadow-md">
                ⌚
              </div>
              <div className="flex flex-col">
                <span className="font-cinzel text-lg font-bold tracking-wider text-white leading-tight">
                  WatchHub
                </span>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                  Delivery Manager
                </span>
              </div>
            </Link>
          </div>

          {/* Global Search with Ctrl+K */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="global-delivery-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, AWB, Customer, Rider..."
                className="w-full pl-10 pr-16 py-2 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-400 text-xs sm:text-sm border border-white/15 focus:border-[#D6A63C] outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold bg-white/15 text-gray-300 px-1.5 py-0.5 rounded border border-white/20">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Top Actions: Store Link, Alerts, Settings, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all hover:border-[#D6A63C]"
            >
              <Eye className="w-3.5 h-3.5 text-[#D6A63C]" />
              <span>View Store ↗</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  5
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 text-gray-800 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="font-bold text-sm text-[#071426]">Delivery Alerts</span>
                    <span className="text-[11px] text-[#D6A63C] font-semibold cursor-pointer">Mark all as read</span>
                  </div>
                  <div className="space-y-3 mt-3 max-h-72 overflow-y-auto">
                    {(deliveryData?.notifications || []).map((notif) => (
                      <div key={notif.id} className="p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50/50 border border-gray-100 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#071426]">{notif.title}</span>
                          <span className="text-[10px] text-gray-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings Cog */}
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Delivery Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Role Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D6A63C] text-[#071426] font-bold text-xs flex items-center justify-center">
                  🚚
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">Delivery Manager</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-sm text-[#071426]">Amit Sharma</p>
                    <p className="text-[11px] text-gray-500">delivery@watchhub.in</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-50 text-[#D6A63C] text-[10px] font-bold border border-[#D6A63C]/30">
                      Verified Delivery Manager
                    </span>
                  </div>

                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Role Dashboard
                  </div>

                  {Object.values(ROLES)
                    .filter((r) => r !== ROLES.CUSTOMER)
                    .map((r) => {
                      const staff = MOCK_STAFF_ACCOUNTS[r];
                      const isActive = currentRole === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleMenuOpen(false);
                            if (r === ROLES.STORE_ADMIN) navigate('/dashboard');
                            if (r === ROLES.INVENTORY_MANAGER) navigate('/inventory-manager/dashboard');
                          }}
                          className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-amber-50 transition-colors cursor-pointer ${
                            isActive ? 'bg-amber-50/70 text-[#D6A63C] font-bold' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{staff?.avatar || '👤'}</span>
                            <span>{r}</span>
                          </div>
                          {isActive && <CheckCircle className="w-3.5 h-3.5 text-[#D6A63C]" />}
                        </button>
                      );
                    })}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BODY WITH FIXED SIDEBAR & MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT NAVY SIDEBAR */}
        <aside
          className={`${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } bg-[#071426] text-white flex-shrink-0 flex flex-col justify-between transition-all duration-300 border-r border-white/10 hidden md:flex`}
        >
          {/* Main Navigation Items */}
          <div className="p-4 space-y-1.5 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D6A63C] text-[#071426] shadow-lg font-bold shadow-[#D6A63C]/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#071426]' : 'text-gray-400'}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E65100] text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Need Help Card */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <Package className="w-4 h-4 text-[#D6A63C]" />
                  <span>Need Help?</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                  Delivery operations, partner support & tracking.
                </p>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="w-full py-1.5 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Contact Support →
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TOP BANNER / TITLE ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-xs">
                🚚
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Delivery Manager Dashboard
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage shipments, delivery partners, routes and last-mile delivery for WatchHub.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="relative">
                <button
                  onClick={() => setDateRangeOpen(!dateRangeOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-300 transition-all shadow-xs cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{selectedDateRange}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {dateRangeOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-30 text-xs text-gray-700 animate-fade-in">
                    {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Custom Range'].map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setSelectedDateRange(r);
                          setDateRangeOpen(false);
                          triggerToast(`Date filter updated to ${r}`);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-amber-50 hover:text-[#D6A63C] transition-colors ${
                          selectedDateRange === r ? 'font-bold text-[#D6A63C] bg-amber-50/50' : ''
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Create Shipment Primary Button */}
              <button
                onClick={() => setShowCreateShipmentModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold text-xs sm:text-sm shadow-md shadow-[#D6A63C]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Shipment</span>
              </button>
            </div>
          </div>

          {/* 5 KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Total Shipments */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Total Shipments</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                  📦
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {deliveryData?.stats?.totalShipments?.toLocaleString() || '1,248'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{deliveryData?.stats?.totalShipmentsTrend || '+12%'}</span>
                  </div>
                </div>
                {/* Mini Wave Chart */}
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataTotal}>
                      <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2. Out for Delivery */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Out for Delivery</span>
                <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm">
                  🚚
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {deliveryData?.stats?.outForDelivery?.toLocaleString() || '312'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-green-600 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{deliveryData?.stats?.outForDeliveryTrend || '+18%'}</span>
                  </div>
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataOut}>
                      <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 3. Delivered */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Delivered</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                  ✓
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {deliveryData?.stats?.delivered?.toLocaleString() || '892'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{deliveryData?.stats?.deliveredTrend || '+14%'}</span>
                  </div>
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataDelivered}>
                      <Area type="monotone" dataKey="v" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 4. Delivery Attempts */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Delivery Attempts</span>
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
                  ⟳
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {deliveryData?.stats?.deliveryAttempts || '36'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-rose-500 mt-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>{deliveryData?.stats?.deliveryAttemptsTrend || '-20%'}</span>
                  </div>
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataAttempts}>
                      <Area type="monotone" dataKey="v" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 5. Returns / Pickups */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Returns / Pickups</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                  📦
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {deliveryData?.stats?.returnsPickups || '8'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>{deliveryData?.stats?.returnsPickupsTrend || '-11%'}</span>
                  </div>
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataReturns}>
                      <Area type="monotone" dataKey="v" stroke="#D97706" fill="#D97706" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: 3 PANELS (Shipment Status Donut + Live Delivery Map + Quick Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* CARD 1: SHIPMENT STATUS OVERVIEW (lg:col-span-4) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Shipment Status Overview</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-auto">
                {/* Donut Chart with Center Text */}
                <div className="relative w-44 h-44 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deliveryData?.statusBreakdown || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="count"
                        cursor="pointer"
                        onClick={(entry) => {
                          setStatusFilter(entry.name);
                          triggerToast(`Filtered table by: ${entry.name}`);
                        }}
                      >
                        {(deliveryData?.statusBreakdown || []).map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-base font-extrabold text-gray-900 leading-none">1,248</span>
                    <span className="text-[10px] text-gray-500 font-medium mt-0.5">Shipments</span>
                  </div>
                </div>

                {/* Slices Legend */}
                <div className="space-y-2 text-xs flex-1">
                  {(deliveryData?.statusBreakdown || []).map((item) => (
                    <div
                      key={item.name}
                      onClick={() => setStatusFilter(item.name)}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-700 font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD 2: LIVE DELIVERY MAP (lg:col-span-5) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-5 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 z-10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-900">Live Delivery Map</h3>
                </div>
                <button
                  onClick={() => setShowFullMapModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Realistic Interactive Map Canvas / SVG */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-[#e5ece8] border border-gray-200">
                {/* Stylized Vector Map Graphics */}
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 500 240">
                  {/* Water Body / River */}
                  <path d="M 0 160 Q 150 140, 260 170 T 500 130 L 500 160 L 0 200 Z" fill="#cbe3f5" opacity="0.8" />
                  {/* Green Parks */}
                  <rect x="30" y="30" width="80" height="60" rx="10" fill="#d2e7d6" opacity="0.8" />
                  <rect x="320" y="40" width="90" height="70" rx="12" fill="#d2e7d6" opacity="0.8" />
                  {/* Road Network Lines */}
                  <path d="M 0 60 L 500 80" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 0 120 L 500 110" stroke="#ffffff" strokeWidth="5" />
                  <path d="M 120 0 L 150 240" stroke="#ffffff" strokeWidth="7" />
                  <path d="M 300 0 L 280 240" stroke="#ffffff" strokeWidth="6" />
                  <path d="M 420 0 L 440 240" stroke="#ffffff" strokeWidth="5" />
                  <path d="M 0 190 Q 250 180, 500 210" stroke="#f1e0c6" strokeWidth="8" />

                  {/* Active Blue Delivery Route Line (Matching image) */}
                  <path
                    d="M 60 190 Q 140 180, 220 140 T 380 95"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="4 2"
                  />
                </svg>

                {/* Hub Origin Marker */}
                <div
                  className="absolute left-[50px] top-[175px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
                  title="WatchHub Central Logistics Hub"
                >
                  <div className="w-6 h-6 rounded-full bg-[#071426] text-white flex items-center justify-center text-[10px] shadow-lg border-2 border-white">
                    🏠
                  </div>
                  <span className="text-[9px] font-bold bg-[#071426] text-white px-1.5 py-0.5 rounded shadow mt-0.5">
                    Hub
                  </span>
                </div>

                {/* Rider Live Position Marker (scooter) */}
                <div
                  className="absolute left-[260px] top-[140px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer animate-bounce"
                  title="Rider Rohan Singh - Verified GPS 2 mins ago"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-xl border-2 border-white ring-4 ring-blue-400/30">
                    🛵
                  </div>
                </div>

                {/* Destination Red Pin */}
                <div
                  className="absolute left-[380px] top-[95px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                  title="Destination: Gomti Nagar"
                >
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-xl border-2 border-white">
                    📍
                  </div>
                </div>

                {/* Floating Popup Card (Matches Image Exactly) */}
                <div className="absolute top-3 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-gray-100 z-20 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🛵</span>
                    <span className="font-bold text-gray-900">Order #WH12548</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                      Out for Delivery
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium">Rider: Rohan Singh</p>
                  <p className="text-[11px] text-gray-600 font-medium">ETA: 12:40 PM</p>
                </div>

                {/* Map Controls */}
                <div className="absolute right-3 bottom-3 flex flex-col gap-1.5 z-20">
                  <button
                    onClick={() => triggerToast('Zooming map view in')}
                    className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() => triggerToast('Zooming map view out')}
                    className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    –
                  </button>
                  <button
                    onClick={() => triggerToast('Centered on live rider Rohan Singh')}
                    className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow flex items-center justify-center font-bold text-xs cursor-pointer"
                    title="Recenter Map"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: QUICK ACTIONS (lg:col-span-3) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-500 font-bold">⚡</span>
                <h3 className="text-sm font-bold text-gray-900">Quick Actions</h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5 my-auto">
                {/* 1. Assign Orders */}
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-[#D6A63C]/10 group-hover:text-[#D6A63C] transition-colors">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Assign Orders</span>
                </button>

                {/* 2. Track Shipments */}
                <button
                  onClick={() => {
                    const firstOrder = deliveryData?.orders?.[0];
                    if (firstOrder) {
                      setSelectedOrderForTracking(firstOrder);
                      setShowTrackingModal(true);
                    }
                  }}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-[#D6A63C]/10 group-hover:text-[#D6A63C] transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Track Shipments</span>
                </button>

                {/* 3. Manage Riders */}
                <button
                  onClick={() => setActiveTab('partners')}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-[#D6A63C]/10 group-hover:text-[#D6A63C] transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Manage Riders</span>
                </button>

                {/* 4. Plan Routes */}
                <button
                  onClick={() => setActiveTab('routes')}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-[#D6A63C]/10 group-hover:text-[#D6A63C] transition-colors">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Plan Routes</span>
                </button>

                {/* 5. Delivery Reports */}
                <button
                  onClick={handleExportCSV}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-[#D6A63C]/10 group-hover:text-[#D6A63C] transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Delivery Reports</span>
                </button>

                {/* 6. Handle Returns */}
                <button
                  onClick={() => setActiveTab('returns')}
                  className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-[#D6A63C]/10 group-hover:text-[#D6A63C] transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Handle Returns</span>
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: TODAY'S DELIVERY ORDERS + DELIVERY PARTNERS WIDGET */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: TODAY'S DELIVERY ORDERS TABLE (lg:col-span-9) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-9 space-y-4">
              {/* Header with Title, Tabs, and View All link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🚚</span>
                  <h3 className="text-sm font-bold text-gray-900">
                    Today's Delivery Orders <span className="text-gray-400 font-normal">(312)</span>
                  </h3>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 text-xs overflow-x-auto">
                  {[
                    { id: 'All', label: 'All (312)' },
                    { id: 'Assigned', label: 'Assigned (286)' },
                    { id: 'In Transit', label: 'In Transit (18)' },
                    { id: 'Delivered', label: 'Delivered (0)' },
                    { id: 'Failed', label: 'Failed (8)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setOrderFilterTab(t.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        orderFilterTab === t.id
                          ? 'bg-[#071426] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setOrderFilterTab('All');
                    setStatusFilter('All');
                    triggerToast('Displaying all delivery orders.');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Orders →</span>
                </button>
              </div>

              {/* Filters Bar: Search, Status, City/Area, Rider, Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order ID, Customer, AWB..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:border-[#D6A63C] outline-none"
                  />
                </div>

                {/* Delivery Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">Delivery Status: All</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>

                {/* City / Area Dropdown */}
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">City / Area: All</option>
                  <option value="Gomti Nagar">Gomti Nagar, Lucknow</option>
                  <option value="Indira Nagar">Indira Nagar, Lucknow</option>
                  <option value="Aliganj">Aliganj, Lucknow</option>
                  <option value="Hazratganj">Hazratganj, Lucknow</option>
                  <option value="Jankipuram">Jankipuram, Lucknow</option>
                </select>

                {/* Rider Dropdown */}
                <select
                  value={riderFilter}
                  onChange={(e) => setRiderFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">Rider: All Riders</option>
                  {(deliveryData?.partners || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </select>

                {/* Payment Type Dropdown */}
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">Payment Type: All</option>
                  <option value="Prepaid">Prepaid (100% Verified)</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>

              {/* Bulk Actions Banner if any checked */}
              {selectedOrderIds.length > 0 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-[#D6A63C]/30 flex items-center justify-between text-xs animate-fade-in">
                  <span className="font-semibold text-gray-800">
                    {selectedOrderIds.length} orders selected for batch assignment
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-[#D6A63C] text-[#071426] font-bold text-xs hover:bg-[#c49533] cursor-pointer"
                    >
                      Assign to Rider
                    </button>
                    <button
                      onClick={() => setSelectedOrderIds([])}
                      className="px-2 py-1 text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3 w-8">
                        <input
                          type="checkbox"
                          checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                          onChange={handleSelectAllOrders}
                          className="rounded text-[#D6A63C] focus:ring-[#D6A63C]"
                        />
                      </th>
                      <th className="p-3 font-semibold text-gray-700">Order ID</th>
                      <th className="p-3 font-semibold text-gray-700">Customer</th>
                      <th className="p-3 font-semibold text-gray-700">Product</th>
                      <th className="p-3 font-semibold text-gray-700">Address (Area)</th>
                      <th className="p-3 font-semibold text-gray-700">Rider</th>
                      <th className="p-3 font-semibold text-gray-700">Status</th>
                      <th className="p-3 font-semibold text-gray-700">ETA</th>
                      <th className="p-3 text-right font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-gray-400">
                          No delivery orders found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => {
                        const isChecked = selectedOrderIds.includes(order.orderId);
                        return (
                          <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleSelectOrder(order.orderId)}
                                className="rounded text-[#D6A63C] focus:ring-[#D6A63C]"
                              />
                            </td>
                            <td className="p-3 font-bold text-gray-900 whitespace-nowrap">
                              {order.orderId}
                            </td>
                            <td className="p-3 font-medium whitespace-nowrap text-gray-900">
                              {order.customer}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img
                                  src={order.productImage}
                                  alt={order.productShortName}
                                  className="w-7 h-7 rounded-lg object-contain bg-gray-50 border border-gray-100 p-0.5"
                                  onError={(e) => {
                                    e.target.src = '/images/products/featured_rolex_submariner.jpg';
                                  }}
                                />
                                <span className="font-semibold text-gray-800">{order.productShortName}</span>
                              </div>
                            </td>
                            <td className="p-3 text-gray-600 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-gray-500">
                                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span>{order.area}</span>
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img
                                  src={order.riderAvatar}
                                  alt={order.riderName}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                />
                                <span className="font-medium text-gray-800">{order.riderName}</span>
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
                                style={{
                                  backgroundColor: `${STATUS_COLORS[order.status] || '#6B7280'}15`,
                                  color: STATUS_COLORS[order.status] || '#374151',
                                }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-gray-700 whitespace-nowrap">
                              {order.eta}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Eye View Timeline */}
                                <button
                                  onClick={() => {
                                    setSelectedOrderForTracking(order);
                                    setShowTrackingModal(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                  title="View Live Shipment Tracking"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Phone Call */}
                                <button
                                  onClick={() => {
                                    setContactTarget({
                                      name: order.riderName,
                                      phone: order.riderPhone,
                                      role: 'Rider',
                                      orderId: order.orderId,
                                      customer: order.customer,
                                      customerPhone: order.customerPhone,
                                    });
                                    setShowContactModal(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                                  title="Contact Rider or Customer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </button>

                                {/* Log Failure / Actions Menu */}
                                <button
                                  onClick={() => {
                                    setSelectedOrderForFailure(order);
                                    setShowFailedAttemptModal(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Log Delivery Attempt Failure"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: DELIVERY PARTNERS WIDGET (lg:col-span-3) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">👤</span>
                  <h3 className="text-sm font-bold text-gray-900">Delivery Partners</h3>
                </div>
                <button
                  onClick={() => setActiveTab('partners')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {/* Partners List Matching UI */}
              <div className="space-y-3">
                {(deliveryData?.partners || []).slice(0, 4).map((rider) => (
                  <div
                    key={rider.id}
                    className="p-3 rounded-xl border border-gray-100 hover:border-[#D6A63C] bg-gray-50/50 hover:bg-white transition-all flex items-center justify-between cursor-pointer"
                    onClick={() => {
                      setContactTarget({
                        name: rider.name,
                        phone: rider.phone,
                        role: 'Rider',
                      });
                      setShowContactModal(true);
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rider.avatar}
                        alt={rider.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-xs text-gray-900">{rider.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              rider.status === 'On Delivery'
                                ? 'bg-green-500'
                                : rider.status === 'Available'
                                ? 'bg-amber-500'
                                : 'bg-gray-400'
                            }`}
                          />
                          <span className="text-[11px] text-gray-500 font-medium">{rider.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">{rider.activeOrders} Orders</p>
                      <p className="text-[10px] text-green-600 font-bold">{rider.successRate} Success</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Delivery Partner Quick Button */}
              <button
                onClick={() => setShowAddPartnerModal(true)}
                className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Delivery Partner</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================================
          MODALS & OVERLAYS
      ========================================================================== */}

      {/* 1. CREATE SHIPMENT MODAL */}
      {showCreateShipmentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-bold text-base text-[#071426]">Create New Delivery Shipment</h3>
              </div>
              <button
                onClick={() => setShowCreateShipmentModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shipmentForm.customer}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, customer: e.target.value })}
                    placeholder="e.g. Shreya Verma"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    value={shipmentForm.customerPhone}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Watch Product Selection *</label>
                <select
                  value={shipmentForm.productName}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, productName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="Rolex Submariner Date 41mm">Rolex Submariner Date 41mm (₹18,999)</option>
                  <option value="Rolex Cosmograph Daytona Gold">Rolex Cosmograph Daytona Gold (₹21,999)</option>
                  <option value="Omega Speedmaster Professional">Omega Speedmaster Professional (₹16,499)</option>
                  <option value="Omega Seamaster Diver 300M">Omega Seamaster Diver 300M (₹14,999)</option>
                  <option value="Patek Philippe Nautilus 5711">Patek Philippe Nautilus 5711 (₹54,99,000)</option>
                  <option value="Cartier Tank Must">Cartier Tank Must (₹3,49,000)</option>
                  <option value="Apple Watch Series 10">Apple Watch Series 10 (₹46,900)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Doorstep Delivery Address *</label>
                <textarea
                  rows="2"
                  required
                  value={shipmentForm.address}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, address: e.target.value })}
                  placeholder="Flat / House No, Street, Landmark"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Delivery Area *</label>
                  <select
                    value={shipmentForm.area}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, area: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="Gomti Nagar, Lucknow">Gomti Nagar</option>
                    <option value="Indira Nagar, Lucknow">Indira Nagar</option>
                    <option value="Aliganj, Lucknow">Aliganj</option>
                    <option value="Hazratganj, Lucknow">Hazratganj</option>
                    <option value="Jankipuram, Lucknow">Jankipuram</option>
                    <option value="Mahanagar, Lucknow">Mahanagar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Courier Partner</label>
                  <select
                    value={shipmentForm.courierPartner}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, courierPartner: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="BlueDart Express">BlueDart Express</option>
                    <option value="Delhivery">Delhivery</option>
                    <option value="DTDC Express">DTDC Express</option>
                    <option value="Shadowfax">Shadowfax</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={shipmentForm.priority}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="Urgent Express">Urgent Express</option>
                    <option value="High">High</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assign Delivery Partner (Rider)</label>
                <select
                  value={shipmentForm.assignedRiderId}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, assignedRiderId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                >
                  {(deliveryData?.partners || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.area} ({p.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateShipmentModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold shadow-md cursor-pointer"
                >
                  Generate AWB & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ASSIGN ORDERS TO RIDER MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-bold text-base text-[#071426]">Assign Orders to Delivery Partner</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignOrders} className="space-y-4 mt-4">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900">
                <p className="font-bold">
                  Selected Orders: {selectedOrderIds.length > 0 ? selectedOrderIds.join(', ') : 'No orders selected. Please choose below:'}
                </p>
                {selectedOrderIds.length === 0 && (
                  <p className="text-[11px] text-blue-700 mt-1">
                    Select order checkboxes in the table or assign current pending backlog.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Delivery Partner *</label>
                <select
                  value={assignForm.riderId}
                  onChange={(e) => setAssignForm({ ...assignForm, riderId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                >
                  {(deliveryData?.partners || []).map((p) => (
                    <option key={p.id} value={p.id} disabled={p.status === 'Off Duty'}>
                      {p.name} — {p.status} ({p.activeOrders} active orders) {p.status === 'Off Duty' ? '— [OFF DUTY]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Delivery Priority</label>
                  <select
                    value={assignForm.priority}
                    onChange={(e) => setAssignForm({ ...assignForm, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="Urgent Express">Urgent Express (Within 2 Hours)</option>
                    <option value="High">High (Same Day)</option>
                    <option value="Standard">Standard Slot</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Delivery Time Slot</label>
                  <select
                    value={assignForm.timeSlot}
                    onChange={(e) => setAssignForm({ ...assignForm, timeSlot: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="10:00 AM – 01:00 PM">Morning (10 AM – 1 PM)</option>
                    <option value="01:00 PM – 04:00 PM">Afternoon (1 PM – 4 PM)</option>
                    <option value="04:00 PM – 08:00 PM">Evening (4 PM – 8 PM)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold shadow-md cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SHIPMENT TRACKING 8-STAGE TIMELINE MODAL */}
      {showTrackingModal && selectedOrderForTracking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base text-[#071426]">
                    Shipment Tracking: {selectedOrderForTracking.orderId}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    AWB: <span className="font-mono font-bold text-gray-800">{selectedOrderForTracking.awbNumber}</span> ({selectedOrderForTracking.courierPartner})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product & Rider Card Summary */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 my-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedOrderForTracking.productImage}
                  alt={selectedOrderForTracking.productShortName}
                  className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-200 p-1"
                />
                <div>
                  <p className="font-bold text-gray-900">{selectedOrderForTracking.productName}</p>
                  <p className="text-[11px] text-gray-500">{selectedOrderForTracking.customer} • {selectedOrderForTracking.formattedAmount}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    {selectedOrderForTracking.status}
                  </span>
                </div>
              </div>

              <div className="border-l border-gray-200 pl-3.5">
                <p className="text-gray-500 text-[11px]">Assigned Rider:</p>
                <p className="font-bold text-gray-900">{selectedOrderForTracking.riderName}</p>
                <p className="text-[11px] text-gray-500">{selectedOrderForTracking.riderPhone}</p>
                <p className="text-[11px] font-semibold text-blue-600 mt-1">ETA: {selectedOrderForTracking.eta}</p>
              </div>
            </div>

            {/* 8-Stage Timeline */}
            <div className="space-y-4 px-2">
              <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                Full Shipment Journey (8 Milestones)
              </h4>
              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {(selectedOrderForTracking.trackingTimeline || []).map((step, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.completed
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                          : step.active
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`font-bold ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      <span className="text-[11px] text-gray-400 font-medium">{step.time}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-5 py-2 rounded-xl bg-[#071426] text-white font-bold cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTACT RIDER / CUSTOMER MODAL */}
      {showContactModal && contactTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-base text-[#071426]">Direct Contact</h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] uppercase font-bold text-gray-400">Rider Contact:</span>
                <p className="font-bold text-sm text-gray-900 mt-0.5">{contactTarget.name}</p>
                <p className="text-xs text-blue-600 font-mono font-bold">{contactTarget.phone}</p>
                <a
                  href={`tel:${contactTarget.phone}`}
                  className="mt-2.5 w-full py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider Now</span>
                </a>
              </div>

              {contactTarget.customer && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Customer Handover:</span>
                  <p className="font-bold text-sm text-gray-900 mt-0.5">{contactTarget.customer}</p>
                  <p className="text-xs text-amber-700 font-mono font-bold">{contactTarget.customerPhone}</p>
                  <a
                    href={`tel:${contactTarget.customerPhone}`}
                    className="mt-2.5 w-full py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. LOG DELIVERY ATTEMPT FAILURE MODAL */}
      {showFailedAttemptModal && selectedOrderForFailure && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-[#071426]">
                  Record Failed Delivery Attempt
                </h3>
              </div>
              <button
                onClick={() => setShowFailedAttemptModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogFailure} className="space-y-4 mt-4">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-900">
                <p className="font-bold">Order: {selectedOrderForFailure.orderId} — {selectedOrderForFailure.customer}</p>
                <p className="text-[11px] text-rose-700 mt-0.5">Rider: {selectedOrderForFailure.riderName}</p>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Failure Reason *</label>
                <select
                  value={failureForm.reason}
                  onChange={(e) => setFailureForm({ ...failureForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="Customer Unavailable">Customer Unavailable</option>
                  <option value="Incorrect Address">Incorrect Address</option>
                  <option value="Customer Refused">Customer Refused</option>
                  <option value="Phone Not Reachable">Phone Not Reachable</option>
                  <option value="Other">Other Operational Reason</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Next Re-Attempt Slot *</label>
                <input
                  type="text"
                  required
                  value={failureForm.nextAttemptDate}
                  onChange={(e) => setFailureForm({ ...failureForm, nextAttemptDate: e.target.value })}
                  placeholder="e.g. Today 06:00 PM or Tomorrow 11:00 AM"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Rider Contact Remarks</label>
                <textarea
                  rows="3"
                  value={failureForm.remarks}
                  onChange={(e) => setFailureForm({ ...failureForm, remarks: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFailedAttemptModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Log & Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADD DELIVERY PARTNER MODAL */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-bold text-base text-[#071426]">Register Delivery Partner</h3>
              </div>
              <button
                onClick={() => setShowAddPartnerModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPartner} className="space-y-4 mt-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Rider Full Name *</label>
                <input
                  type="text"
                  required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                  placeholder="e.g. Deepak Kumar"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={partnerForm.phone}
                  onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                  placeholder="+91 98111 22334"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned City & Delivery Area *</label>
                <input
                  type="text"
                  required
                  value={partnerForm.area}
                  onChange={(e) => setPartnerForm({ ...partnerForm, area: e.target.value })}
                  placeholder="e.g. Aliganj & Kapoorthala, Lucknow"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Vehicle Specification</label>
                <input
                  type="text"
                  value={partnerForm.vehicle}
                  onChange={(e) => setPartnerForm({ ...partnerForm, vehicle: e.target.value })}
                  placeholder="e.g. TVS Jupiter (UP 32 CD 1234)"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold shadow-md cursor-pointer"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. FULL LIVE MAP MODAL */}
      {showFullMapModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-gray-100 text-xs flex flex-col h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-base text-[#071426]">Live GPS Delivery Radar (Lucknow Fleet)</h3>
                  <p className="text-[11px] text-gray-500">4 Active Riders • 12 Active In-Transit Shipments</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expanded Vector Map */}
            <div className="relative flex-1 my-4 rounded-2xl overflow-hidden bg-[#e5ece8] border border-gray-200">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 800 450">
                <path d="M 0 320 Q 250 280, 480 340 T 800 270 L 800 450 L 0 450 Z" fill="#cbe3f5" opacity="0.8" />
                <rect x="60" y="50" width="160" height="110" rx="15" fill="#d2e7d6" opacity="0.8" />
                <rect x="520" y="80" width="180" height="130" rx="18" fill="#d2e7d6" opacity="0.8" />
                <path d="M 0 120 L 800 150" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" />
                <path d="M 0 240 L 800 220" stroke="#ffffff" strokeWidth="8" />
                <path d="M 220 0 L 280 450" stroke="#ffffff" strokeWidth="12" />
                <path d="M 520 0 L 490 450" stroke="#ffffff" strokeWidth="10" />

                {/* Primary Route */}
                <path d="M 120 380 Q 260 350, 420 280 T 680 180" fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeDasharray="6 3" />
                {/* Secondary Route */}
                <path d="M 120 380 Q 320 240, 520 180 T 700 80" fill="none" stroke="#10B981" strokeWidth="5" strokeLinecap="round" strokeDasharray="4 2" />
              </svg>

              {/* Central Hub */}
              <div className="absolute left-[120px] top-[380px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#071426] text-white flex items-center justify-center text-sm shadow-xl border-2 border-white">
                  🏠
                </div>
                <span className="text-[10px] font-bold bg-[#071426] text-white px-2 py-0.5 rounded shadow mt-1">
                  Lucknow Central Hub
                </span>
              </div>

              {/* Rider 1: Rohan Singh */}
              <div className="absolute left-[440px] top-[270px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-xl border-2 border-white ring-4 ring-blue-300">
                  🛵
                </div>
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded shadow mt-1">
                  Rohan Singh (ETA 12:40 PM)
                </span>
              </div>

              {/* Rider 2: Amit Kumar */}
              <div className="absolute left-[540px] top-[170px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm shadow-xl border-2 border-white ring-4 ring-green-300">
                  🛵
                </div>
                <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-0.5 rounded shadow mt-1">
                  Amit Kumar (ETA 01:10 PM)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-gray-500 text-xs">
                ℹ Verified real-time telemetry from rider Android mobile partner app.
              </span>
              <button
                onClick={() => setShowFullMapModal(false)}
                className="px-5 py-2 rounded-xl bg-[#071426] text-white font-bold cursor-pointer"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D6A63C] text-2xl flex items-center justify-center mx-auto mb-3">
              🎧
            </div>
            <h3 className="font-bold text-base text-[#071426] mb-1">Delivery Operations Support</h3>
            <p className="text-gray-500 mb-4 leading-relaxed">
              24×7 internal logistics escalation desk for courier partners, routing queries and lost parcels.
            </p>
            <div className="p-3 bg-gray-50 rounded-2xl text-left space-y-2 mb-4 border border-gray-100">
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Helpline:</span> +91 98765 43210
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Email:</span> logistics@watchhub.in
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Shift Manager:</span> Amit Sharma
              </p>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#D6A63C] text-[#071426] font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
