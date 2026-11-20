import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  ShieldAlert,
  ArrowUpRight,
  User,
  Phone,
  Mail,
  MapPin,
  Package,
  RotateCcw,
  Star,
  Award,
  CreditCard,
  FileText,
  Check,
  AlertTriangle,
  Gift,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  Eye,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';

import ReviewsRatingsTab from '../../support/ReviewsRatingsTab';
import SupportTicketsTab from '../../support/SupportTicketsTab';
import {
  INITIAL_TICKETS,
  INITIAL_QUERIES,
  INITIAL_REFUNDS,
  INITIAL_COMPLAINTS,
  INITIAL_REVIEWS,
  INITIAL_CUSTOMERS
} from '../../../data/customerSupportMockData';
export const CustomerSupportModule = ({ activeSubTab = 'support_tickets', onSubTabChange }) => {
  const [currentTab, setCurrentTab] = useState(activeSubTab);

  // Tickets state
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeTicket, setActiveTicket] = useState(INITIAL_TICKETS[0]);
  const [replyText, setReplyText] = useState('');
  const [searchTicket, setSearchTicket] = useState('');
  const [filterTicketStatus, setFilterTicketStatus] = useState('All');

  // Queries state
  const [queries, setQueries] = useState(INITIAL_QUERIES);
  const [activeQuery, setActiveQuery] = useState(INITIAL_QUERIES[0]);
  const [queryReply, setQueryReply] = useState('');

  // Orders Lookup state
  const [lookupQuery, setLookupQuery] = useState('#WH12548');
  const [orderProfile, setOrderProfile] = useState(MOCK_ORDER_LOOKUP);

  // Refunds state
  const [refunds, setRefunds] = useState(INITIAL_REFUNDS);

  // Complaints state
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);

  // Reviews state
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Customer Management state
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchCustomer, setSearchCustomer] = useState('');

  // Keep in sync with parent prop
  useEffect(() => {
    if (activeSubTab) {
      setCurrentTab(activeSubTab);
    }
  }, [activeSubTab]);

  const switchTab = (tab) => {
    setCurrentTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  // Reply to ticket
  const handleSendTicketReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    const newMsg = {
      sender: 'Support Executive (You)',
      text: replyText.trim(),
      time: 'Just now'
    };
    const updated = {
      ...activeTicket,
      status: 'In Progress',
      messages: [...activeTicket.messages, newMsg]
    };
    setActiveTicket(updated);
    setTickets(tickets.map(t => t.id === updated.id ? updated : t));
    setReplyText('');
  };

  // Reply to Live Query
  const handleSendQueryReply = (e) => {
    e.preventDefault();
    if (!queryReply.trim()) return;
    alert(`💬 Reply sent to ${activeQuery.customer}: "${queryReply}"`);
    setQueries(queries.map(q => q.id === activeQuery.id ? { ...q, status: 'Replied' } : q));
    setQueryReply('');
  };

  // Authorize Instant Refund
  const handleAuthorizeRefund = (rfdId) => {
    setRefunds(refunds.map(r => r.id === rfdId ? { ...r, status: 'Instant UPI Settled' } : r));
    alert(`💳 Refund ${rfdId} triggered through Razorpay Sandbox! ARN generated and SMS sent to buyer.`);
  };

  // Resolve Complaint
  const handleResolveComplaint = (cmpId) => {
    setComplaints(complaints.map(c => c.id === cmpId ? { ...c, status: 'Resolved' } : c));
    alert(`✅ Escalation ${cmpId} marked as Resolved! Customer satisfaction survey dispatched.`);
  };

  // Approve Review
  const handleApproveReview = (revId) => {
    setReviews(reviews.map(r => r.id === revId ? { ...r, status: 'Approved & Published' } : r));
    alert(`⭐ Review ${revId} approved! Published to public watch product page.`);
  };

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchSearch = t.customer.toLowerCase().includes(searchTicket.toLowerCase()) ||
                        t.id.toLowerCase().includes(searchTicket.toLowerCase()) ||
                        t.orderId.toLowerCase().includes(searchTicket.toLowerCase());
    const matchStatus = filterTicketStatus === 'All' || t.status === filterTicketStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Upper Module Sub-Tab Switcher Bar (Matches User Reference Screenshots) */}
      <div className="bg-[#10182D]/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-sm flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => switchTab('support_tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'support_tickets'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>🎫</span> Support Tickets
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold">
              {tickets.filter(t => t.status !== 'Resolved').length}
            </span>
          </button>

          <button
            onClick={() => switchTab('customer_queries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'customer_queries'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>💬</span> Customer Queries
            <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full font-bold">
              {queries.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('orders_lookup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'orders_lookup'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>🔍</span> Orders Lookup
          </button>

          <button
            onClick={() => switchTab('returns_refunds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'returns_refunds'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>🔄</span> Returns & Refunds
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded-full font-bold">
              {refunds.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('complaints')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'complaints'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>⚠️</span> Complaints & Escalations
            <span className="text-[10px] px-1.5 py-0.2 bg-rose-200 text-rose-900 rounded-full font-bold">
              {complaints.filter(c => c.status !== 'Resolved').length}
            </span>
          </button>

          <button
            onClick={() => switchTab('reviews_ratings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'reviews_ratings'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>⭐</span> Reviews & Ratings
          </button>

          <button
            onClick={() => switchTab('customer_management')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'customer_management'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-[#A6B1C8] hover:bg-white/5'
            }`}
          >
            <span>👥</span> Customer Management
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-[#A6B1C8] font-semibold pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Helpdesk SLA: 99.1% First Contact Res.</span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: SUPPORT TICKETS (🎫 Support Tickets)
          ========================================================================= */}
      {currentTab === 'support_tickets' && (
        <SupportTicketsTab
          tickets={tickets}
          setTickets={setTickets}
          filteredTickets={filteredTickets}
          searchTicket={searchTicket}
          setSearchTicket={setSearchTicket}
          filterTicketStatus={filterTicketStatus}
          setFilterTicketStatus={setFilterTicketStatus}
          activeTicket={activeTicket}
          setActiveTicket={setActiveTicket}
          replyText={replyText}
          setReplyText={setReplyText}
          handleSendTicketReply={handleSendTicketReply}
        />
      )}

      {/* =========================================================================
          VIEW 2: CUSTOMER QUERIES (💬 Customer Queries)
          ========================================================================= */}
      {currentTab === 'customer_queries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Inquiries List */}
          <div className="lg:col-span-5 bg-[#10182D]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
              <span>Live Website Customer Inquiries</span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Live Chat Active
              </span>
            </h4>

            <div className="space-y-2.5">
              {queries.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setActiveQuery(q)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeQuery?.id === q.id
                      ? 'border-watch-gold bg-amber-50/60 shadow-sm'
                      : 'border-white/10 bg-[#10182D]/90 backdrop-blur-md hover:bg-[#0B1022]/80'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#F8FAFC] text-xs">{q.customer} ({q.city})</span>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'Replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A6B1C8] mt-1 font-medium">{q.query}</p>
                  <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[10.5px]">
                    <span className="text-watch-gold font-bold">{q.interestedWatch}</span>
                    <span className="text-gray-400 font-mono">{q.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Live Query Chat & Product Recommendation */}
          <div className="lg:col-span-7 bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
            <div className="pb-3 border-b border-white/10 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-[#F8FAFC]">
                  Pre-Purchase Consultation: {activeQuery.customer}
                </h4>
                <p className="text-xs text-[#A6B1C8]">
                  Browsing product: <span className="font-bold text-watch-navy-dark">{activeQuery.interestedWatch}</span> ({activeQuery.price})
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                High Purchase Intent
              </span>
            </div>

            {/* Chat Bubble Box */}
            <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 space-y-3 min-h-[220px]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-watch-navy-dark text-watch-gold flex items-center justify-center font-bold text-xs">
                  {activeQuery.customer.charAt(0)}
                </div>
                <div className="bg-[#10182D]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs max-w-md shadow-sm">
                  <p className="font-bold text-[#F8FAFC] text-[11px] mb-1">{activeQuery.customer}:</p>
                  <p className="text-[#A6B1C8]">{activeQuery.query}</p>
                </div>
              </div>
            </div>

            {/* One-Click WatchHub Recommender Cards */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#A6B1C8]">Attach Product Card & EMI Breakdown:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setQueryReply(`Yes, we provide 0% No-Cost EMI on HDFC & ICICI cards starting at ₹31,041/mo for the ${activeQuery.interestedWatch}. Would you like an instant approval checkout link?`)}
                  className="p-2.5 bg-[#0B1022]/80 hover:bg-white/5 rounded-xl border border-white/10 text-left"
                >
                  <span className="font-bold text-[#F8FAFC] block">💳 0% EMI Offer Preset</span>
                  <span className="text-[10.5px] text-[#A6B1C8]">Insert monthly split breakdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQueryReply(`100% Genuine & Brand New with official manufacturer warranty card, green hologram seal, and authorized dealer certificate stamped in Switzerland.`)}
                  className="p-2.5 bg-[#0B1022]/80 hover:bg-white/5 rounded-xl border border-white/10 text-left"
                >
                  <span className="font-bold text-[#F8FAFC] block">🛡️ Authenticity Guarantee</span>
                  <span className="text-[10.5px] text-[#A6B1C8]">Insert factory certificate proof</span>
                </button>
              </div>
            </div>

            {/* Reply Composer */}
            <form onSubmit={handleSendQueryReply} className="flex gap-2 pt-2">
              <input
                type="text"
                value={queryReply}
                onChange={(e) => setQueryReply(e.target.value)}
                placeholder="Type real-time response to buyer..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-white/15 text-xs outline-none focus:border-watch-gold"
              />
              <button
                type="submit"
                className="btn-gold px-4 h-10 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Send Answer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ORDERS LOOKUP (🔍 Orders Lookup)
          ========================================================================= */}
      {currentTab === 'orders_lookup' && (
        <div className="space-y-5">
          {/* Lookup Input Bar */}
          <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Search className="w-5 h-5 text-watch-gold" /> Deep Customer Order Lookup Engine
              </h4>
              <p className="text-xs text-[#A6B1C8] mt-0.5">
                Search by Order ID (#WH12548), Customer Phone, Email or Courier AWB.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-96">
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="e.g. #WH12548 or +91 98765 43210"
                className="flex-1 h-9 px-3 rounded-lg border border-white/15 text-xs font-mono outline-none focus:border-watch-gold"
              />
              <button
                onClick={() => {
                  alert(`🔍 Order profile retrieved for "${lookupQuery}"!`);
                }}
                className="px-4 h-9 bg-watch-navy-dark text-white rounded-lg text-xs font-bold hover:bg-black"
              >
                Search
              </button>
            </div>
          </div>

          {/* Detailed 360-degree Order Card */}
          {orderProfile && (
            <div className="bg-[#10182D]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-[#F8FAFC] font-mono">{orderProfile.id}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {orderProfile.payment.status}
                    </span>
                    <span className="px-2.5 py-0.5 bg-watch-gold/20 text-watch-navy-dark text-xs font-bold rounded-full">
                      {orderProfile.customer.tier}
                    </span>
                  </div>
                  <p className="text-xs text-[#A6B1C8] mt-1">Placed on {orderProfile.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('📄 Tax Invoice PDF generated and emailed to ' + orderProfile.customer.email)}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-gray-200 text-[#F8FAFC] text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Resend Invoice
                  </button>
                  <button
                    onClick={() => alert('📲 Tracking SMS resent to customer mobile number.')}
                    className="px-3.5 py-1.5 bg-watch-navy-dark text-white text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-black"
                  >
                    <Phone className="w-3.5 h-3.5 text-watch-gold" /> Resend Tracking SMS
                  </button>
                </div>
              </div>

              {/* 3 Columns: Customer & Address, Watch & Serial, Payment & Carrier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Col 1 */}
                <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <h5 className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-watch-gold" /> Customer & Shipping
                  </h5>
                  <p className="font-bold text-[#F8FAFC]">{orderProfile.customer.name}</p>
                  <p className="text-[#A6B1C8]">{orderProfile.customer.email}</p>
                  <p className="text-[#A6B1C8]">{orderProfile.customer.phone}</p>
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Delivery Address:</span>
                    <p className="text-[#A6B1C8] mt-0.5 leading-relaxed">{orderProfile.address}</p>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <h5 className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-watch-gold" /> Watch Item & Serial
                  </h5>
                  {orderProfile.items.map((it, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-watch-navy-dark text-sm">{it.name}</p>
                      <p className="font-mono text-[#A6B1C8]">SKU: {it.sku}</p>
                      <p className="font-mono text-[#A6B1C8]">Serial No: {it.serial}</p>
                      <p className="text-base font-extrabold text-emerald-600 pt-1">{it.price}</p>
                    </div>
                  ))}
                </div>

                {/* Col 3 */}
                <div className="bg-[#0B1022]/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <h5 className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-watch-gold" /> Payment & Logistics
                  </h5>
                  <p className="text-[#A6B1C8]">
                    Method: <span className="font-bold">{orderProfile.payment.method}</span>
                  </p>
                  <p className="font-mono text-[11px] text-[#A6B1C8]">Txn: {orderProfile.payment.txnId}</p>
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <p className="text-[#A6B1C8]">
                      Carrier: <span className="font-bold text-[#F8FAFC]">{orderProfile.shipping.carrier}</span>
                    </p>
                    <p className="text-watch-gold font-mono font-bold">AWB: {orderProfile.shipping.awb}</p>
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                      {orderProfile.shipping.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 4: RETURNS & REFUNDS (🔄 Returns & Refunds)
          ========================================================================= */}
      {currentTab === 'returns_refunds' && (
        <div className="space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Pending Authorizations</span>
              <p className="text-2xl font-black text-rose-600 mt-1">{refunds.length}</p>
              <span className="text-[10px] text-rose-500 font-bold">● Requires finance sign-off</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Processed This Month</span>
              <p className="text-2xl font-black text-[#F8FAFC] mt-1">₹8,34,995</p>
              <span className="text-[10px] text-emerald-500 font-bold">● 100% SLA compliant</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Avg Settlement Speed</span>
              <p className="text-2xl font-black text-blue-600 mt-1">24 min</p>
              <span className="text-[10px] text-blue-500 font-bold">● Instant UPI webhook</span>
            </div>
            <div className="bg-[#10182D]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-sm">
              <span className="text-[11px] font-semibold text-[#A6B1C8]">Gateway Failures</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">0</p>
              <span className="text-[10px] text-emerald-500 font-bold">● Razorpay healthy</span>
            </div>
          </div>

          {/* Refunds Management Table */}
          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-[#F8FAFC]">Refund Authorization & Bank ARN Tracker</h4>
                <p className="text-[11px] text-[#A6B1C8]">Trigger immediate UPI returns or bank credit for verified returns.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1022]/80 text-[#A6B1C8] font-semibold uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Refund ID & Order</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Refund Amount</th>
                    <th className="py-3 px-4">Payment Method & Bank ARN</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {refunds.map((rfd) => (
                    <tr key={rfd.id} className="hover:bg-[#0B1022]/80/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#F8FAFC] block">{rfd.id}</span>
                        <span className="text-[10px] text-gray-400">Order: {rfd.orderId}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#F8FAFC]">{rfd.customer}</td>
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">{rfd.amount}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#F8FAFC] block">{rfd.method}</span>
                        <span className="font-mono text-[10px] text-[#A6B1C8]">ARN: {rfd.arn}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rfd.status.includes('Settled')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rfd.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {rfd.status.includes('Settled') ? (
                          <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAuthorizeRefund(rfd.id)}
                            className="px-3 py-1.5 bg-watch-gold hover:bg-watch-gold-dark text-watch-navy-dark font-extrabold rounded-lg text-xs"
                          >
                            Authorize Instant Refund
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

      {/* =========================================================================
          VIEW 5: COMPLAINTS & ESCALATIONS (⚠️ Complaints)
          ========================================================================= */}
      {currentTab === 'complaints' && (
        <div className="space-y-5">
          <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> High-Severity Customer Complaints & Escalations
              </h4>
              <p className="text-xs text-[#A6B1C8] mt-0.5">
                Priority P0/P1 cases requiring supervisor intervention, apologies or compensation vouchers.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {complaints.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      cmp.severity.includes('P0')
                        ? 'bg-rose-600 text-white animate-pulse'
                        : cmp.severity.includes('P1')
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {cmp.severity}
                    </span>
                    <span className="font-mono font-bold text-[#F8FAFC] text-sm">{cmp.id}</span>
                    <span className="text-xs text-[#A6B1C8]">Order: {cmp.orderId}</span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    cmp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {cmp.status} ({cmp.slaTime})
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-[#F8FAFC] text-sm">{cmp.issue}</p>
                  <p className="text-[#A6B1C8]">Customer: <span className="font-bold text-[#F8FAFC]">{cmp.customer}</span> • Phone: {cmp.phone}</p>
                  <p className="text-[#A6B1C8] bg-[#0B1022]/80 p-2.5 rounded-xl border border-white/10">
                    <span className="font-bold text-[#F8FAFC]">Action Log:</span> {cmp.actionTaken}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => alert(`🎁 ₹1,000 compensation coupon (COMP1000) generated and emailed to ${cmp.customer}!`)}
                    className="px-3.5 py-1.5 bg-white/5 hover:bg-gray-200 text-[#F8FAFC] rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <Gift className="w-3.5 h-3.5 text-watch-gold" /> Issue Goodwill Voucher
                  </button>
                  {cmp.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolveComplaint(cmp.id)}
                      className="px-3.5 py-1.5 bg-watch-navy-dark hover:bg-black text-watch-gold rounded-lg text-xs font-bold"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 6: REVIEWS & RATINGS (⭐ Reviews & Ratings)
          ========================================================================= */}
      {currentTab === 'reviews_ratings' && (
        <ReviewsRatingsTab
          reviews={reviews}
          handleApproveReview={handleApproveReview}
        />
      )}

      {/* =========================================================================
          VIEW 7: CUSTOMER MANAGEMENT (👥 Customer Management)
          ========================================================================= */}
      {currentTab === 'customer_management' && (
        <div className="space-y-5">
          <div className="bg-[#10182D]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <User className="w-5 h-5 text-watch-gold" /> Customer 360° Directory & Lifetime Value
              </h4>
              <p className="text-xs text-[#A6B1C8] mt-0.5">
                Manage registered customer profiles, VIP membership tiers, and purchase histories.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                placeholder="Search customer, email, city..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-white/15 text-xs outline-none focus:border-watch-gold"
              />
            </div>
          </div>

          <div className="bg-[#10182D]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1022]/80 text-[#A6B1C8] font-semibold uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Customer Name & ID</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Membership Tier</th>
                    <th className="py-3 px-4">Total Orders</th>
                    <th className="py-3 px-4">Lifetime Value (LTV)</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers
                    .filter(c => c.name.toLowerCase().includes(searchCustomer.toLowerCase()) || c.city.toLowerCase().includes(searchCustomer.toLowerCase()))
                    .map((cust) => (
                      <tr key={cust.id} className="hover:bg-[#0B1022]/80/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#F8FAFC] block">{cust.name}</span>
                          <span className="font-mono text-[10px] text-gray-400">{cust.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[#F8FAFC] block">{cust.email}</span>
                          <span className="text-[#A6B1C8] text-[10px]">{cust.phone}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#A6B1C8]">{cust.city}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.tier.includes('Platinum')
                              ? 'bg-purple-100 text-purple-800'
                              : cust.tier.includes('Gold')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-white/5 text-[#A6B1C8]'
                          }`}>
                            {cust.tier}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#F8FAFC]">{cust.totalOrders} Orders</td>
                        <td className="py-3 px-4 font-black text-emerald-600 text-sm">{cust.ltv}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => alert(`VIP Profile for ${cust.name}: Total Spend ${cust.ltv}, 0 return disputes.`)}
                            className="px-2.5 py-1 bg-white/5 hover:bg-gray-200 text-[#F8FAFC] font-bold rounded text-xs"
                          >
                            View 360° Profile
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
    </div>
  );
};

export default CustomerSupportModule;
