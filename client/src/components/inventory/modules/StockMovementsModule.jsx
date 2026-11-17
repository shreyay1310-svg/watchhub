import React, { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
  Clock,
  User,
  FileText,
  ChevronRight,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
  ListFilter,
  Layers,
  X,
  Boxes,
} from 'lucide-react';

export default function StockMovementsModule({ movements, warehouses }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [viewMode, setViewMode] = useState('ledger'); // 'ledger' or 'timeline'
  const [selectedMovement, setSelectedMovement] = useState(null);

  // All 8 required Movement types:
  // Stock In, Stock Out, Sales Deduction, Customer Return, Supplier Return, Warehouse Transfer, Damaged Stock, Manual Adjustment
  const movementTypes = [
    'All',
    'Stock In',
    'Stock Out',
    'Sales Deduction',
    'Customer Return',
    'Supplier Return',
    'Warehouse Transfer',
    'Damaged Stock',
    'Manual Adjustment',
  ];

  // Filter movements
  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchType = selectedType === 'All' || m.type === selectedType;
      const matchWh =
        selectedWarehouse === 'All' ||
        (m.fromLocation && m.fromLocation.includes(selectedWarehouse)) ||
        (m.toLocation && m.toLocation.includes(selectedWarehouse));
      const matchSearch =
        !searchQuery ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.reference && m.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.performedBy && m.performedBy.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchWh && matchSearch;
    });
  }, [movements, selectedType, selectedWarehouse, searchQuery]);

  // Top Summary Cards: Total Stock In, Total Stock Out, Warehouse Transfers, Returns
  const totalStockIn = movements
    .filter((m) => m.type === 'Stock In' || m.quantity > 0)
    .reduce((s, m) => s + Math.abs(m.quantity || 0), 0);

  const totalStockOut = movements
    .filter((m) => m.type === 'Stock Out' || m.type === 'Sales Deduction' || (m.quantity < 0 && m.type !== 'Warehouse Transfer'))
    .reduce((s, m) => s + Math.abs(m.quantity || 0), 0);

  const totalTransfers = movements
    .filter((m) => m.type === 'Warehouse Transfer')
    .reduce((s, m) => s + Math.abs(m.quantity || 0), 0);

  const totalReturns = movements
    .filter((m) => m.type === 'Customer Return' || m.type === 'Supplier Return')
    .reduce((s, m) => s + Math.abs(m.quantity || 0), 0);

  const exportCSV = () => {
    const headers = ['MovementID,Date,Time,Product,SKU,Type,PreviousStock,QuantityChanged,UpdatedStock,SourceWarehouse,DestinationWarehouse,PerformedBy,Status\n'];
    const rows = filteredMovements.map(
      (m) =>
        `"${m.id}","${m.date}","${m.time}","${m.productName}","${m.sku}","${m.type}",${m.previousStock || 20},${m.quantity},${(m.previousStock || 20) + m.quantity},"${m.fromLocation}","${m.toLocation}","${m.performedBy}","Completed"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_movements_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Stock In':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'Stock Out':
      case 'Sales Deduction':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
      case 'Warehouse Transfer':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/40';
      case 'Customer Return':
      case 'Supplier Return':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/40';
      case 'Damaged Stock':
        return 'bg-red-500/20 text-red-500 border border-red-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
    }
  };

  return (
    <div className="space-y-6 text-white animate-fade-in">
      {/* 1. Header & Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6500FF]/30 text-[#00D5FF] border border-[#6500FF]/40">
              Audit Ledger
            </span>
            <span className="text-xs text-[#A7B1C2]">• Real-Time Stock Transactions</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white">Stock Movements &amp; Inbound Log</h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Full transaction history of factory inbound receipts, retail sales deductions, vault transfers, and return quarantines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-[#11123D] p-1 rounded-xl border border-[#29305D] flex items-center">
            <button
              onClick={() => setViewMode('ledger')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'ledger' ? 'bg-[#6500FF] text-white shadow-xs' : 'text-[#A7B1C2] hover:text-white'
              }`}
            >
              Table Ledger
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'timeline' ? 'bg-[#6500FF] text-white shadow-xs' : 'text-[#A7B1C2] hover:text-white'
              }`}
            >
              Movement Timeline
            </button>
          </div>

          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-[#11123D] hover:bg-[#1b1d54] text-[#A7B1C2] hover:text-white border border-[#29305D] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00D5FF]" />
            <span>Export Movement Log</span>
          </button>
        </div>
      </div>

      {/* 2. REQUIRED TOP SUMMARY (Total Stock In, Total Stock Out, Warehouse Transfers, Returns) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Stock In */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Total Stock In</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-400">+{totalStockIn} Units</p>
          <p className="text-[10px] text-emerald-400/80 mt-0.5">Inbound PO Deliveries</p>
        </div>

        {/* Total Stock Out */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Total Stock Out</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-400">-{totalStockOut} Units</p>
          <p className="text-[10px] text-rose-300/80 mt-0.5">Sales &amp; Dispatches</p>
        </div>

        {/* Warehouse Transfers */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Warehouse Transfers</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-[#00D5FF] flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-[#00D5FF]">{totalTransfers} Units</p>
          <p className="text-[10px] text-[#00D5FF]/80 mt-0.5">Inter-Vault Rebalance</p>
        </div>

        {/* Returns */}
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-[#A7B1C2] mb-1.5">
            <span className="text-[11px] font-semibold">Returns Logged</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-black text-purple-400">{totalReturns} Units</p>
          <p className="text-[10px] text-purple-300/80 mt-0.5">Customer &amp; Factory</p>
        </div>
      </div>

      {/* 3. Filters Bar */}
      <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-4 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Movement ID, SKU, product, operator..."
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#A7B1C2] focus:outline-hidden focus:border-[#6500FF]"
            />
          </div>

          {/* Movement Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              {movementTypes.map((t) => (
                <option key={t} value={t}>
                  Movement Type: {t}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse Filter */}
          <div>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full bg-[#17165A] border border-[#29305D] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#6500FF]"
            >
              <option value="All">All Vaults</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.name}>
                  {wh.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main View: Required Table Columns:
          Movement ID, Product Image, Product Name, SKU, Movement Type, Previous Stock, Quantity Changed, Updated Stock, Source Warehouse, Destination Warehouse, Date, Time, Performed By, Status */}
      {viewMode === 'ledger' ? (
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#17165A] border-b border-[#29305D] text-[#A7B1C2] text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Product / SKU</th>
                  <th className="py-3 px-3">Movement Type</th>
                  <th className="py-3 px-3 text-center">Prev → Updated</th>
                  <th className="py-3 px-3 text-center">Qty Changed</th>
                  <th className="py-3 px-3">Source → Destination</th>
                  <th className="py-3 px-3">Date &amp; Time</th>
                  <th className="py-3 px-3">Performed By</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29305D]/50">
                {filteredMovements.map((m) => {
                  const prev = m.previousStock || 20;
                  const updated = prev + m.quantity;
                  return (
                    <tr key={m.id} className="hover:bg-[#17165A]/40 transition-colors">
                      {/* Movement ID */}
                      <td className="py-3 px-3 font-mono font-bold text-[#00D5FF] text-[11px]">{m.id}</td>

                      {/* Product Image, Name, SKU */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={m.productImage || '/images/products/featured_rolex_submariner.jpg'}
                            alt={m.productName}
                            className="w-8 h-8 rounded-lg object-contain bg-black/40 border border-[#29305D] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-xs truncate max-w-[150px]">{m.productName}</p>
                            <p className="text-[10px] font-mono text-[#00D5FF]">{m.sku}</p>
                          </div>
                        </div>
                      </td>

                      {/* Movement Type */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTypeBadge(m.type)}`}>
                          {m.type}
                        </span>
                      </td>

                      {/* Previous Stock → Updated Stock */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="text-[#A7B1C2]">{prev}</span>
                        <span className="text-[#00D5FF] mx-1">→</span>
                        <strong className="text-white">{updated}</strong>
                      </td>

                      {/* Quantity Changed */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-sm">
                        <span className={m.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                        </span>
                      </td>

                      {/* Source Warehouse → Destination Warehouse */}
                      <td className="py-3 px-3">
                        <p className="text-white text-[11px] truncate max-w-[150px]">{m.fromLocation}</p>
                        <p className="text-[#A7B1C2] text-[10px] truncate max-w-[150px]">→ {m.toLocation}</p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{m.date}</p>
                        <p className="text-[10px] text-[#A7B1C2]">{m.time}</p>
                      </td>

                      {/* Performed By */}
                      <td className="py-3 px-3 text-gray-300 font-medium truncate max-w-[120px]">{m.performedBy}</td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {m.status || 'Completed'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedMovement(m)}
                          className="p-1.5 rounded-lg bg-[#17165A] hover:bg-[#6500FF]/30 text-[#00D5FF] border border-[#29305D] transition-all cursor-pointer"
                          title="View Audit Record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 5. MOVEMENT TIMELINE VIEW */
        <div className="bg-[#11123D] border border-[#29305D] rounded-2xl p-6 shadow-xl">
          <div className="relative border-l-2 border-[#29305D] ml-4 space-y-6">
            {filteredMovements.map((m) => (
              <div key={m.id} className="relative pl-6 group">
                {/* Node indicator */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#11123D] border-2 border-[#6500FF] group-hover:border-[#00D5FF] transition-all" />

                <div className="p-4 rounded-xl bg-[#17165A]/40 border border-[#29305D] hover:border-[#6500FF] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#00D5FF]">{m.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTypeBadge(m.type)}`}>
                        {m.type}
                      </span>
                      <span className="font-mono font-bold text-xs">
                        {m.quantity > 0 ? (
                          <span className="text-emerald-400">+{m.quantity} Units</span>
                        ) : (
                          <span className="text-rose-400">{m.quantity} Units</span>
                        )}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A7B1C2]">{m.date} at {m.time}</span>
                  </div>

                  <h4 className="font-bold text-white text-xs">{m.productName} ({m.sku})</h4>
                  <p className="text-[11px] text-gray-300 mt-1">
                    Route: <strong className="text-white">{m.fromLocation}</strong> → <strong className="text-white">{m.toLocation}</strong>
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#A7B1C2] mt-2 pt-2 border-t border-[#29305D]/50">
                    <span>Officer: <strong>{m.performedBy}</strong></span>
                    <span>Ref: <strong className="font-mono text-[#E9B94F]">{m.reference || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: MOVEMENT DETAILS */}
      {selectedMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#11123D] border border-[#29305D] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#29305D]">
              <div>
                <h3 className="text-base font-bold text-white">Movement Audit Record</h3>
                <p className="font-mono text-[10px] text-[#00D5FF]">{selectedMovement.id}</p>
              </div>
              <button onClick={() => setSelectedMovement(null)} className="text-[#A7B1C2] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 p-3 bg-[#17165A]/40 rounded-xl border border-[#29305D]">
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Timepiece:</span>
                <span className="font-bold text-white text-right">{selectedMovement.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">SKU Code:</span>
                <span className="font-mono text-[#00D5FF]">{selectedMovement.sku}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Movement Type:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getTypeBadge(selectedMovement.type)}`}>
                  {selectedMovement.type}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Quantity:</span>
                <span className="font-mono font-bold text-white">{selectedMovement.quantity} Units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Source Warehouse:</span>
                <span className="text-white">{selectedMovement.fromLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Destination:</span>
                <span className="text-white">{selectedMovement.toLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#29305D]/40">
                <span className="text-[#A7B1C2]">Timestamp:</span>
                <span className="text-white">{selectedMovement.date} at {selectedMovement.time}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A7B1C2]">Authorized Operator:</span>
                <span className="text-white font-medium">{selectedMovement.performedBy}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#29305D] flex justify-end">
              <button
                onClick={() => setSelectedMovement(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
