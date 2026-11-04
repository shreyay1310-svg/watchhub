import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, BarChart3, FileSpreadsheet, Printer } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SALES_REPORT = [
  { category: "Men's Watches", revenue: 480000, orders: 480, returnRate: '1.8%' },
  { category: "Women's Watches", revenue: 320000, orders: 360, returnRate: '2.1%' },
  { category: 'Smartwatches', revenue: 240000, orders: 240, returnRate: '3.4%' },
  { category: 'Combo Offers', revenue: 160000, orders: 120, returnRate: '1.2%' },
  { category: 'Luxury Swiss', revenue: 148000, orders: 18, returnRate: '0.0%' },
];

export const ReportsAnalyticsModule = () => {
  const [reportType, setReportType] = useState('sales');

  const handleExport = (format) => {
    alert(`📊 Generating WatchHub Official ${reportType.toUpperCase()} Financial Report (${format}). Download will start shortly.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>📈</span> Business Intelligence & Financial Reports
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Export audit-grade sales, category performance, tax schedules and courier SLA analytics.
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => handleExport('CSV')} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
          </button>
          <button onClick={() => handleExport('PDF')} className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <h4 className="text-xs font-bold text-gray-800 mb-4 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-watch-gold" /> Category Revenue Distribution (INR)
        </h4>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SALES_REPORT}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Bar dataKey="revenue" fill="#D9A441" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center text-xs">
          <span className="font-bold text-gray-800">Quarterly Category Financial Breakdown</span>
          <span className="text-gray-400">Total Revenue: ₹12,48,000</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10.5px]">
            <tr>
              <th className="py-3 px-4">Watch Category</th>
              <th className="py-3 px-4">Units Sold</th>
              <th className="py-3 px-4">Gross Revenue</th>
              <th className="py-3 px-4">Avg Selling Price</th>
              <th className="py-3 px-4">Return %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SALES_REPORT.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-900">{row.category}</td>
                <td className="py-3 px-4">{row.orders} orders</td>
                <td className="py-3 px-4 font-bold text-emerald-700">₹{row.revenue.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-gray-600">₹{Math.round(row.revenue / row.orders).toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-gray-500">{row.returnRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsAnalyticsModule;

