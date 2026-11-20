import React from 'react';
import {
  CreditCard,
  Building,
  Clock,
  Calendar,
  User,
  Plus,
  Pause,
  FileText,
  TrendingUp,
} from 'lucide-react';

export default function POSTerminalHeader({
  currentDateTime,
  handleNewSale,
  setHeldSalesModalOpen,
  heldSales = [],
  setHistoryModalOpen,
  setZReportModalOpen,
}) {
  return (
    <header className="bg-[#11123D] border-b border-[#23275E] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl select-none">
      {/* Left: Terminal Identity & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-white shadow-[0_0_20px_rgba(101,0,255,0.4)]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-tight">
                WatchHub POS Terminal
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE • TERM #04
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Building className="w-3 h-3 text-[#E9B94F]" />
              <span>Flagship Boutique • Mumbai High Street</span>
            </p>
          </div>
        </div>
      </div>

      {/* Center: Live Clock & Shift */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-xl bg-[#080923] border border-[#23275E] text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-[#00D5FF]" />
          <span>
            {currentDateTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>
        <div className="h-4 w-[1px] bg-[#23275E]" />
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-[#E9B94F]" />
          <span>
            {currentDateTime.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="h-4 w-[1px] bg-[#23275E]" />
        <div className="flex items-center gap-1.5 text-slate-300">
          <User className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-white font-bold">Vikramaditya S.</span>
          <span className="text-[10px] text-slate-500">(Shift #01)</span>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={handleNewSale}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6500FF] to-[#8B00FF] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          title="Clear and start new bill"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Sale</span>
        </button>

        <button
          type="button"
          onClick={() => setHeldSalesModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-[#080923] hover:bg-[#16184C] border border-[#23275E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all relative"
          title="View Parked / Held Sales"
        >
          <Pause className="w-3.5 h-3.5 text-[#E9B94F]" />
          <span className="hidden sm:inline">Held Sales</span>
          {heldSales.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#E9B94F] text-black text-[10px] font-bold font-mono">
              {heldSales.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setHistoryModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-[#080923] hover:bg-[#16184C] border border-[#23275E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          title="Transaction History & Invoices"
        >
          <FileText className="w-3.5 h-3.5 text-[#00D5FF]" />
          <span className="hidden sm:inline">History</span>
        </button>

        <button
          type="button"
          onClick={() => setZReportModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-[#080923] hover:bg-[#16184C] border border-[#23275E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          title="EOD Daily Summary Report"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Z-Report</span>
        </button>
      </div>
    </header>
  );
}
