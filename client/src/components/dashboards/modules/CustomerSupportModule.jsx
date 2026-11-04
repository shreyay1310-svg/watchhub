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

// Mock Initial Tickets
const INITIAL_TICKETS = [
  {
    id: '#TKT8754',
    customer: 'Ananya Singh',
    email: 'ananya.s@gmail.com',
    phone: '+91 98765 43210',
    subject: 'Order transit delay at Lucknow facility',
    orderId: '#WH12548',
    watch: 'Rolex Submariner Date 41mm',
    priority: 'High',
    status: 'Open',
    time: '15 mins ago',
    category: 'Delivery Delay',
    messages: [
      { sender: 'Ananya Singh', text: 'Hi, tracking shows package arrived at Lucknow hub yesterday morning, but no delivery update today. Can you please check?', time: '10:24 AM' }
    ]
  },
  {
    id: '#TKT8753',
    customer: 'Rahul Verma',
    email: 'rahul.v@gmail.com',
    phone: '+91 98765 22110',
    subject: 'Bracelet link adjustment inquiry for Moonwatch',
    orderId: '#WH12547',
    watch: 'Omega Speedmaster Professional',
    priority: 'Medium',
    status: 'In Progress',
    time: '1 hour ago',
    category: 'Product Sizing',
    messages: [
      { sender: 'Rahul Verma', text: 'Does this watch include the extra half-links in the box or should I take it to an authorized boutique?', time: '09:30 AM' },
      { sender: 'Support Executive', text: 'Hello Rahul! Yes, two extra links and the micro-adjustment spring bar tool are included in the velvet storage tray under the watch cushion.', time: '09:45 AM' }
    ]
  },
  {
    id: '#TKT8752',
    customer: 'Priya Yadav',
    email: 'priya.y@gmail.com',
    phone: '+91 98765 88990',
    subject: 'Refund confirmation & Bank ARN number required',
    orderId: '#WH12546',
    watch: 'Cartier Santos de Cartier Large',
    priority: 'High',
    status: 'Escalated',
    time: '2 hours ago',
    category: 'Payment & Refund',
    messages: [
      { sender: 'Priya Yadav', text: 'My return passed QC yesterday. When will the ₹7,15,000 refund reflect in my HDFC account? Please provide the ARN reference.', time: '08:15 AM' }
    ]
  },
  {
    id: '#TKT8751',
    customer: 'Rohit Kumar',
    email: 'rohit.k@gmail.com',
    phone: '+91 98765 33445',
    subject: 'Request for Extended 2-Year International Warranty PDF',
    orderId: '#WH12545',
    watch: 'Titan Edge Ceramic Slim',
    priority: 'Low',
    status: 'Resolved',
    time: 'Yesterday',
    category: 'Warranty & Papers',
    messages: [
      { sender: 'Rohit Kumar', text: 'Need a digital copy of the warranty certificate for insurance appraisal.', time: 'Yesterday' },
      { sender: 'Support Executive', text: 'Sent to your registered email along with the digital invoice and AD stamp.', time: 'Yesterday' }
    ]
  }
];

// Mock Live Queries
const INITIAL_QUERIES = [
  {
    id: '#QRY-301',
    customer: 'Kavita Joshi',
    city: 'Mumbai',
    query: 'Is the Patek Philippe Nautilus in stock for same-day boutique trial in Bandra?',
    time: '3 mins ago',
    status: 'Waiting for Agent',
    interestedWatch: 'Patek Philippe Nautilus 5711/1R',
    price: '₹34,50,000'
  },
  {
    id: '#QRY-302',
    customer: 'Tanmay Mehta',
    city: 'Ahmedabad',
    query: 'Do you offer 0% No-Cost EMI on ICICI credit cards for watches above ₹1,00,000?',
    time: '12 mins ago',
    status: 'Chatting',
    interestedWatch: 'TAG Heuer Monaco Chronograph',
    price: '₹7,45,000'
  },
  {
    id: '#QRY-303',
    customer: 'Farhan Akhtar',
    city: 'Hyderabad',
    query: 'Are all luxury timepieces certified 100% authentic with factory warranty cards?',
    time: '28 mins ago',
    status: 'Replied',
    interestedWatch: 'Audemars Piguet Royal Oak Jumbo',
    price: '₹38,00,000'
  }
];

