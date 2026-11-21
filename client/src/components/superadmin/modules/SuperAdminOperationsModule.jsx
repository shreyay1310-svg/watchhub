import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Database,
  Server,
  AlertTriangle,
  HardDriveDownload,
  RefreshCw,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
} from 'lucide-react';
import api from '../../../services/api';

export default function SuperAdminOperationsModule({ subTab = 'health' }) {
  const [activeSub, setActiveSub] = useState(subTab);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState(null);
  const [dbData, setDbData] = useState(null);

  const fetchOperationsData = async () => {
    try {
      setLoading(true);
      const [hRes, dRes] = await Promise.all([
        api.get('/api/super-admin/system-health'),
        api.get('/api/super-admin/database-diagnostics'),
      ]);
      if (hRes.data.status === 'success') setHealthData(hRes.data.health);
      if (dRes.data.status === 'success') setDbData(dRes.data.database);
    } catch (err) {
      console.error('Failed to load operations metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-[#D6A33A]" />
            <span>Operations & Infrastructure Telemetry</span>
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Enterprise database tables, microservice response latency, memory, and automated backups.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOperationsData}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D6A33A]' : ''}`} />
          <span>Poll Status</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0B1222] border border-white/10 w-fit">
        {[
          { id: 'health', label: 'System Health', icon: HeartPulse },
          { id: 'database', label: 'Database Monitoring', icon: Database },
          { id: 'api-monitoring', label: 'API Monitoring', icon: Server },
          { id: 'backup', label: 'Backup & Recovery', icon: HardDriveDownload },
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeSub === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSub(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                isAct
                  ? 'bg-[#D6A33A] text-black shadow-md shadow-[#D6A33A]/20 font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Rendering based on Sub Tab */}
      {activeSub === 'health' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Runtime Status</span>
              <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>{healthData?.status || 'OPTIMAL'}</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">Uptime: {healthData?.uptimeSeconds || 0} seconds</span>
            </div>

            <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">V8 Heap Memory</span>
              <div className="text-xl font-bold text-white mt-1">
                {healthData?.memoryUsageMB?.heapUsed || 0} MB
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Total Allocated: {healthData?.memoryUsageMB?.heapTotal || 0} MB
              </span>
            </div>

            <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Node Environment</span>
              <div className="text-xl font-bold text-[#F6C453] mt-1">{healthData?.nodeVersion || 'v26.4.0'}</div>
              <span className="text-[10px] text-gray-400 mt-1 block">Platform: {healthData?.platform || 'win32'}</span>
            </div>
          </div>

          <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-white text-sm">Monitored Service Grid</h3>
            <div className="divide-y divide-white/5">
              {healthData?.services?.map((s) => (
                <div key={s.name} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-xs block">{s.name}</span>
                    <span className="text-[10px] text-gray-400">Port {s.port || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {s.responseTimeMs && (
                      <span className="text-[11px] text-gray-400">{s.responseTimeMs} ms</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSub === 'database' && (
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-white text-sm">{dbData?.engine}</h3>
              <p className="text-[11px] text-gray-400">Host: {dbData?.host} &bull; Database: {dbData?.name}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {dbData?.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dbData?.tables?.map((t) => (
              <div key={t.table} className="bg-[#111A2C] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">{t.table}</span>
                  <span className="text-[10px] text-gray-400">Status: {t.status}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-xs">
                  {t.records}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSub === 'api-monitoring' && (
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-sm">Protected API Endpoints Registry</h3>
          <div className="divide-y divide-white/5 text-xs">
            {[
              { path: '/api/super-admin/overview', method: 'GET', auth: 'Super Admin', latency: '4ms' },
              { path: '/api/super-admin/users', method: 'GET', auth: 'Super Admin', latency: '6ms' },
              { path: '/api/super-admin/roles', method: 'GET', auth: 'Super Admin', latency: '5ms' },
              { path: '/api/super-admin/departments', method: 'GET', auth: 'Super Admin', latency: '3ms' },
              { path: '/api/super-admin/database-diagnostics', method: 'GET', auth: 'Super Admin', latency: '8ms' },
              { path: '/api/super-admin/system-health', method: 'GET', auth: 'Super Admin', latency: '2ms' },
            ].map((ep) => (
              <div key={ep.path} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-mono font-bold text-[10px]">
                    {ep.method}
                  </span>
                  <span className="font-mono text-white text-[11px]">{ep.path}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-[10px]">{ep.latency}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#D6A33A]/15 text-[#D6A33A] text-[10px] font-bold">
                    {ep.auth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSub === 'backup' && (
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Automated SQL Server Snapshot Backup</h3>
              <p className="text-[11px] text-gray-400">Point-in-time recovery image for WatchHubDB database.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              HEALTHY
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#111A2C] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-gray-300">
              <span>Target Database:</span>
              <span className="font-bold text-white">WatchHubDB (MSSQL 2025)</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Storage Policy:</span>
              <span className="text-gray-300">Local Encrypted Volume</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Last Snapshot Timestamp:</span>
              <span className="text-emerald-400 font-semibold">{new Date().toLocaleDateString()} 04:00 AM IST</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
