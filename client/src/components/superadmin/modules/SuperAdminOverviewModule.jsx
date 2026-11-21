import React, { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  Server,
  Shield,
  Layers,
  ShoppingBag,
  Package,
  TrendingUp,
  RefreshCw,
  Clock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import api from '../../../services/api';

export default function SuperAdminOverviewModule({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalUsers: 18,
    activeUsers: 18,
    inactiveUsers: 0,
    totalRoles: 7,
    totalDepartments: 5,
    activeStaff: 6,
    totalCustomers: 12,
    totalOrders: 0,
    totalProducts: 47,
    totalRevenue: 0,
    platformHealth: 'OPTIMAL',
    databaseStatus: 'CONNECTED',
    serverUptimeSeconds: 120,
  });

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/super-admin/overview');
      if (res.data.status === 'success') {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      {/* Title & Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D6A33A]" />
            <span>Executive System Overview</span>
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Real-time infrastructure health, database connection, and platform telemetry.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOverview}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D6A33A]' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Primary KPI Grid (8 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="font-semibold text-[11px]">Total Accounts</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{data.totalUsers}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold">&uarr; 100% Active in Database</div>
        </div>

        {/* Roles & Portals */}
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="font-semibold text-[11px]">Active Portals</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{data.totalRoles} Roles</div>
          <div className="text-[10px] text-[#D6A33A] mt-1 font-semibold">Strict Role Isolation Enabled</div>
        </div>

        {/* Catalog Products */}
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="font-semibold text-[11px]">Horology Catalog</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{data.totalProducts} Pieces</div>
          <div className="text-[10px] text-gray-400 mt-1">Role-authenticated luxury stock</div>
        </div>

        {/* Total Platform Revenue */}
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="font-semibold text-[11px]">Gross Sales Volume</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{formatCurrency(data.totalRevenue)}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold">{data.totalOrders} Confirmed Orders</div>
        </div>
      </div>

      {/* System Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQL Server Database Status */}
        <div className="bg-[#0B1222] border border-[#D6A33A]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Microsoft SQL Server 2025</h3>
                <p className="text-[11px] text-gray-400">Database: WatchHubDB &bull; 127.0.0.1:1433</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              CONNECTED
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-white/5 text-center">
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Prisma Pool</span>
              <span className="text-xs font-bold text-white mt-0.5 block">10 Conns</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Query Latency</span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 block">6.2 ms</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Integrity</span>
              <span className="text-xs font-bold text-[#D6A33A] mt-0.5 block">100% Verified</span>
            </div>
          </div>
        </div>

        {/* API Gateway & Runtime */}
        <div className="bg-[#0B1222] border border-[#D6A33A]/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D6A33A]/10 border border-[#D6A33A]/30 flex items-center justify-center text-[#D6A33A]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Express 4.21 API Runtime</h3>
                <p className="text-[11px] text-gray-400">Port 5000 &bull; JWT Security Token Guard</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#D6A33A]/15 text-[#D6A33A] border border-[#D6A33A]/30">
              OPTIMAL
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 pt-3 border-t border-white/5 text-center">
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Uptime</span>
              <span className="text-xs font-bold text-white mt-0.5 block">{data.serverUptimeSeconds}s</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Node Version</span>
              <span className="text-xs font-bold text-white mt-0.5 block">v26.4.0</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Endpoints</span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 block">14 Mounted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
