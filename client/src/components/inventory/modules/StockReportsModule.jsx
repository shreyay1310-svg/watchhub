import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  PieChart,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Building2,
  DollarSign,
  ArrowRightLeft,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function StockReportsModule({
  products = [],
  warehouses = [],
  movements = [],
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeWarehouses = Array.isArray(warehouses) ? warehouses : [];
  const safeMovements = Array.isArray(movements) ? movements : [];

  const [selectedReportId, setSelectedReportId] = useState('val');
  const [dateRange, setDateRange] = useState('Month to Date (Nov 2026)');

  const REPORT_CATEGORIES = [
    { id: 'val', name: 'Stock Valuation Report', icon: DollarSign, desc: 'Detailed cost vs selling price balance certified by vault location.', tag: 'Financial' },
    { id: 'vel', name: 'Fast vs Slow Moving Velocity', icon: Sparkles, desc: 'Horological turnover velocity and days-on-shelf index.', tag: 'Turnover' },
    { id: 'shr', name: 'Inventory Shrinkage & Loss', icon: AlertTriangle, desc: 'Cycle count discrepancies, transit damages, and write-downs.', tag: 'Audit' },
    { id: 'whu', name: 'Warehouse Utilization Index', icon: Building2, desc: 'Square footage, safe occupancy, and high-value vault limits.', tag: 'Logistics' },
    { id: 'inout', name: 'Stock In vs Stock Out Summary', icon: ArrowRightLeft, desc: 'Flow volumes, inbound PO deliveries vs boutique sales.', tag: 'Volume' },
    { id: 'lead', name: 'Reorder Frequency & Lead Time', icon: Clock, desc: 'Swiss manufacturer lead times and PO fulfillment accuracy.', tag: 'Procurement' },
    { id: 'brand', name: 'Brand-wise Inventory Turnover', icon: BarChart3, desc: 'Rolex, Omega, Cartier, and TAG Heuer asset returns.', tag: 'Brands' },
    { id: 'margin', name: 'Category Margin & Profitability', icon: TrendingUp, desc: 'Gross margin contributions by Automatic, Chrono, and Luxury.', tag: 'Margins' },
    { id: 'dead', name: 'Dead Stock & Obsolete Inventory', icon: Boxes, desc: 'Items with zero movement for >90 days across boutiques.', tag: 'Risk' },
    { id: 'trans', name: 'Inter-Warehouse Transfer Audit', icon: ArrowRightLeft, desc: 'Regional rebalances between Gurugram, Delhi, and Mumbai.', tag: 'Transit' },
    { id: 'daily', name: 'Daily Stock Balance Ledger', icon: FileSpreadsheet, desc: 'Day-by-day closing balances and chronometer certifications.', tag: 'Compliance' },
    { id: 'chan', name: 'POS vs Online Stock Allocation', icon: PieChart, desc: 'Boutique counter stock reserves vs website fulfillment.', tag: 'Omnichannel' },
  ];

  // Chart data for valuation report
  const valuationTrend = [
    { month: 'Jun', value: 6.8 },
    { month: 'Jul', value: 7.2 },
    { month: 'Aug', value: 7.5 },
    { month: 'Sep', value: 7.9 },
    { month: 'Oct', value: 8.1 },
    { month: 'Nov', value: 8.42 },
  ];

  const handleExport = (format) => {
    const active = REPORT_CATEGORIES.find((r) => r.id === selectedReportId)?.name || 'Inventory Report';
    alert(`Generating & Downloading WatchHub ${active} (${format.toUpperCase()}) for ${dateRange}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Audit Intelligence
            </span>
            <span className="text-xs text-[#A7B1C2]">• 12 Standard Horological Reports</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Stock Reports &amp; Valuations</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Certified executive reports for auditors, tax compliance, insurance limits, and procurement forecasting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel (.xlsx)</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:from-[#5700db] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#6500FF]/25 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF Export</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#E9B94F] border border-[#29305D] transition-all cursor-pointer"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Chart Preview */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00D5FF]" />
              <span>Valuation &amp; Capital Allocation Trend (₹ Crores)</span>
            </h3>
            <p className="text-[11px] text-[#A7B1C2]">Insured high-security vault asset growth over 6 months</p>
          </div>
          <span className="text-xs font-bold text-[#E9B94F] bg-[#17165A] px-3 py-1 rounded-xl border border-[#29305D]">
            Current Net Value: ₹8.42 Cr
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={valuationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D5FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00D5FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#A7B1C2" fontSize={11} tickLine={false} />
              <YAxis stroke="#A7B1C2" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#17165A',
                  borderColor: '#29305D',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Area type="monotone" dataKey="value" name="Valuation (₹ Cr)" stroke="#00D5FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. The 12 Comprehensive Report Category Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#E9B94F]" />
          <span>Select Report Category to Generate</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_CATEGORIES.map((rpt) => {
            const Icon = rpt.icon;
            const isSelected = selectedReportId === rpt.id;

            return (
              <div
                key={rpt.id}
                onClick={() => setSelectedReportId(rpt.id)}
                className={`bg-[#11123D] border rounded-2xl p-4 shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected ? 'border-[#00D5FF] bg-[#17165A]' : 'border-[#29305D] hover:border-[#6500FF]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#6500FF]/20 text-[#00D5FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#17165A] text-[#A7B1C2] border border-[#29305D]">
                      {rpt.tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs mb-1 group-hover:text-[#00D5FF] transition-colors">
                    {rpt.name}
                  </h4>
                  <p className="text-[11px] text-[#A7B1C2] line-clamp-2 leading-relaxed">
                    {rpt.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#29305D]/50 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#E9B94F] font-semibold">Ready to generate</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport('pdf');
                    }}
                    className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF] text-white transition-all"
                    title="Quick Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
