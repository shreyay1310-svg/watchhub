import React from 'react';
import {
  LifeBuoy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  UserCheck,
  ChevronRight,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Download,
  Filter,
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
  const kpis = [
    {
      id: 'total',
      title: 'Total Tickets',
      value: stats?.totalTickets?.toLocaleString() || '1,248',
      change: stats?.totalTicketsTrend || '+12%',
      isPositive: true,
      sub: 'vs last week',
      icon: LifeBuoy,
      color: 'text-[#00D9E8]',
      bg: 'bg-[#00D9E8]/10',
      border: 'border-[#00D9E8]/30',
      tab: 'tickets',
    },
    {
      id: 'resolved',
      title: 'Resolved Tickets',
      value: stats?.resolved?.toLocaleString() || '1,096',
      change: stats?.resolvedTrend || '+15%',
      isPositive: true,
      sub: '87.8% resolution rate',
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
      change: stats?.pendingTrend || '-8%',
      isPositive: true, // fewer pending is positive
      sub: 'Within standard SLA',
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
      change: stats?.escalatedTrend || '-20%',
      isPositive: true,
      sub: 'Critical attention required',
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
      change: stats?.avgResponseTimeTrend || '-28%',
      isPositive: true,
      sub: 'Target: < 15 mins',
      icon: Zap,
      color: 'text-[#8B5CF6]',
      bg: 'bg-[#8B5CF6]/10',
      border: 'border-[#8B5CF6]/30',
      tab: 'reports',
    },
    {
      id: 'csat',
      title: 'Customer Satisfaction',
      value: stats?.csat || '4.8 / 5',
      change: stats?.csatTrend || '+0.2',
      isPositive: true,
      sub: '96.2% 5-star ratings',
      icon: Star,
      color: 'text-[#E7B43F]',
      bg: 'bg-[#E7B43F]/10',
      border: 'border-[#E7B43F]/30',
      tab: 'reports',
    },
  ];

  const recentTickets = tickets.slice(0, 5);

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
      case 'urgent':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      case 'high':
        return 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30';
      case 'medium':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'low':
      default:
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
      case 'closed':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'in progress':
      case 'open':
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
      case 'pending':
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
      case 'escalated':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Quick Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#111729] via-[#0D1527] to-[#111729] border border-[#252D42] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9E8] animate-pulse"></span>
              Live Operations Room
            </span>
            <span className="text-xs text-[#A7B1C2]">• 24/7 Concierge Support</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Support Executive Dashboard
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-1 max-w-xl">
            Real-time status overview across client concierge tickets, high-priority escalations, live chats, and luxury timepiece delivery queries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateTicket}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Ticket</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('escalations')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25 border border-[#EF4444]/30 font-semibold text-xs transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>View Escalations ({stats?.escalated || 24})</span>
          </button>
          <button
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#111729] text-[#A7B1C2] hover:text-white border border-[#252D42] hover:border-[#00D9E8] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00D9E8]" />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* 6 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onNavigateTab && onNavigateTab(kpi.tab)}
              className="rounded-2xl bg-[#111729] border border-[#252D42] p-4 hover:border-[#00D9E8]/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#A7B1C2]">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.border} border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                  <span
                    className={`font-semibold flex items-center ${
                      kpi.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {kpi.change}
                  </span>
                  <span className="text-[#64748B] truncate">{kpi.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Ticket Trend Area Chart + Ticket Status Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111729] border border-[#252D42] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00D9E8]" />
                Weekly Ticket Inflow & Resolution
              </h3>
              <p className="text-xs text-[#A7B1C2] mt-0.5">
                Comparison of inbound tickets vs resolved cases over the past 7 days
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] rounded-lg bg-[#070918] border border-[#252D42] text-[#A7B1C2]">
              Current Week
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9E8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00D9E8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252D42" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091426',
                    borderColor: '#252D42',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  name="Inflow Tickets"
                  stroke="#00D9E8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00D9E8]"></span>
              <span className="text-[#A7B1C2]">Inflow Tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
              <span className="text-[#A7B1C2]">Resolved Tickets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
              <span className="text-[#A7B1C2]">Escalated Cases</span>
            </div>
          </div>
        </div>

        {/* Status Breakdown Donut (1 col) */}
        <div className="rounded-2xl bg-[#111729] border border-[#252D42] p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Ticket Status Distribution</h3>
            <span className="text-xs text-[#00D9E8] font-semibold">1,248 Total</span>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091426',
                    borderColor: '#252D42',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-white">87.8%</span>
              <span className="text-[10px] text-[#10B981] font-semibold">Resolved</span>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#A7B1C2]">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-white">{item.count}</span>
                  <span className="text-[#64748B] text-[11px]">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Conversations (Left) & Top Performing Agents (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversations Table (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111729] border border-[#252D42] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#00D9E8]" />
                Recent Support Inquiries
              </h3>
              <p className="text-xs text-[#A7B1C2] mt-0.5">
                Latest customer tickets across phone, email, live chat and portal
              </p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('tickets')}
              className="text-xs font-semibold text-[#00D9E8] hover:underline flex items-center gap-1"
            >
              <span>View All Tickets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Ticket ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Subject / Watch</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252D42]/60">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-[#070918]/50 transition-colors group cursor-pointer"
                    onClick={() => {
                      if (onSelectTicket) onSelectTicket(ticket);
                      else if (onNavigateTab) onNavigateTab('tickets');
                    }}
                  >
                    <td className="py-3 font-mono font-medium text-[#00D9E8]">{ticket.id}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center font-bold text-[10px] border border-[#00D9E8]/30">
                          {ticket.customerName ? ticket.customerName[0] : 'C'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{ticket.customerName}</p>
                          <p className="text-[10px] text-[#64748B]">{ticket.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-white truncate max-w-[200px]">{ticket.subject}</p>
                      <p className="text-[10px] text-[#A7B1C2] truncate max-w-[200px]">{ticket.watchModel || ticket.category}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectTicket) onSelectTicket(ticket);
                          else if (onNavigateTab) onNavigateTab('tickets');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-semibold text-[11px] transition-colors border border-[#00D9E8]/30"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Agents (1 col) */}
        <div className="rounded-2xl bg-[#111729] border border-[#252D42] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#E7B43F]" />
                  Active Support Agents
                </h3>
                <p className="text-xs text-[#A7B1C2] mt-0.5">Top resolution performers this month</p>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('team')}
                className="text-xs font-semibold text-[#00D9E8] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {agents.slice(0, 4).map((agent) => (
                <div
                  key={agent.id}
                  className="p-3 rounded-xl bg-[#070918]/60 border border-[#252D42] hover:border-[#00D9E8]/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-[#111729] border border-[#252D42] flex items-center justify-center text-sm">
                        {agent.avatar || '🎧'}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#091426] ${
                          agent.status === 'online'
                            ? 'bg-[#10B981]'
                            : agent.status === 'busy'
                            ? 'bg-[#E7B43F]'
                            : 'bg-[#64748B]'
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{agent.name}</p>
                      <p className="text-[10px] text-[#A7B1C2]">{agent.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-[#10B981]">
                      {agent.resolvedTickets || agent.ticketsResolved || 142} Solved
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[11px] text-[#E7B43F] font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{agent.csat || agent.rating || '4.9'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#252D42]">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#00D9E8]/10 via-[#10B981]/10 to-transparent border border-[#00D9E8]/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">First Contact Resolution</p>
                <p className="text-[11px] text-[#A7B1C2]">Target 85% • Current 88.5%</p>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold text-[#10B981] bg-[#10B981]/20 rounded-full border border-[#10B981]/30">
                +3.5%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