// Mock Orders Lookup Data
const MOCK_ORDER_LOOKUP = {
  id: '#WH12548',
  date: '02 Nov 2026, 03:45 PM',
  customer: {
    name: 'Ananya Singh',
    email: 'ananya.s@gmail.com',
    phone: '+91 98765 43210',
    tier: 'Gold VIP Member'
  },
  address: 'Flat 402, Royal Palms Residency, Gomti Nagar, Lucknow, UP - 226010',
  items: [
    {
      name: 'Rolex Submariner Date 41mm',
      sku: 'W-ROLEX-SUB-41',
      serial: 'WH-RLX-994821',
      price: '₹11,40,000',
      qty: 1
    }
  ],
  payment: {
    method: 'Razorpay UPI (Net Banking)',
    status: 'Paid / Captured',
    txnId: 'pay_Nz99482199042',
    amount: '₹11,40,000'
  },
  shipping: {
    carrier: 'BlueDart Air Express',
    awb: 'BLU-88912401',
    status: 'Out for Delivery (Lucknow Hub)',
    eta: 'Today by 05:00 PM'
  }
};

// Mock Refunds Data
const INITIAL_REFUNDS = [
  {
    id: '#RFD-8801',
    orderId: '#WH12546',
    customer: 'Priya Yadav',
    amount: '₹7,15,000',
    method: 'Razorpay Instant UPI',
    arn: 'HDFC-ARN-889210042',
    date: '04 Nov 2026',
    status: 'Refund Authorized',
    reason: 'Customer return - Wrist size exchange requested'
  },
  {
    id: '#RFD-8802',
    orderId: '#WH12541',
    customer: 'Meera Rajput',
    amount: '₹29,995',
    method: 'Original Card (ICICI)',
    arn: 'ICICI-ARN-773199014',
    date: '03 Nov 2026',
    status: 'Settled to Bank',
    reason: 'Watch size exchange'
  },
  {
    id: '#RFD-8803',
    orderId: '#WH12538',
    customer: 'Vikas Sharma',
    amount: '₹89,900',
    method: 'WatchHub Store Credit (+5% bonus)',
    arn: 'W-CREDIT-9921',
    date: '02 Nov 2026',
    status: 'Voucher Credited',
    reason: 'Upgraded to Rolex Explorer'
  }
];

// Mock Complaints
const INITIAL_COMPLAINTS = [
  {
    id: '#CMP-104',
    severity: 'P0 Critical',
    customer: 'Vikramaditya Rao',
    phone: '+91 99887 76655',
    orderId: '#WH12530',
    issue: 'Outer tamper seal on shipping box appeared damaged upon courier delivery',
    status: 'Under Investigation',
    slaTime: '30 mins left',
    actionTaken: 'Package opened under unboxing video; contents verified intact.'
  },
  {
    id: '#CMP-103',
    severity: 'P1 High',
    customer: 'Devika Sen',
    phone: '+91 98765 11223',
    orderId: '#WH12528',
    issue: 'Courier delayed 3 days past guaranteed anniversary surprise delivery date',
    status: 'Escalated to Logistics Lead',
    slaTime: '1h 15m left',
    actionTaken: 'Courier penalty levied. ₹1,000 apology shopping credit offered.'
  },
  {
    id: '#CMP-102',
    severity: 'P2 Medium',
    customer: 'Kunal Kapoor',
    phone: '+91 98765 44332',
    orderId: '#WH12525',
    issue: 'Missing physical brochure booklet inside the presentation box',
    status: 'Resolved',
    slaTime: 'Resolved',
    actionTaken: 'Official hardcover catalog dispatched via express courier.'
  }
];

