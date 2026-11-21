import React, { useState } from 'react';
import {
  Headphones,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Star,
  Plus,
  Eye,
  MoreVertical,
  ChevronRight,
  Download,
  Calendar,
  Sparkles,
  LifeBuoy,
  MessageSquare,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const DashboardModule = ({
  stats,
  statusBreakdown = [],
  trendData = [],
  tickets = [],
  agents = [],
  onNavigateTab,
  onOpenCreateTicket,
  onSelectTicket,
}) => {
  const [weekFilter, setWeekFilter] = useState('Current Week');

  // KPI Metrics (6 Cards matching reference screenshot)
  const kpis = [
    {
      id: 'total',
      title: 'Total Tickets',
      value: stats?.totalTickets?.toLocaleString() || '1,248',
      trend: stats?.totalTicketsTrend || '↑ +12% vs last week',
      icon: LifeBuoy,
      color: 'text-[#00F2FE]',
      bg: 'bg-[#00F2FE]/10',
      border: 'border-[#00F2FE]/30',
      tab: 'tickets',
    },
    {
      id: 'resolved',
      title: 'Resolved Tickets',
      value: stats?.resolved?.toLocaleString() || '1,096',
      trend: stats?.resolvedTrend || '↑ +15% resolution rate',
      icon: CheckCircle2,
      color: 'text-[#10B981]',
      bg: 'bg-[#10B981]/10',
      border: 'border-[#10B981]/30',
      tab: 'tickets',
    },
    {
      id: 'pending',
      title: 'Pending Action',
      value: stats?.pending?.toLocaleString() || '108',
      trend: stats?.pendingTrend || '↓ -8% within standard SLA',
      icon: Clock,
      color: 'text-[#E7B43F]',
      bg: 'bg-[#E7B43F]/10',
      border: 'border-[#E7B43F]/30',
      tab: 'tickets',
    },
    {
      id: 'escalated',
      title: 'Escalations',
      value: stats?.escalated?.toLocaleString() || '24',
      trend: stats?.escalatedTrend || '↑ +20% attention required',
      icon: AlertTriangle,
      color: 'text-[#EF4444]',
      bg: 'bg-[#EF4444]/10',
      border: 'border-[#EF4444]/30',
      tab: 'escalations',
    },
    {
      id: 'response',
      title: 'Avg Response Time',
      value: stats?.avgResponseTime || '4m 32s',
      trend: stats?.avgResponseTimeTrend || '↓ -24% (target: ≤ 15 mins)',
      icon: Zap,
      color: 'text-[#A855F7]',
      bg: 'bg-[#A855F7]/10',
      border: 'border-[#A855F7]/30',
      tab: 'reports',
    },
    {
      id: 'csat',
      title: 'Customer Satisfaction',
      value: stats?.csat || '4.8 / 5',
      trend: stats?.csatTrend || '↑ +0.2 (96.2% 5-star ratings)',
      icon: Star,
      color: 'text-[#00F2FE]',
      bg: 'bg-[#00F2FE]/10',
      border: 'border-[#00F2FE]/30',
      tab: 'reports',
    },
  ];

  // Default Chart Data matching screenshot
  const defaultChartData = [
    { day: 'Mon', inbound: 48, resolved: 42, escalated: 2 },
    { day: 'Tue', inbound: 92, resolved: 85, escalated: 3 },
    { day: 'Wed', inbound: 140, resolved: 128, escalated: 4 },
    { day: 'Thu', inbound: 168, resolved: 154, escalated: 6 },
    { day: 'Fri', inbound: 145, resolved: 139, escalated: 5 },
    { day: 'Sat', inbound: 180, resolved: 165, escalated: 3 },
    { day: 'Sun', inbound: 228, resolved: 210, escalated: 5 },
  ];
  const chartData = trendData.length > 0 ? trendData : defaultChartData;

  // Donut status breakdown matching screenshot
  const defaultStatusBreakdown = [
    { name: 'Resolved', count: 1096, percentage: 87.8, color: '#10B981' },
    { name: 'In Progress', count: 44, percentage: 3.5, color: '#00F2FE' },
    { name: 'Pending', count: 64, percentage: 5.1, color: '#E7B43F' },
    { name: 'Escalated', count: 24, percentage: 1.9, color: '#EF4444' },
    { name: 'Open', count: 20, percentage: 1.7, color: '#6366F1' },
  ];
  const statusData = statusBreakdown.length > 0 ? statusBreakdown : defaultStatusBreakdown;

  // Recent inquiries matching reference screenshot
  const defaultInquiries = [
    {
      id: 'TIC-2293',
      ticketId: 'TIC-2293',
      customer: 'Ananya Singh',
      initials: 'A',
      subject: 'Live Chat Inquiry: Watch strap availability',
      productName: 'Rolex Submariner Date',
      priority: 'High',
      status: 'Open',
      assignedTo: 'Rohan Singh',
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'TIC-7725',
      ticketId: 'TIC-7725',
      customer: 'Ananya Singh',
      initials: 'A',
      subject: 'Watch service & maintenance query',
      productName: 'Rolex Submariner Date',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Neha Sharma',
      assignedAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'TKT-801',
      ticketId: 'TKT-801',
      customer: 'Rahul Verma',
      initials: 'R',
      subject: 'Order transit delay enquiry',
      productName: 'Shipping',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Amit Kumar',
      assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'TKT-802',
      ticketId: 'TKT-802',
      customer: 'Rahul Verma',
      initials: 'R',
      subject: 'Return request: Received incorrect size',
      productName: 'Returns',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'Pooja Gupta',
      assignedAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'TKT-803',
      ticketId: 'TKT-803',
      customer: 'Priya Desai',
      initials: 'P',
      subject: 'Refund timeline enquiry for cancelled order',
      productName: 'Refunds',
      priority: 'High',
      status: 'Pending',
      assignedTo: 'Rohan Singh',
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
  ];
  const displayTickets = tickets.length > 0 ? tickets.slice(0, 5) : defaultInquiries;

  // Active agents list matching screenshot
  const defaultAgents = [
    {
      id: 'agt-1',
      name: 'Rohan Singh',
      role: 'Senior Support Agent',
      resolved: 142,
      score: '★ 98%',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'agt-2',
      name: 'Neha Sharma',
      role: 'Support Agent',
      resolved: 126,
      score: '★ 97%',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'agt-3',
      name: 'Amit Kumar',
      role: 'Chat Agent',
      resolved: 118,
      score: '★ 96%',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 'agt-4',
      name: 'Pooja Gupta',
      role: 'Support Manager',
      resolved: 185,
      score: '★ 99%',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    },
  ];
  const displayAgents = agents.length > 0 ? agents.slice(0, 4) : defaultAgents;

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'border-rose-500/40 bg-rose-500/10 text-rose-400';
      case 'medium':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
      default:
        return 'border-blue-500/40 bg-blue-500/10 text-blue-400';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
      case 'in progress':
        return 'border-[#00F2FE]/40 bg-[#00F2FE]/10 text-[#00F2FE]';
      case 'pending':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-400';
      default:
        return 'border-blue-500/40 bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      {/* 1. Header Banner: Welcome, Title, Live Status, Action Buttons */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-gray-400 font-medium">Welcome back, Pooja Sharma 👋</div>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="w-9 h-9 rounded-xl bg-[#00F2FE]/15 border border-[#00F2FE]/40 flex items-center justify-center text-[#00F2FE] shadow-lg shadow-[#00F2FE]/10">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
                Support Executive Dashboard
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-gray-400 text-xs">
                  Real-time support operations, ticket resolution, escalations, and customer experience insights.
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operations Room
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/10">
                  &bull; 24/7 Concierge Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onOpenCreateTicket && onOpenCreateTicket()}
            className="px-4 py-2 rounded-xl bg-[#00F2FE] hover:bg-[#00D9E8] text-black font-extrabold shadow-lg shadow-[#00F2FE]/20 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Ticket</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('escalations')}
            className="px-3.5 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>View Escalations (24)</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 2. 6 KPI Cards Grid (Matching reference screenshot styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onNavigateTab && onNavigateTab(kpi.tab)}
              className={`rounded-2xl bg-[#0B1222] border ${kpi.border} p-4 shadow-lg hover:border-[#00F2FE]/60 transition-all cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-[11px] font-medium text-gray-400 block">{kpi.title}</span>
                <div className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">{kpi.value}</div>
                <div className="text-[10px] text-gray-400 mt-1 font-semibold truncate">{kpi.trend}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Middle Charts Row: Weekly Ticket Inflow (2/3) + Donut Distribution (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Ticket Inflow & Resolution (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0B1222] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-[#00F2FE]">&bull;</span>
                Weekly Ticket Inflow & Resolution
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Comparison of inbound tickets vs resolved cases over the past 7 days
              </p>
            </div>
            <select
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="bg-[#111A2C] border border-white/10 rounded-xl px-3 py-1 text-white text-xs outline-none cursor-pointer"
            >
              <option value="Current Week">Current Week</option>
              <option value="Previous Week">Previous Week</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>

          {/* Area Chart Container */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00F2FE" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252D42" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#070B18] border border-[#00F2FE]/40 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                          <span className="font-bold text-white block">{label}, 19 Nov</span>
                          <div className="text-[#00F2FE] flex items-center gap-1.5">
                            <span>&bull; Inflow Tickets:</span>
                            <span className="font-bold">{payload[0]?.value}</span>
                          </div>
                          <div className="text-emerald-400 flex items-center gap-1.5">
                            <span>&bull; Resolved:</span>
                            <span className="font-bold">{payload[1]?.value}</span>
                          </div>
                          <div className="text-rose-400 flex items-center gap-1.5">
                            <span>&bull; Escalated:</span>
                            <span className="font-bold">6</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  stroke="#00F2FE"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorInbound)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-white/5 text-[11px]">
            <span className="flex items-center gap-1.5 text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
              Inflow Tickets
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Resolved Tickets
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              Escalated Cases
            </span>
          </div>
        </div>

        {/* Ticket Status Distribution (1 Col Donut) */}
        <div className="rounded-2xl bg-[#0B1222] border border-white/10 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Ticket Status Distribution</h3>
            <span className="text-[11px] font-bold text-gray-400">1,248 Total</span>
          </div>

          <div className="relative h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold font-serif text-white">87.8%</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Resolved</span>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px]">{item.name}</span>
                </div>
                <span className="text-[11px] font-bold text-white">
                  {item.count.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Support Inquiries (2/3) + Active Agents & FCR (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Support Inquiries Table */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0B1222] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00F2FE]" />
                Recent Support Inquiries
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Latest customer tickets across phone, email, live chat and portal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('tickets')}
              className="text-xs font-bold text-[#00F2FE] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Tickets</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">TICKET ID</th>
                  <th className="pb-3 px-2">CUSTOMER</th>
                  <th className="pb-3 px-2">SUBJECT / INQUIRY</th>
                  <th className="pb-3 px-2">PRIORITY</th>
                  <th className="pb-3 px-2">STATUS</th>
                  <th className="pb-3 px-2">ASSIGNED TO</th>
                  <th className="pb-3 px-2 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTicket && onSelectTicket(t)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    {/* Ticket ID */}
                    <td className="py-3 px-2 font-mono font-bold text-[#00F2FE] text-xs">
                      {t.ticketId || t.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-blue-500/30 flex items-center justify-center text-white font-bold text-[10px]">
                          {t.customer ? t.customer[0] : 'C'}
                        </div>
                        <span className="font-semibold text-white text-xs">{t.customer}</span>
                      </div>
                    </td>

                    {/* Subject / Inquiry — Gracefully handles all fields, never displays undefined */}
                    <td className="py-3 px-2">
                      <div className="max-w-[220px]">
                        <span className="font-bold text-white text-xs block truncate">
                          {t.subject || 'Customer horology service query'}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate">
                          {t.productName || 'Rolex Submariner Date'}
                        </span>
                      </div>
                    </td>

                    {/* Priority Badge */}
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadgeClass(
                          t.priority
                        )}`}
                      >
                        {t.priority || 'High'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                          t.status
                        )}`}
                      >
                        {t.status || 'Open'}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={t.assignedAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                          alt={t.assignedTo}
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-gray-300 text-xs">{t.assignedTo || 'Rohan Singh'}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-2 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                          title="View Ticket"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Stack: Active Support Agents + First Contact Resolution */}
        <div className="space-y-4">
          {/* Active Support Agents Card */}
          <div className="rounded-2xl bg-[#0B1222] border border-white/10 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-[#E7B43F]">&bull;</span>
                  Active Support Agents
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Top resolution performers this month.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('team')}
                className="text-xs font-bold text-[#00F2FE] hover:underline cursor-pointer"
              >
                Manage Team &gt;
              </button>
            </div>

            <div className="space-y-2.5">
              {displayAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-2.5 rounded-xl bg-[#111A2C] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">{agent.name}</span>
                      <span className="text-[10px] text-gray-400 block">{agent.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">{agent.resolved} Solved</span>
                    <span className="text-[10px] font-bold text-[#E7B43F] block">{agent.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* First Contact Resolution Card */}
          <div className="rounded-2xl bg-[#0B1222] border border-white/10 p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">First Contact Resolution</h4>
                <p className="text-[11px] text-gray-400">Target: 85% &bull; Current: 88.5%</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              &uarr; +3.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
