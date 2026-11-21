import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const ReportsAnalyticsModule = ({
  stats,
  monthlyTrends = [],
  categoryDistribution = [],
  agents = [],
}) => {
  const [timeRange, setTimeRange] = useState('30d');

  const csatData = [
    { week: 'W1', csat: 4.7, target: 4.5 },
    { week: 'W2', csat: 4.8, target: 4.5 },
    { week: 'W3', csat: 4.9, target: 4.5 },
    { week: 'W4', csat: 4.85, target: 4.5 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Agent,Role,Assigned,Resolved,CSAT,AvgResolutionTime\n' +
      agents
        .map(
          (a) =>
            `"${a.name}","${a.role}",${a.assignedTickets || 20},${a.resolvedTickets || 18},"${a.csat || '4.9'}","${a.avgResolution || '3h'}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'WatchHub_Support_Analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Date Range and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Support Analytics & SLA Insights
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Deep dive into customer sentiment, ticket throughput, agent velocity, and SLA adherence
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#111729] rounded-xl border border-[#252D42] p-1 text-xs">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-[#00D9E8] text-[#070918]'
                    : 'text-[#A7B1C2] hover:text-white'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#111729] hover:bg-[#161F38] text-white text-xs font-semibold rounded-xl border border-[#252D42] hover:border-[#00D9E8] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#00D9E8]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">SLA Resolution Rate</span>
          <p className="text-2xl font-bold text-[#10B981] mt-1">98.4%</p>
          <p className="text-xs text-[#64748B] mt-1.5">+1.2% over target SLA</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">First Contact Resolution (FCR)</span>
          <p className="text-2xl font-bold text-[#00D9E8] mt-1">88.5%</p>
          <p className="text-xs text-[#64748B] mt-1.5">Zero back-and-forth for 88% tickets</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Overall CSAT Rating</span>
          <p className="text-2xl font-bold text-[#E7B43F] mt-1">4.88 / 5.0</p>
          <p className="text-xs text-[#10B981] mt-1.5 font-semibold">96.5% 5-Star Reviews</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Average First Response</span>
          <p className="text-2xl font-bold text-white mt-1">4m 32s</p>
          <p className="text-xs text-[#64748B] mt-1.5">Target: Under 15m</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Trends */}
        <div className="p-5 rounded-2xl bg-[#111729] border border-[#252D42] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Ticket Velocity</h3>
              <p className="text-xs text-[#A7B1C2]">Tickets received vs resolved each month</p>
            </div>
            <span className="text-xs text-[#00D9E8] font-bold">Past 6 Months</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252D42" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091426',
                    borderColor: '#252D42',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                />
                <Bar dataKey="received" name="Inbound" fill="#00D9E8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CSAT Trend Chart */}
        <div className="p-5 rounded-2xl bg-[#111729] border border-[#252D42] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Collector CSAT Score Trend</h3>
              <p className="text-xs text-[#A7B1C2]">Weekly customer satisfaction ratings</p>
            </div>
            <span className="text-xs text-[#E7B43F] font-bold">Goal: &gt; 4.5 / 5.0</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={csatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252D42" vertical={false} />
                <XAxis dataKey="week" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[4.0, 5.0]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091426',
                    borderColor: '#252D42',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="csat"
                  name="CSAT Score"
                  stroke="#E7B43F"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#E7B43F' }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke="#64748B"
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Performance Leaderboard Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#091426] border-b border-[#252D42] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Support Executive Performance Scorecard</h3>
            <p className="text-xs text-[#A7B1C2]">Resolution volume, average response times and client ratings</p>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Agent Name</th>
                <th className="py-3 px-4 font-semibold">Role Tier</th>
                <th className="py-3 px-4 font-semibold">Assigned</th>
                <th className="py-3 px-4 font-semibold">Resolved</th>
                <th className="py-3 px-4 font-semibold">Avg Response</th>
                <th className="py-3 px-4 font-semibold">Avg Resolution</th>
                <th className="py-3 px-4 font-semibold">CSAT Score</th>
                <th className="py-3 px-4 font-semibold">FCR %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {agents.map((ag) => (
                <tr key={ag.id} className="hover:bg-[#070918]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2 min-w-0">
                      {typeof ag.avatar === 'string' && (ag.avatar.startsWith('http') || ag.avatar.startsWith('/')) ? (
                        <img
                          src={ag.avatar}
                          alt={ag.name}
                          className="w-7 h-7 rounded-lg object-cover border border-[#00D9E8]/30 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-7 h-7 rounded-lg bg-[#00D9E8]/10 text-[#00D9E8] items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                          typeof ag.avatar === 'string' && (ag.avatar.startsWith('http') || ag.avatar.startsWith('/'))
                            ? 'hidden'
                            : 'flex'
                        }`}
                      >
                        {typeof ag.avatar === 'string' && !ag.avatar.startsWith('http') && ag.avatar.length <= 4
                          ? ag.avatar
                          : ag.name?.charAt(0) || '🎧'}
                      </div>
                      <span className="truncate">{ag.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#A7B1C2]">{ag.role}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {ag.assignedTickets || 34}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#10B981]">
                    {ag.resolvedTickets || 31}
                  </td>
                  <td className="py-3.5 px-4 text-[#A7B1C2]">{ag.avgResponse || '3m 45s'}</td>
                  <td className="py-3.5 px-4 text-[#A7B1C2]">{ag.avgResolution || '2h 15m'}</td>
                  <td className="py-3.5 px-4 font-bold text-[#E7B43F]">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{ag.csat || '4.9'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#10B981] font-semibold">
                    {ag.fcr || '89.2%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalyticsModule;