// Mock Reviews Data
const INITIAL_REVIEWS = [
  {
    id: '#REV-701',
    customer: 'Sameer Singhania',
    watch: 'Rolex Submariner Date 41mm',
    rating: 5,
    title: 'Absolute perfection. The crown and ceramic bezel feel incredible.',
    comment: 'Delivered in a heavy piano-finish wooden box with the official warranty card. WatchHub packaging is second to none.',
    date: '03 Nov 2026',
    verified: true,
    status: 'Approved & Published'
  },
  {
    id: '#REV-702',
    customer: 'Aarti Menon',
    watch: 'Cartier Santos de Cartier Large',
    rating: 5,
    title: 'Timeless luxury with the QuickSwitch strap system.',
    comment: 'The blue hands against the opaline silver dial are breathtaking in natural sunlight. Prompt delivery.',
    date: '02 Nov 2026',
    verified: true,
    status: 'Approved & Published'
  },
  {
    id: '#REV-703',
    customer: 'Harsh Vardhan',
    watch: 'Titan Edge Ceramic Slim',
    rating: 4,
    title: 'Incredibly sleek watch, very comfortable on wrist.',
    comment: 'Thinnest watch I have owned. Delivery took 3 days instead of 2, but watch condition is flawless.',
    date: '01 Nov 2026',
    verified: true,
    status: 'Pending Moderation'
  }
];

