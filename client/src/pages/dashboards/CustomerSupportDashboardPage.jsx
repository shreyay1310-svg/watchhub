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
  XAxis,
  YAxis,
} from 'recharts';
import {
  Headphones,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Star,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Compass,
  MessageSquare,
  Users,
  Package,
  RotateCcw,
  ShieldAlert,
  BookOpen,
  FileText,
  BarChart3,
  SlidersHorizontal,
  Eye,
  MoreVertical,
  X,
  Send,
  UserCheck,
  Check,
  CornerDownRight,
  Paperclip,
  ThumbsUp,
  Tag,
  Phone,
  Mail,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  HelpCircle,
  Copy,
} from 'lucide-react';

export default function CustomerSupportDashboardPage() {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation tab states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 Days');

  // Filter state for ticket table
  const [ticketFilterTab, setTicketFilterTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [issueTypeFilter, setIssueTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');

  // Selected tickets for batch actions
  const [selectedTicketIds, setSelectedTicketIds] = useState([]);

  // Data states from backend
  const [loading, setLoading] = useState(true);
  const [supportData, setSupportData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showLiveChatModal, setShowLiveChatModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showOrderLookupModal, setShowOrderLookupModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showKnowledgeBaseModal, setShowKnowledgeBaseModal] = useState(false);
  const [showCannedResponsesModal, setShowCannedResponsesModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Forms & Messaging
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [chatInputText, setChatInputText] = useState('');

  const [newTicketForm, setNewTicketForm] = useState({
    customer: '',
    customerEmail: '',
    customerPhone: '',
    orderId: '',
    productName: 'Rolex Submariner Date 41mm',
    subject: '',
    category: 'Shipping',
    priority: 'Medium',
    message: '',
  });

  const [refundForm, setRefundForm] = useState({
    orderId: '#WH12548',
    customer: 'Ananya Singh',
    amount: 18999,
    reason: 'Delayed delivery request or item return',
  });

  const [lookupQuery, setLookupQuery] = useState('');

  // Toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Fetch support data from backend
  const fetchSupportData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support');
      if (!res.ok) throw new Error('Failed to load support records.');
      const json = await res.json();
      if (json.status === 'success') {
        setSupportData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportData();
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const el = document.getElementById('global-support-search');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered tickets
  const tickets = useMemo(() => {
    if (!supportData?.tickets) return [];
    return supportData.tickets.filter((t) => {
      // Tab filter
      if (ticketFilterTab === 'Open' && t.status !== 'Open') return false;
      if (ticketFilterTab === 'In Progress' && t.status !== 'In Progress') return false;
      if (ticketFilterTab === 'Pending' && t.status !== 'Pending') return false;
      if (ticketFilterTab === 'Resolved' && t.status !== 'Resolved') return false;
      if (ticketFilterTab === 'Escalated' && t.status !== 'Escalated') return false;

      // Dropdown filters
      if (issueTypeFilter !== 'All' && t.category.toLowerCase() !== issueTypeFilter.toLowerCase()) return false;
      if (priorityFilter !== 'All' && t.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;
      if (agentFilter !== 'All' && t.assignedTo.toLowerCase() !== agentFilter.toLowerCase()) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          t.ticketId.toLowerCase().includes(q) ||
          t.customer.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [supportData, ticketFilterTab, issueTypeFilter, priorityFilter, agentFilter, searchQuery]);

  // Handle Select All / Single Checkbox
  const handleSelectTicket = (id) => {
    setSelectedTicketIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTicketIds.length === tickets.length) {
      setSelectedTicketIds([]);
    } else {
      setSelectedTicketIds(tickets.map((t) => t.ticketId));
    }
  };

  // Create Ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicketForm),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Ticket ${data.data.ticketId} created successfully!`);
        setShowCreateTicketModal(false);
        fetchSupportData();
      } else {
        alert(data.message || 'Error creating ticket.');
      }
    } catch (err) {
      alert('Network error creating ticket.');
    }
  };

  // Send Reply in Ticket Details
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    try {
      const res = await fetch('/api/support/ticket/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.ticketId,
          replyText,
          isInternal: isInternalNote,
          agentName: 'Pooja (Support Manager)',
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(isInternalNote ? 'Internal note added.' : 'Reply delivered to customer.');
        setSelectedTicket(data.data);
        setReplyText('');
        fetchSupportData();
      }
    } catch (err) {
      alert('Error sending message.');
    }
  };

  // Update Status / Escalation
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch('/api/support/ticket/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.ticketId,
          newStatus,
        }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(`Ticket ${selectedTicket.ticketId} marked as ${newStatus}.`);
        setSelectedTicket(data.data);
        fetchSupportData();
      }
    } catch (err) {
      alert('Error updating status.');
    }
  };

  // Handle Issue Refund
  const handleIssueRefund = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/support/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(refundForm),
      });
      const data = await res.json();
      if (data.status === 'success') {
        triggerToast(data.message);
        setShowRefundModal(false);
      }
    } catch (err) {
      alert('Error initiating refund.');
    }
  };

  // Export Tickets CSV
  const handleExportCSV = () => {
    if (!tickets || tickets.length === 0) return;
    const headers = ['Ticket ID', 'Customer', 'Email', 'Order ID', 'Subject', 'Category', 'Priority', 'Status', 'Assigned To', 'Last Updated'];
    const rows = tickets.map((t) => [
      t.ticketId,
      `"${t.customer}"`,
      t.customerEmail,
      t.orderId,
      `"${t.subject}"`,
      t.category,
      t.priority,
      t.status,
      t.assignedTo,
      `"${t.lastUpdated}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WatchHub_Tickets_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Support ticket report exported.');
  };

  // KPI Mini Wave mock points
  const waveDataTotal = [{ v: 22 }, { v: 24 }, { v: 20 }, { v: 28 }, { v: 32 }, { v: 36 }, { v: 42 }];
  const waveDataResolved = [{ v: 18 }, { v: 22 }, { v: 25 }, { v: 28 }, { v: 34 }, { v: 38 }, { v: 44 }];
  const waveDataPending = [{ v: 14 }, { v: 16 }, { v: 13 }, { v: 11 }, { v: 9 }, { v: 8 }, { v: 7 }];
  const waveDataEscalated = [{ v: 8 }, { v: 6 }, { v: 7 }, { v: 5 }, { v: 4 }, { v: 3 }, { v: 2 }];
  const waveDataResponse = [{ v: 9 }, { v: 8 }, { v: 6 }, { v: 5 }, { v: 4.5 }, { v: 4.2 }, { v: 4.0 }];
  const waveDataCsat = [{ v: 4.4 }, { v: 4.5 }, { v: 4.6 }, { v: 4.65 }, { v: 4.7 }, { v: 4.75 }, { v: 4.8 }];

  // Sidebar navigation menu
  const SIDEBAR_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'tickets', label: 'Support Tickets', icon: Headphones, badge: '42' },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare, hasDot: true },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders & Returns', icon: Package },
    { id: 'refunds', label: 'Refunds & Replacements', icon: CreditCard },
    { id: 'escalations', label: 'Escalations', icon: ShieldAlert },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    { id: 'canned', label: 'Canned Responses', icon: FileText },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team & Permissions', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentRole = user?.role || ROLES.CUSTOMER_SUPPORT;

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-gray-800 flex flex-col font-poppins antialiased selection:bg-[#D6A63C]/30 selection:text-black">
      {/* Toast Alert */}
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
                  Customer Support
                </span>
              </div>
            </Link>
          </div>

          {/* Global Search with Ctrl+K */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="global-support-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Ticket ID, Order ID, Customer, Issue..."
                className="w-full pl-10 pr-16 py-2 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-gray-400 text-xs sm:text-sm border border-white/15 focus:border-[#D6A63C] outline-none transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold bg-white/15 text-gray-300 px-1.5 py-0.5 rounded border border-white/20">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Top Actions */}
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

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 text-gray-800 z-50 animate-fade-in text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold">
                    <span>Support Queue Alerts</span>
                    <span className="text-[10px] text-[#D6A63C] cursor-pointer">Clear</span>
                  </div>
                  <div className="space-y-2.5 mt-2.5">
                    <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                      <p className="font-bold text-rose-900">Urgent: Order #WH12548</p>
                      <p className="text-[11px] text-rose-700">Customer Ananya Singh requested status update (SLA 2h).</p>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="font-bold text-amber-900">Return #RET-8905 Approved</p>
                      <p className="text-[11px] text-amber-700">Scheduled pickup for Rahul Verma.</p>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="font-bold text-blue-900">Live Chat Incoming</p>
                      <p className="text-[11px] text-blue-700">Priya Yadav joined the queue.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Cog */}
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Support Desk Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Support Manager Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Support Manager"
                  className="w-7 h-7 rounded-lg object-cover border border-[#D6A63C]"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none">Support Manager</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-300" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-gray-800 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-sm text-[#071426]">Pooja Gupta</p>
                    <p className="text-[11px] text-gray-500">support@watchhub.in</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-amber-50 text-[#D6A63C] text-[10px] font-bold border border-[#D6A63C]/30">
                      Support Lead & Manager
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
                            if (r === ROLES.DELIVERY_MANAGER) navigate('/delivery-manager/dashboard');
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
          <div className="p-4 space-y-1.5 overflow-y-auto">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'chat') {
                      const firstChat = supportData?.conversations?.[0];
                      if (firstChat) setSelectedChat(firstChat);
                      setShowLiveChatModal(true);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#D6A63C] text-[#071426] shadow-lg font-bold shadow-[#D6A63C]/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#071426]' : 'text-gray-400'}`} />
                  {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white">
                      {item.badge}
                    </span>
                  )}
                  {!sidebarCollapsed && item.hasDot && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
                  <Headphones className="w-4 h-4 text-[#D6A63C]" />
                  <span>Need Help?</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                  Customer support operations, SLAs & inbox setup.
                </p>
                <button
                  onClick={() => setShowContactAdminModal(true)}
                  className="w-full py-1.5 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Contact Admin →
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
                🎧
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  Customer Support Dashboard
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage customer queries, orders, returns, refunds and service requests for WatchHub.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Filter Dropdown */}
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
                    {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month'].map((r) => (
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

              {/* Create Ticket Primary Button */}
              <button
                onClick={() => setShowCreateTicketModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold text-xs sm:text-sm shadow-md shadow-[#D6A63C]/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>

          {/* 6 KPI CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Tickets */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500">Total Tickets</span>
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
                  📦
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {supportData?.stats?.totalTickets?.toLocaleString() || '1,248'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-purple-600 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{supportData?.stats?.totalTicketsTrend || '+12%'}</span>
                  </div>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataTotal}>
                      <Area type="monotone" dataKey="v" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 2. Resolved */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500">Resolved</span>
                <div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xs">
                  ✓
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {supportData?.stats?.resolved?.toLocaleString() || '1,096'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{supportData?.stats?.resolvedTrend || '+15%'}</span>
                  </div>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataResolved}>
                      <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 3. Pending */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500">Pending</span>
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                  ⏱
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {supportData?.stats?.pending || '108'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 mt-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>{supportData?.stats?.pendingTrend || '-8%'}</span>
                  </div>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataPending}>
                      <Area type="monotone" dataKey="v" stroke="#D97706" fill="#D97706" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 4. Escalated */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500">Escalated</span>
                <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                  ⚠️
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {supportData?.stats?.escalated || '24'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600 mt-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>{supportData?.stats?.escalatedTrend || '-20%'}</span>
                  </div>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataEscalated}>
                      <Area type="monotone" dataKey="v" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 5. Avg. Response Time */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500">Avg. Response Time</span>
                <div className="w-6 h-6 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center text-xs">
                  ⚡
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {supportData?.stats?.avgResponseTime || '4m 32s'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 mt-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    <span>{supportData?.stats?.avgResponseTimeTrend || '-28%'}</span>
                  </div>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataResponse}>
                      <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 6. CSAT */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-gray-500">CSAT (Customer Rating)</span>
                <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                  ⭐
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    {supportData?.stats?.csat || '4.8 / 5'}
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>{supportData?.stats?.csatTrend || '+0.2'}</span>
                  </div>
                </div>
                <div className="w-12 h-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={waveDataCsat}>
                      <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN MIDDLE SECTION: TICKET TABLE (8 cols) + RIGHT PANEL CARDS (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* TICKET MANAGEMENT TABLE (lg:col-span-8) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-8 space-y-4">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'All', label: 'All Tickets (1,248)' },
                  { id: 'Open', label: 'Open (108)' },
                  { id: 'In Progress', label: 'In Progress (44)' },
                  { id: 'Pending', label: 'Pending (64)' },
                  { id: 'Resolved', label: 'Resolved (1,096)' },
                  { id: 'Escalated', label: 'Escalated (24)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTicketFilterTab(t.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      ticketFilterTab === t.id
                        ? 'bg-[#071426] text-white shadow-xs'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Filters Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ticket, order ID or customer..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:border-[#D6A63C] outline-none"
                  />
                </div>

                <select
                  value={issueTypeFilter}
                  onChange={(e) => setIssueTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">Issue Type</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Returns">Returns</option>
                  <option value="Refunds">Refunds</option>
                  <option value="Replacement">Replacement</option>
                  <option value="Product Info">Product Info</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-700 bg-white focus:border-[#D6A63C] outline-none"
                >
                  <option value="All">Agent</option>
                  <option value="Rohan">Rohan</option>
                  <option value="Neha">Neha</option>
                  <option value="Amit">Amit</option>
                  <option value="Pooja">Pooja</option>
                </select>

                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIssueTypeFilter('All');
                    setPriorityFilter('All');
                    setAgentFilter('All');
                    setTicketFilterTab('All');
                    triggerToast('Filters reset.');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="p-3 w-8">
                        <input
                          type="checkbox"
                          checked={tickets.length > 0 && selectedTicketIds.length === tickets.length}
                          onChange={handleSelectAll}
                          className="rounded text-[#D6A63C] focus:ring-[#D6A63C]"
                        />
                      </th>
                      <th className="p-3 font-semibold text-gray-700">Ticket ID</th>
                      <th className="p-3 font-semibold text-gray-700">Customer</th>
                      <th className="p-3 font-semibold text-gray-700">Order ID</th>
                      <th className="p-3 font-semibold text-gray-700">Subject / Issue</th>
                      <th className="p-3 font-semibold text-gray-700">Category</th>
                      <th className="p-3 font-semibold text-gray-700">Priority</th>
                      <th className="p-3 font-semibold text-gray-700">Status</th>
                      <th className="p-3 font-semibold text-gray-700">Assigned To</th>
                      <th className="p-3 font-semibold text-gray-700">Last Updated</th>
                      <th className="p-3 text-right font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="p-8 text-center text-gray-400">
                          No support tickets found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      tickets.map((t) => {
                        const isChecked = selectedTicketIds.includes(t.ticketId);
                        return (
                          <tr
                            key={t.id}
                            className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedTicket(t);
                              setShowTicketDetailsModal(true);
                            }}
                          >
                            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleSelectTicket(t.ticketId)}
                                className="rounded text-[#D6A63C] focus:ring-[#D6A63C]"
                              />
                            </td>
                            <td className="p-3 font-bold text-gray-900 whitespace-nowrap">
                              {t.ticketId}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <img
                                  src={t.customerAvatar}
                                  alt={t.customer}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-200"
                                />
                                <span className="font-semibold text-gray-900">{t.customer}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono font-medium text-gray-700 whitespace-nowrap">
                              {t.orderId}
                            </td>
                            <td className="p-3 font-medium text-gray-900 max-w-xs truncate">
                              {t.subject}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                                style={{
                                  backgroundColor: `${t.categoryColor}15`,
                                  color: t.categoryColor,
                                }}
                              >
                                {t.category}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  t.priority === 'High'
                                    ? 'bg-rose-100 text-rose-700'
                                    : t.priority === 'Medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                              >
                                {t.priority}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  t.status === 'Resolved'
                                    ? 'bg-green-100 text-green-700'
                                    : t.status === 'In Progress'
                                    ? 'bg-blue-100 text-blue-700'
                                    : t.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-700'
                                    : t.status === 'Escalated'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={t.assignedAvatar}
                                  alt={t.assignedTo}
                                  className="w-5 h-5 rounded-full object-cover border border-gray-200"
                                />
                                <span className="font-medium text-gray-800">{t.assignedTo}</span>
                              </div>
                            </td>
                            <td className="p-3 text-gray-500 whitespace-nowrap">
                              {t.lastUpdated}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedTicket(t);
                                    setShowTicketDetailsModal(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                  title="View Ticket Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTicket(t);
                                    setShowTicketDetailsModal(true);
                                  }}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                                  title="More Actions"
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

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
                <span>Showing 1-5 of 1,248 tickets</span>
                <div className="flex items-center gap-1">
                  <select className="px-2 py-1 rounded-lg border border-gray-200 text-xs bg-white text-gray-700 outline-none mr-2">
                    <option>5 per page</option>
                    <option>10 per page</option>
                    <option>25 per page</option>
                  </select>
                  <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">«</button>
                  <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">‹</button>
                  <button className="px-2.5 py-1 rounded bg-[#D6A63C] text-[#071426] font-bold">1</button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">2</button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">3</button>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">4</button>
                  <span className="px-1">...</span>
                  <button className="px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50">250</button>
                  <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">›</button>
                  <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">»</button>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: TICKET STATUS OVERVIEW + QUICK ACTIONS (lg:col-span-4) */}
            <div className="space-y-5 lg:col-span-4">
              {/* CARD 1: TICKET STATUS OVERVIEW DONUT */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Ticket Status Overview</h3>

                <div className="flex items-center justify-center gap-4">
                  {/* Donut */}
                  <div className="relative w-36 h-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={supportData?.statusBreakdown || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={60}
                          paddingAngle={3}
                          dataKey="count"
                          cursor="pointer"
                          onClick={(entry) => {
                            setTicketFilterTab(entry.name);
                            triggerToast(`Filtered by ${entry.name}`);
                          }}
                        >
                          {(supportData?.statusBreakdown || []).map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-sm font-extrabold text-gray-900 leading-none">1,248</span>
                      <span className="text-[9px] text-gray-500 font-medium mt-0.5">Tickets</span>
                    </div>
                  </div>

                  {/* Legend Slices */}
                  <div className="space-y-1.5 text-xs flex-1">
                    {(supportData?.statusBreakdown || []).map((item) => (
                      <div
                        key={item.name}
                        onClick={() => setTicketFilterTab(item.name)}
                        className="flex items-center justify-between p-1 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-700 font-medium text-[11px]">{item.name}</span>
                        </div>
                        <span className="font-bold text-gray-900 text-[11px]">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 2: QUICK ACTIONS (4 Buttons) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Quick Actions</h3>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* Create Ticket */}
                  <button
                    onClick={() => setShowCreateTicketModal(true)}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                  >
                    <Plus className="w-4 h-4 text-[#D6A63C]" />
                    <span className="font-semibold text-gray-800">Create Ticket</span>
                  </button>

                  {/* Order Lookup */}
                  <button
                    onClick={() => setShowOrderLookupModal(true)}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                  >
                    <Package className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-gray-800">Order Lookup</span>
                  </button>

                  {/* Process Return */}
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-800">Process Return</span>
                  </button>

                  {/* Issue Refund */}
                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-white hover:border-[#D6A63C] flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-xs group cursor-pointer text-center"
                  >
                    <span className="text-base font-bold text-rose-600">₹</span>
                    <span className="font-semibold text-gray-800">Issue Refund</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: 3 PANELS (Recent Conversations + Ticket Trend Area Chart + Top Performing Agents) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* 1. RECENT CONVERSATIONS (lg:col-span-4) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Recent Conversations</h3>
                <button
                  onClick={() => {
                    const firstChat = supportData?.conversations?.[0];
                    if (firstChat) setSelectedChat(firstChat);
                    setShowLiveChatModal(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3 my-auto">
                {(supportData?.conversations || []).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowLiveChatModal(true);
                    }}
                    className="p-2.5 rounded-xl border border-gray-100 hover:border-[#D6A63C] bg-gray-50/50 hover:bg-white transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${chat.avatarColor} text-white font-bold text-xs flex items-center justify-center`}
                      >
                        {chat.avatarInitials}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-900">{chat.customer}</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-[170px]">{chat.lastMessage}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">{chat.time}</p>
                      {chat.unreadCount > 0 && (
                        <span className="inline-block px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white mt-0.5">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. TICKET TREND AREA CHART (lg:col-span-5) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Ticket Trend</h3>
                <span className="text-xs text-gray-500">Tickets ▾</span>
              </div>

              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={supportData?.ticketTrend || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="tickets" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#purpleGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. TOP PERFORMING AGENTS (lg:col-span-3) */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs lg:col-span-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Top Performing Agents</h3>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3 my-auto">
                {(supportData?.agents || []).slice(0, 3).map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{agent.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              agent.status === 'Online' ? 'bg-green-500' : 'bg-amber-500'
                            }`}
                          />
                          <span className="text-[10px] text-gray-500">{agent.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gray-900">{agent.ticketsResolved}</p>
                      <p className="text-[10px] text-green-600 font-bold">{agent.csat} CSAT</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================================
          MODALS & CRM DRAWERS
      ========================================================================== */}

      {/* 1. TICKET DETAILS 3-PANEL CRM MODAL */}
      {showTicketDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-6xl w-full h-[90vh] shadow-2xl border border-gray-100 text-xs flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-3.5 bg-[#071426] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-base text-[#D6A63C]">{selectedTicket.ticketId}</span>
                <span className="text-gray-300">•</span>
                <span className="font-bold text-white text-sm">{selectedTicket.subject}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${selectedTicket.categoryColor}30`, color: '#F3D78E' }}
                >
                  {selectedTicket.category}
                </span>
              </div>
              <button
                onClick={() => setShowTicketDetailsModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Panel CRM Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {/* LEFT PANEL: Customer Profile & Order History (lg:col-span-3) */}
              <div className="lg:col-span-3 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
                <div className="text-center pb-3 border-b border-gray-200">
                  <img
                    src={selectedTicket.customerAvatar}
                    alt={selectedTicket.customer}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2 border-2 border-[#D6A63C]"
                  />
                  <h4 className="font-bold text-sm text-gray-900">{selectedTicket.customer}</h4>
                  <p className="text-[11px] text-gray-500">Verified Customer</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Info</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedTicket.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{selectedTicket.customerPhone}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-200">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Related Order</span>
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                    <p className="font-bold text-gray-900">{selectedTicket.orderId}</p>
                    <p className="text-gray-600">{selectedTicket.productName}</p>
                    <span className="inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      In Transit / Out for Delivery
                    </span>
                  </div>
                </div>
              </div>

              {/* CENTER PANEL: Conversation History & Reply Editor (lg:col-span-6) */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full bg-white">
                {/* Thread Messages */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
                  {(selectedTicket.messages || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.senderType === 'agent' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400">
                        <span className="font-bold text-gray-700">{msg.sender}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-md leading-relaxed text-xs ${
                          msg.senderType === 'agent'
                            ? 'bg-[#071426] text-white rounded-tr-xs'
                            : 'bg-gray-100 text-gray-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {/* Internal Notes */}
                  {(selectedTicket.internalNotes || []).map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                      <div className="flex items-center justify-between font-bold text-[10px] mb-1">
                        <span>🔒 Internal Staff Note ({note.author})</span>
                        <span>{note.time}</span>
                      </div>
                      <p>{note.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Editor Form */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/70">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsInternalNote(false)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                          !isInternalNote ? 'bg-[#071426] text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Customer Reply
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsInternalNote(true)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                          isInternalNote ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Internal Note
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCannedResponsesModal(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Use Canned Template</span>
                    </button>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-2">
                    <textarea
                      rows="3"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={
                        isInternalNote
                          ? 'Add a private note visible only to support staff...'
                          : `Reply to ${selectedTicket.customer}...`
                      }
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 outline-none focus:border-[#D6A63C]"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">Press Send to deliver instant update</span>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isInternalNote ? 'Save Note' : 'Send Reply'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* RIGHT PANEL: Status, Priority, SLA & Quick Resolution (lg:col-span-3) */}
              <div className="lg:col-span-3 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    SLA Countdown
                  </span>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-amber-900 font-bold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>{selectedTicket.slaDeadline}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Ticket Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Open', 'In Progress', 'Pending', 'Resolved', 'Escalated'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(st)}
                        className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                          selectedTicket.status === st
                            ? 'bg-[#071426] text-white font-bold'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-[#D6A63C]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Workflow Triggers
                  </span>
                  <button
                    onClick={() => {
                      setRefundForm({
                        orderId: selectedTicket.orderId,
                        customer: selectedTicket.customer,
                        amount: 18999,
                        reason: selectedTicket.subject,
                      });
                      setShowRefundModal(true);
                    }}
                    className="w-full py-2 rounded-xl bg-white border border-gray-200 hover:border-rose-300 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>₹ Initiate Refund</span>
                  </button>
                  <button
                    onClick={() => {
                      triggerToast(`Reverse pickup scheduled for ${selectedTicket.orderId}.`);
                    }}
                    className="w-full py-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>⇄ Schedule Replacement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATE TICKET MODAL */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-bold text-base text-[#071426]">Create Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowCreateTicketModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newTicketForm.customer}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, customer: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Order ID</label>
                  <input
                    type="text"
                    value={newTicketForm.orderId}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, orderId: e.target.value })}
                    placeholder="#WH12548"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Issue Subject *</label>
                <input
                  type="text"
                  required
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  placeholder="e.g. Order delayed / wrong color received"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="Shipping">Shipping</option>
                    <option value="Returns">Returns</option>
                    <option value="Refunds">Refunds</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Product Info">Product Info</option>
                    <option value="Warranty">Warranty & Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:border-[#D6A63C] outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Detailed Message</label>
                <textarea
                  rows="3"
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  placeholder="Customer description or call notes..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTicketModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D6A63C] hover:bg-[#c49533] text-[#071426] font-bold shadow-md cursor-pointer"
                >
                  Create & Assign Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. LIVE CHAT MODAL */}
      {showLiveChatModal && selectedChat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full h-[520px] shadow-2xl border border-gray-100 text-xs flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 bg-[#071426] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${selectedChat.avatarColor} text-white font-bold flex items-center justify-center`}>
                  {selectedChat.avatarInitials}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{selectedChat.customer}</p>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-300">Live Support Chat</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLiveChatModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/60">
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-gray-400 mb-0.5">{selectedChat.customer}</span>
                <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-gray-200 text-gray-800 shadow-2xs leading-relaxed">
                  {selectedChat.lastMessage}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 mb-0.5">Support Executive</span>
                <div className="p-3 rounded-2xl rounded-tr-xs bg-[#071426] text-white shadow-2xs leading-relaxed">
                  Hello {selectedChat.customer}! I am reviewing your order status right now.
                </div>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#D6A63C]"
              />
              <button
                onClick={() => {
                  if (!chatInputText.trim()) return;
                  triggerToast('Chat message sent.');
                  setChatInputText('');
                }}
                className="p-2 rounded-xl bg-[#D6A63C] text-[#071426] font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ISSUE REFUND MODAL */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-[#071426]">Issue Customer Refund</h3>
              </div>
              <button
                onClick={() => setShowRefundModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueRefund} className="space-y-3.5 mt-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  required
                  value={refundForm.orderId}
                  onChange={(e) => setRefundForm({ ...refundForm, orderId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer</label>
                <input
                  type="text"
                  required
                  value={refundForm.customer}
                  onChange={(e) => setRefundForm({ ...refundForm, customer: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={refundForm.amount}
                  onChange={(e) => setRefundForm({ ...refundForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-rose-600 focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:border-[#D6A63C] outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Confirm & Transfer Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ORDER LOOKUP MODAL */}
      {showOrderLookupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-[#071426]">Order Verification & Lookup</h3>
              </div>
              <button
                onClick={() => setShowOrderLookupModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Enter Order ID (e.g. WH12548)..."
                  className="flex-1 p-2.5 rounded-xl border border-gray-200 text-xs outline-none focus:border-[#D6A63C]"
                />
                <button
                  onClick={() => triggerToast('Verified live order from WatchHub database.')}
                  className="px-4 py-2.5 rounded-xl bg-[#D6A63C] text-[#071426] font-bold text-xs cursor-pointer"
                >
                  Search
                </button>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-gray-900">
                  <span>Order #WH12548</span>
                  <span className="text-green-600">Paid • Verified</span>
                </div>
                <p className="text-gray-600">Product: Rolex Submariner Date 41mm (₹18,999)</p>
                <p className="text-gray-600">Customer: Ananya Singh (+91 98123 45678)</p>
                <p className="text-gray-600">Courier: BlueDart (AWB: BLU8901234567)</p>
                <p className="text-gray-600">Status: Out for Delivery (Rider: Rohan Singh)</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowOrderLookupModal(false)}
                className="px-4 py-2 rounded-xl bg-[#071426] text-white font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CANNED RESPONSES PICKER MODAL */}
      {showCannedResponsesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-bold text-base text-[#071426]">Canned Response Templates</h3>
              </div>
              <button
                onClick={() => setShowCannedResponsesModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4 max-h-72 overflow-y-auto">
              {(supportData?.cannedResponses || []).map((cr) => (
                <div
                  key={cr.id}
                  onClick={() => {
                    setReplyText(cr.text);
                    setShowCannedResponsesModal(false);
                    triggerToast(`Inserted template: ${cr.title}`);
                  }}
                  className="p-3 rounded-xl border border-gray-100 hover:border-[#D6A63C] bg-gray-50/50 hover:bg-white transition-all cursor-pointer"
                >
                  <p className="font-bold text-gray-900 mb-1">{cr.title}</p>
                  <p className="text-gray-600 line-clamp-2 leading-relaxed">{cr.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. TEAM MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D6A63C]" />
                <h3 className="font-bold text-base text-[#071426]">Support Team & Roles</h3>
              </div>
              <button
                onClick={() => setShowTeamModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4">
              {(supportData?.agents || []).map((agt) => (
                <div key={agt.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={agt.avatar} alt={agt.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{agt.name}</p>
                      <p className="text-[10px] text-gray-500">{agt.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      {agt.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{agt.ticketsResolved} solved</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. CONTACT ADMIN MODAL */}
      {showContactAdminModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D6A63C] text-2xl flex items-center justify-center mx-auto mb-3">
              🏛
            </div>
            <h3 className="font-bold text-base text-[#071426] mb-1">Store Admin Escalation Desk</h3>
            <p className="text-gray-500 mb-4 leading-relaxed">
              Contact the central Store Administrator for permission changes, large refund approvals, and catalog adjustments.
            </p>
            <div className="p-3 bg-gray-50 rounded-2xl text-left space-y-2 mb-4 border border-gray-100 text-xs">
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Admin Email:</span> admin@watchhub.in
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800">Internal Extension:</span> Ext. 402 (Admin Office)
              </p>
            </div>
            <button
              onClick={() => setShowContactAdminModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#D6A63C] text-[#071426] font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
