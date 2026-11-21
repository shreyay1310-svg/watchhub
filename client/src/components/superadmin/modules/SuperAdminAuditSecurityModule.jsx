import React, { useState, useEffect } from 'react';
import { Shield, Search, RefreshCw, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';
import api from '../../../services/api';

export default function SuperAdminAuditSecurityModule() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/super-admin/audit-logs');
      if (res.data.status === 'success') {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.performer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#D6A33A]" />
            <span>Audit & Security Center</span>
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Immutable system audit logs, staff administrative actions, and security access telemetry.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAuditLogs}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D6A33A]' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit actions, modules, or performers..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A] placeholder:text-gray-500"
          />
        </div>
        <span className="text-gray-400 text-xs font-semibold">{filteredLogs.length} events logged</span>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0B1222] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#080E1C] text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">MODULE</th>
                <th className="py-3 px-4">PERFORMED BY</th>
                <th className="py-3 px-4">IP ADDRESS</th>
                <th className="py-3 px-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No matching audit records in database.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-gray-400 text-[11px] font-mono">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-xs">{l.action}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-[#D6A33A] border border-white/10">
                        {l.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-medium">{l.performer}</td>
                    <td className="py-3 px-4 text-gray-400 font-mono text-[11px]">{l.ipAddress}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        <span>Committed</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
