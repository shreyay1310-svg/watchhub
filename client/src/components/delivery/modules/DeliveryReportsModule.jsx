import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Truck,
  Users,
  Building,
  BarChart3,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';

export const DeliveryReportsModule = ({
  orders = [],
  riders = [],
  couriers = [],
  attempts = [],
  returns = [],
}) => {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRiders = Array.isArray(riders) ? riders : [];
  const safeCouriers = Array.isArray(couriers) ? couriers : [];
  const safeAttempts = Array.isArray(attempts) ? attempts : [];
  const safeReturns = Array.isArray(returns) ? returns : [];

  const [selectedReportId, setSelectedReportId] = useState('daily');
  const [dateFilter, setDateFilter] = useState('This Month (Nov 2026)');
  const [cityFilter, setCityFilter] = useState('All');
  const [partnerFilter, setPartnerFilter] = useState('All');

  const REPORT_CATEGORIES = [
    { id: 'daily', name: '1. Daily Delivery Report', icon: Calendar, desc: 'Hourly dispatch, transit & doorstep completion metrics' },
    { id: 'monthly', name: '2. Monthly Delivery Report', icon: TrendingUp, desc: '30-day cumulative volume and SLA adherence' },
    { id: 'successful', name: '3. Successful Delivery Report', icon: CheckCircle, desc: 'First-attempt success and OTP verified handovers' },
    { id: 'failed', name: '4. Failed Delivery Report', icon: AlertTriangle, desc: 'Doorstep failure breakdown by cause code' },
    { id: 'rider_perf', name: '5. Rider Performance Report', icon: Users, desc: 'Deliveries, ratings and punctuality by driver' },
    { id: 'courier_perf', name: '6. Courier Partner Performance', icon: Truck, desc: 'Blue Dart, Delhivery, DTDC benchmark SLA' },
    { id: 'attempts', name: '7. Delivery Attempts Report', icon: Clock, desc: 'Reattempts, reschedule counts & notice cards' },
    { id: 'returns', name: '8. Return & Pickup Report', icon: RotateCcw, desc: 'Reverse logistics, inspections & refund speeds' },
    { id: 'city_wise', name: '9. City-wise Delivery Report', icon: Building, desc: 'Geographic distribution (Delhi, Mumbai, BLR, HYD)' },
    { id: 'costs', name: '10. Delivery Cost Report', icon: DollarSign, desc: 'Freight charges, fuel surcharges & per-order cost' },
    { id: 'avg_time', name: '11. Average Delivery Time', icon: Clock, desc: 'Transit lead time from vault pack to customer wrist' },
    { id: 'sla_perf', name: '12. SLA Performance Report', icon: ShieldCheck, desc: 'Contractual on-time delivery guarantees (99.2%)' },
  ];

  // Chart data
  const weeklyTrends = [
    { day: 'Mon', completed: 184, attempts: 8, failed: 1 },
    { day: 'Tue', completed: 210, attempts: 12, failed: 2 },
    { day: 'Wed', completed: 195, attempts: 6, failed: 0 },
    { day: 'Thu', completed: 240, attempts: 14, failed: 2 },
    { day: 'Fri', completed: 285, attempts: 18, failed: 3 },
    { day: 'Sat', completed: 320, attempts: 22, failed: 4 },
    { day: 'Sun', completed: 260, attempts: 10, failed: 1 },
  ];

  const cityDistribution = [
    { city: 'Delhi-NCR', count: 480, onTime: 99.4 },
    { city: 'Mumbai', count: 410, onTime: 98.8 },
    { city: 'Bengaluru', count: 320, onTime: 98.5 },
    { city: 'Hyderabad', count: 180, onTime: 97.9 },
    { city: 'Others', count: 92, onTime: 96.5 },
  ];

  // Export handlers
  const handleExportCSV = () => {
    const reportTitle = REPORT_CATEGORIES.find((r) => r.id === selectedReportId)?.name || 'Delivery Report';
    let content = `WatchHub Enterprise Logistics - ${reportTitle}\nDate Generated: ${new Date().toLocaleString()}\nFilter: ${dateFilter}\n\n`;
    content += 'Order ID,Customer,City,Courier,Rider,Status,Amount\n';
    safeOrders.forEach((o) => {
      content += `${o.orderId},"${o.customerName}",${o.city},"${o.deliveryPartner}","${o.rider}",${o.deliveryStatus},${o.orderAmount}\n`;
    });

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WatchHub_${selectedReportId}_report_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE TITLE & EXPORT CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Delivery Intelligence & Analytics Reports
          </h1>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Audit 12 comprehensive logistics reports with real-time operational data and multi-format exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#28334B] text-xs font-semibold text-white"
          >
            <Printer className="w-3.5 h-3.5 text-[#E9B94F]" />
            <span>Print</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6500FF] hover:bg-[#7310FF] border border-[#6500FF]/50 text-xs font-bold text-white shadow-md shadow-[#6500FF]/25"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export (Excel / CSV)</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Average Delivery Lead Time</span>
          <span className="text-2xl font-bold text-[#00D5FF] block mt-1">18.4 Hours</span>
          <span className="text-[10px] text-[#00C98B] mt-0.5 block">-2.1 hrs vs last month</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">First-Attempt Success Rate</span>
          <span className="text-2xl font-bold text-[#00C98B] block mt-1">98.2%</span>
          <span className="text-[10px] text-[#00C98B] mt-0.5 block">+1.4% improvement</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">SLA Commitment Adherence</span>
          <span className="text-2xl font-bold text-[#E9B94F] block mt-1">99.4%</span>
          <span className="text-[10px] text-[#A7B1C2] mt-0.5 block">Exceeds 98.5% target</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-lg">
          <span className="text-xs font-semibold text-[#A7B1C2] block">Reverse Logistics Return Rate</span>
          <span className="text-2xl font-bold text-white block mt-1">1.2%</span>
          <span className="text-[10px] text-[#00C98B] mt-0.5 block">Industry benchmark &lt;3%</span>
        </div>
      </div>

      {/* 3. TWO COLUMNS: LEFT (12 REPORT CATEGORIES) + RIGHT (REPORT CHART & DATA GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: 12 REPORT SELECTORS (4 Cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-3">
          <h3 className="font-serif font-bold text-base text-white">
            12 Report Categories
          </h3>
          <p className="text-xs text-[#A7B1C2] mb-3">
            Select a report to inspect live database records:
          </p>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
            {REPORT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedReportId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedReportId(cat.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${isSelected
                    ? 'bg-gradient-to-r from-[#6500FF]/30 to-[#8B00FF]/20 border-[#6500FF] shadow-md shadow-[#6500FF]/20 ring-1 ring-[#6500FF]'
                    : 'bg-[#081529]/60 hover:bg-[#081529] border-[#28334B]'
                    }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-[#6500FF] text-white' : 'bg-white/5 text-[#A7B1C2]'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className={`font-bold text-xs block ${isSelected ? 'text-white' : 'text-[#A7B1C2]'}`}>
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#A7B1C2] truncate block mt-0.5">
                      {cat.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: REPORT CHARTS & PREVIEW TABLE (8 Cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#11172C] border border-[#28334B] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#28334B] gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#00D5FF] tracking-wider block">
                Active Report View
              </span>
              <h3 className="font-serif font-bold text-base text-white mt-0.5">
                {REPORT_CATEGORIES.find((r) => r.id === selectedReportId)?.name}
              </h3>
            </div>

            {/* Filter selectors */}
            <div className="flex items-center gap-2 text-xs">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-[#081529] border border-[#28334B] text-white focus:outline-none"
              >
                <option value="This Month (Nov 2026)">This Month (Nov 2026)</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Q4 2026">Q4 2026</option>
              </select>
            </div>
          </div>

          {/* Interactive Chart Visual */}
          <div className="p-4 rounded-xl bg-[#081529] border border-[#28334B]">
            <span className="text-xs font-bold text-white block mb-2">
              Shipment Velocity & Completion Volume
            </span>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#28334B" />
                  <XAxis dataKey="day" stroke="#A7B1C2" fontSize={11} />
                  <YAxis stroke="#A7B1C2" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#11172C', borderColor: '#28334B', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="completed" name="Delivered Orders" fill="#00C98B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attempts" name="Doorstep Attempts" fill="#E9B94F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" name="Exceptions / Fails" fill="#FF4966" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* City Distribution Bar Summary */}
          <div>
            <span className="text-xs font-bold text-white block mb-2">
              Top Geographic Corridors SLA Benchmark
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              {cityDistribution.map((item) => (
                <div key={item.city} className="p-2.5 rounded-xl bg-[#081529] border border-[#28334B]">
                  <span className="text-xs font-bold text-white block truncate">{item.city}</span>
                  <span className="text-[11px] text-[#00D5FF] font-semibold block mt-0.5">{item.count} drops</span>
                  <span className="text-[10px] text-[#00C98B] font-bold block">{item.onTime}% On-Time</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Data Ledger */}
          <div>
            <span className="text-xs font-bold text-white block mb-2">
              Sample Report Audit Entries ({orders.length} Records)
            </span>
            <div className="overflow-x-auto rounded-xl border border-[#28334B]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#081529] text-[10px] font-bold text-[#A7B1C2] uppercase border-b border-[#28334B]">
                    <th className="py-2.5 pl-3">Order ID</th>
                    <th className="py-2.5 px-2">Customer</th>
                    <th className="py-2.5 px-2">City</th>
                    <th className="py-2.5 px-2">Courier Partner</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 pr-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#28334B] text-white">
                  {orders.slice(0, 4).map((o) => (
                    <tr key={o.orderId} className="hover:bg-white/5">
                      <td className="py-2.5 pl-3 font-mono font-bold text-[#00D5FF]">{o.orderId}</td>
                      <td className="py-2.5 px-2">{o.customerName}</td>
                      <td className="py-2.5 px-2 text-[#A7B1C2]">{o.city}</td>
                      <td className="py-2.5 px-2 font-medium">{o.deliveryPartner}</td>
                      <td className="py-2.5 px-2">
                        <span className="text-[#00C98B] font-bold text-[10.5px]">{o.deliveryStatus}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-right font-bold text-white">{o.formattedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReportsModule;
