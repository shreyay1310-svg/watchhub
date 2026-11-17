import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  User,
  Clock,
  Building2,
  FileText,
  RotateCcw,
} from 'lucide-react';

export default function InventoryHistoryModule({ history }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChangeType, setSelectedChangeType] = useState('All');

  const changeTypes = [
    'All',
    'Inbound PO Restock',
    'POS Counter Sale',
    'Inter-Hub Transfer Out',
    'Damage Quarantine Write-Down',
    'Physical Stock Correction',
  ];

  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      const matchType = selectedChangeType === 'All' || h.changeType === selectedChangeType;
      const matchSearch =
        !searchQuery ||
        h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.modifiedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.remarks.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [history, selectedChangeType, searchQuery]);

  const exportAuditLog = () => {
    const headers = ['HistoryID,Date,Time,Product,SKU,Warehouse,Before,After,Diff,ChangeType,ModifiedBy,Remarks\n'];
    const rows = filteredHistory.map(
      (h) =>
        `"${h.id}","${h.date}","${h.exactTime}","${h.productName}","${h.sku}","${h.warehouse}",${h.previousStock},${h.updatedStock},"${h.diff}","${h.changeType}","${h.modifiedBy}","${h.remarks}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_audit_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header & Immutable Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Immutable Audit Vault
            </span>
            <span className="text-xs text-[#A7B1C2]">• Cryptographically Signed Log</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Inventory Audit History</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Non-repudiable audit trail of every stock modification, barcode scan, transfer dispatch, and manager reconciliation.
          </p>
        </div>

        <button
          onClick={exportAuditLog}
          className="px-3.5 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
          <span>Export Audit History</span>
        </button>
      </div>

      {/* 2. Security Banner */}
      <div className="bg-gradient-to-r from-[#17165A] to-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-white text-xs">Immutable Ledger Protection Active</h4>
          <p className="text-[11px] text-[#A7B1C2]">
            All recorded historical events are locked and preserved in compliance with Swiss Horological export standards and ISO 9001 inventory security regulations.
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by ID, SKU, product, user, invoice..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          <div>
            <select
              value={selectedChangeType}
              onChange={(e) => setSelectedChangeType(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {changeTypes.map((t) => (
                <option key={t} value={t}>
                  Change Type: {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Audit History Table */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Product / SKU</th>
                <th className="py-3 px-3">Vault Location</th>
                <th className="py-3 px-3 text-center">Before → After</th>
                <th className="py-3 px-3 text-center">Diff</th>
                <th className="py-3 px-3">Change Type</th>
                <th className="py-3 px-3">Signed Off By</th>
                <th className="py-3 px-4">Audit Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29305D]/50">
              {filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-[#17165A]/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#00D5FF] text-[11px]">{h.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{h.date}</p>
                    <p className="text-[10px] text-[#A7B1C2]">{h.exactTime}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-white text-xs">{h.productName}</p>
                    <p className="text-[10px] font-mono text-[#A7B1C2]">{h.sku}</p>
                  </td>
                  <td className="py-3 px-3 text-gray-200">{h.warehouse}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="text-[#A7B1C2]">{h.previousStock}</span>
                    <span className="text-[#00D5FF] mx-1 font-bold">→</span>
                    <strong className="text-white">{h.updatedStock}</strong>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span className={h.diff.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                      {h.diff}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#17165A] text-white text-[10px] border border-[#29305D]">
                      {h.changeType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-300 font-medium">{h.modifiedBy}</td>
                  <td className="py-3 px-4 text-gray-400 text-[11px] max-w-[260px]">
                    <span className="line-clamp-2">{h.remarks}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