// Mock Customer Management Data
const INITIAL_CUSTOMERS = [
  {
    id: '#CUST-1001',
    name: 'Ananya Singh',
    email: 'ananya.s@gmail.com',
    phone: '+91 98765 43210',
    city: 'Lucknow, UP',
    tier: 'Gold VIP',
    totalOrders: 4,
    ltv: '₹14,85,000',
    joined: 'Jan 2025',
    status: 'Active'
  },
  {
    id: '#CUST-1002',
    name: 'Rahul Verma',
    email: 'rahul.v@gmail.com',
    phone: '+91 98765 22110',
    city: 'Kanpur, UP',
    tier: 'Platinum Elite',
    totalOrders: 6,
    ltv: '₹22,40,000',
    joined: 'Aug 2024',
    status: 'Active'
  },
  {
    id: '#CUST-1003',
    name: 'Priya Yadav',
    email: 'priya.y@gmail.com',
    phone: '+91 98765 88990',
    city: 'Varanasi, UP',
    tier: 'Silver',
    totalOrders: 2,
    ltv: '₹7,45,000',
    joined: 'Mar 2026',
    status: 'Active'
  },
  {
    id: '#CUST-1004',
    name: 'Rohit Kumar',
    email: 'rohit.k@gmail.com',
    phone: '+91 98765 33445',
    city: 'Lucknow, UP',
    tier: 'Regular',
    totalOrders: 3,
    ltv: '₹95,000',
    joined: 'May 2026',
    status: 'Active'
  }
];

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
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => switchTab('support_tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'support_tickets'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
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
                : 'text-gray-600 hover:bg-gray-100'
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
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>🔍</span> Orders Lookup
          </button>

          <button
            onClick={() => switchTab('returns_refunds')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'returns_refunds'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
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
                : 'text-gray-600 hover:bg-gray-100'
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
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>⭐</span> Reviews & Ratings
          </button>

          <button
            onClick={() => switchTab('customer_management')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'customer_management'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>👥</span> Customer Management
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 font-semibold pr-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Helpdesk SLA: 99.1% First Contact Res.</span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: SUPPORT TICKETS (🎫 Support Tickets)
          ========================================================================= */}
      {currentTab === 'support_tickets' && (
        <div className="space-y-5">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Open Tickets</span>
              <p className="text-2xl font-black text-amber-600 mt-1">
                {tickets.filter(t => t.status === 'Open').length}
              </p>
              <span className="text-[10px] text-amber-600 font-bold">● Immediate agent pickup</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">In Progress</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {tickets.filter(t => t.status === 'In Progress').length}
              </p>
              <span className="text-[10px] text-blue-500 font-bold">● Awaiting warehouse/courier</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Escalated</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {tickets.filter(t => t.status === 'Escalated').length}
              </p>
              <span className="text-[10px] text-rose-500 font-bold">● Direct manager attention</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Avg Resolution SLA</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">18 min</p>
              <span className="text-[10px] text-emerald-500 font-bold">● Fast response guarantee</span>
            </div>
          </div>

          {/* Ticket Desk Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Queue */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col h-[560px]">
              <div className="space-y-3 pb-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                    placeholder="Search ticket #, order, customer..."
                    className="w-full h-8 pl-9 pr-3 rounded-lg border border-gray-300 text-xs outline-none focus:border-watch-gold"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-700">{filteredTickets.length} Tickets Found</span>
                  <select
                    value={filterTicketStatus}
                    onChange={(e) => setFilterTicketStatus(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-0.5 text-[11px] outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
                {filteredTickets.map((t) => {
                  const isSelected = activeTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setActiveTicket(t)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-watch-gold bg-amber-50/50 shadow-sm'
                          : 'border-gray-100 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] font-bold text-gray-400">{t.id}</span>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                          t.status === 'Escalated' ? 'bg-rose-100 text-rose-800' :
                          t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-gray-900 text-xs mt-1 truncate">{t.subject}</h5>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">{t.customer} • {t.orderId}</p>
                      <div className="flex justify-between items-center mt-2 text-[10px] text-gray-400">
                        <span className="font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          {t.category}
                        </span>
                        <span>{t.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Active Ticket Detail Thread */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col h-[560px]">
              {activeTicket ? (
                <>
                  {/* Top Bar */}
                  <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900">{activeTicket.subject}</h4>
                        <span className="font-mono text-xs font-bold text-watch-gold">{activeTicket.id}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activeTicket.customer} ({activeTicket.email}) • Order: <span className="font-mono font-bold text-gray-800">{activeTicket.orderId}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={activeTicket.status}
                        onChange={(e) => {
                          const updated = { ...activeTicket, status: e.target.value };
                          setActiveTicket(updated);
                          setTickets(tickets.map(t => t.id === updated.id ? updated : t));
                        }}
                        className="text-xs font-bold border border-gray-300 rounded-lg px-2.5 py-1 outline-none"
                      >
                        <option value="Open">Status: Open</option>
                        <option value="In Progress">Status: In Progress</option>
                        <option value="Escalated">Status: Escalated</option>
                        <option value="Resolved">Status: Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                    {activeTicket.messages.map((m, idx) => {
                      const isCustomer = !m.sender.includes('Support');
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                              isCustomer
                                ? 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                : 'bg-watch-navy-dark text-white rounded-tr-sm'
                            }`}
                          >
                            <p className="text-[10px] font-bold opacity-75">{m.sender}</p>
                            <p className="leading-relaxed">{m.text}</p>
                            <p className="text-[9px] text-right opacity-60 font-mono mt-1">{m.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Preset Responses */}
                  <div className="py-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-[11px]">
                    <span className="text-[10px] font-bold text-gray-400">Quick Reply:</span>
                    <button
                      type="button"
                      onClick={() => setReplyText('Hello! Your courier shipment has been marked for priority delivery this afternoon with BlueDart. AWB is active.')}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap text-gray-700"
                    >
                      🚀 Priority Dispatch Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyText('Thank you for reaching out! We have authorized your refund and the bank ARN reference has been sent to your email.')}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap text-gray-700"
                    >
                      💳 Refund Authorized
                    </button>
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendTicketReply} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type response to customer..."
                      className="flex-1 h-10 px-3.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-watch-gold"
                    />
                    <button
                      type="submit"
                      className="btn-gold px-4 h-10 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Reply
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">
                  Select a ticket from the left list to begin replying.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CUSTOMER QUERIES (💬 Customer Queries)
          ========================================================================= */}
      {currentTab === 'customer_queries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Inquiries List */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-gray-900 flex items-center justify-between">
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
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 text-xs">{q.customer} ({q.city})</span>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'Replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 font-medium">{q.query}</p>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-[10.5px]">
                    <span className="text-watch-gold font-bold">{q.interestedWatch}</span>
                    <span className="text-gray-400 font-mono">{q.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Live Query Chat & Product Recommendation */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  Pre-Purchase Consultation: {activeQuery.customer}
                </h4>
                <p className="text-xs text-gray-500">
                  Browsing product: <span className="font-bold text-watch-navy-dark">{activeQuery.interestedWatch}</span> ({activeQuery.price})
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                High Purchase Intent
              </span>
            </div>

            {/* Chat Bubble Box */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 min-h-[220px]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-watch-navy-dark text-watch-gold flex items-center justify-center font-bold text-xs">
                  {activeQuery.customer.charAt(0)}
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-200 text-xs max-w-md shadow-sm">
                  <p className="font-bold text-gray-900 text-[11px] mb-1">{activeQuery.customer}:</p>
                  <p className="text-gray-700">{activeQuery.query}</p>
                </div>
              </div>
            </div>

            {/* One-Click WatchHub Recommender Cards */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-gray-500">Attach Product Card & EMI Breakdown:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setQueryReply(`Yes, we provide 0% No-Cost EMI on HDFC & ICICI cards starting at ₹31,041/mo for the ${activeQuery.interestedWatch}. Would you like an instant approval checkout link?`)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left"
                >
                  <span className="font-bold text-gray-900 block">💳 0% EMI Offer Preset</span>
                  <span className="text-[10.5px] text-gray-500">Insert monthly split breakdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQueryReply(`100% Genuine & Brand New with official manufacturer warranty card, green hologram seal, and authorized dealer certificate stamped in Switzerland.`)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-left"
                >
                  <span className="font-bold text-gray-900 block">🛡️ Authenticity Guarantee</span>
                  <span className="text-[10.5px] text-gray-500">Insert factory certificate proof</span>
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
                className="flex-1 h-10 px-3.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-watch-gold"
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
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-watch-gold" /> Deep Customer Order Lookup Engine
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Search by Order ID (#WH12548), Customer Phone, Email or Courier AWB.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-96">
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="e.g. #WH12548 or +91 98765 43210"
                className="flex-1 h-9 px-3 rounded-lg border border-gray-300 text-xs font-mono outline-none focus:border-watch-gold"
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
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-gray-900 font-mono">{orderProfile.id}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                      {orderProfile.payment.status}
                    </span>
                    <span className="px-2.5 py-0.5 bg-watch-gold/20 text-watch-navy-dark text-xs font-bold rounded-full">
                      {orderProfile.customer.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Placed on {orderProfile.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('📄 Tax Invoice PDF generated and emailed to ' + orderProfile.customer.email)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg flex items-center gap-1.5"
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
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-watch-gold" /> Customer & Shipping
                  </h5>
                  <p className="font-bold text-gray-800">{orderProfile.customer.name}</p>
                  <p className="text-gray-500">{orderProfile.customer.email}</p>
                  <p className="text-gray-500">{orderProfile.customer.phone}</p>
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Delivery Address:</span>
                    <p className="text-gray-700 mt-0.5 leading-relaxed">{orderProfile.address}</p>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-watch-gold" /> Watch Item & Serial
                  </h5>
                  {orderProfile.items.map((it, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="font-bold text-watch-navy-dark text-sm">{it.name}</p>
                      <p className="font-mono text-gray-500">SKU: {it.sku}</p>
                      <p className="font-mono text-gray-700">Serial No: {it.serial}</p>
                      <p className="text-base font-extrabold text-emerald-600 pt-1">{it.price}</p>
                    </div>
                  ))}
                </div>

                {/* Col 3 */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-watch-gold" /> Payment & Logistics
                  </h5>
                  <p className="text-gray-700">
                    Method: <span className="font-bold">{orderProfile.payment.method}</span>
                  </p>
                  <p className="font-mono text-[11px] text-gray-500">Txn: {orderProfile.payment.txnId}</p>
                  <div className="pt-2 border-t border-gray-200 space-y-1">
                    <p className="text-gray-700">
                      Carrier: <span className="font-bold text-gray-900">{orderProfile.shipping.carrier}</span>
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
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Pending Authorizations</span>
              <p className="text-2xl font-black text-rose-600 mt-1">{refunds.length}</p>
              <span className="text-[10px] text-rose-500 font-bold">● Requires finance sign-off</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Processed This Month</span>
              <p className="text-2xl font-black text-gray-900 mt-1">₹8,34,995</p>
              <span className="text-[10px] text-emerald-500 font-bold">● 100% SLA compliant</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Avg Settlement Speed</span>
              <p className="text-2xl font-black text-blue-600 mt-1">24 min</p>
              <span className="text-[10px] text-blue-500 font-bold">● Instant UPI webhook</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[11px] font-semibold text-gray-500">Gateway Failures</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">0</p>
              <span className="text-[10px] text-emerald-500 font-bold">● Razorpay healthy</span>
            </div>
          </div>

          {/* Refunds Management Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-gray-900">Refund Authorization & Bank ARN Tracker</h4>
                <p className="text-[11px] text-gray-500">Trigger immediate UPI returns or bank credit for verified returns.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
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
                    <tr key={rfd.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-gray-900 block">{rfd.id}</span>
                        <span className="text-[10px] text-gray-400">Order: {rfd.orderId}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{rfd.customer}</td>
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">{rfd.amount}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800 block">{rfd.method}</span>
                        <span className="font-mono text-[10px] text-gray-500">ARN: {rfd.arn}</span>
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
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> High-Severity Customer Complaints & Escalations
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Priority P0/P1 cases requiring supervisor intervention, apologies or compensation vouchers.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {complaints.map((cmp) => (
              <div
                key={cmp.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
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
                    <span className="font-mono font-bold text-gray-900 text-sm">{cmp.id}</span>
                    <span className="text-xs text-gray-500">Order: {cmp.orderId}</span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    cmp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {cmp.status} ({cmp.slaTime})
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-gray-900 text-sm">{cmp.issue}</p>
                  <p className="text-gray-500">Customer: <span className="font-bold text-gray-800">{cmp.customer}</span> • Phone: {cmp.phone}</p>
                  <p className="text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                    <span className="font-bold text-gray-900">Action Log:</span> {cmp.actionTaken}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => alert(`🎁 ₹1,000 compensation coupon (COMP1000) generated and emailed to ${cmp.customer}!`)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
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
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-watch-gold fill-watch-gold" /> Customer Review Moderation Queue
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Review, approve, or reply to authentic buyer feedback and unboxing photos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rev.status.includes('Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rev.status}
                    </span>
                  </div>

                  <h5 className="font-bold text-gray-900 text-xs mt-2">{rev.title}</h5>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">"{rev.comment}"</p>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-gray-900">{rev.customer}</span>
                    <span className="text-gray-400 font-mono text-[10px]">{rev.date}</span>
                  </div>
                  <span className="text-[10.5px] font-bold text-watch-gold block truncate">{rev.watch}</span>

                  <div className="flex justify-end gap-2 pt-1">
                    {rev.status.includes('Pending') ? (
                      <button
                        onClick={() => handleApproveReview(rev.id)}
                        className="px-3 py-1 bg-watch-gold text-watch-navy-dark font-extrabold rounded-lg text-xs"
                      >
                        Approve & Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Replied as WatchHub Official to review ${rev.id}`)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                      >
                        Reply as WatchHub
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 7: CUSTOMER MANAGEMENT (👥 Customer Management)
          ========================================================================= */}
      {currentTab === 'customer_management' && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-watch-gold" /> Customer 360° Directory & Lifetime Value
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
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
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-xs outline-none focus:border-watch-gold"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
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
                      <tr key={cust.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900 block">{cust.name}</span>
                          <span className="font-mono text-[10px] text-gray-400">{cust.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-800 block">{cust.email}</span>
                          <span className="text-gray-500 text-[10px]">{cust.phone}</span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700">{cust.city}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.tier.includes('Platinum')
                              ? 'bg-purple-100 text-purple-800'
                              : cust.tier.includes('Gold')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {cust.tier}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-800">{cust.totalOrders} Orders</td>
                        <td className="py-3 px-4 font-black text-emerald-600 text-sm">{cust.ltv}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => alert(`VIP Profile for ${cust.name}: Total Spend ${cust.ltv}, 0 return disputes.`)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded text-xs"
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
