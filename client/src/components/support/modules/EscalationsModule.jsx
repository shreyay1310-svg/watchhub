import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  X,
  ExternalLink,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const EscalationsModule = ({
  escalations = [],
  setEscalations,
  agents = [],
  onOpenTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredEscalations = escalations.filter((esc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      esc.id?.toLowerCase().includes(q) ||
      esc.ticketId?.toLowerCase().includes(q) ||
      esc.customerName?.toLowerCase().includes(q) ||
      esc.issue?.toLowerCase().includes(q) ||
      esc.assignedTo?.toLowerCase().includes(q);

    const matchesLevel =
      levelFilter === 'All' || esc.level?.toLowerCase() === levelFilter.toLowerCase();

    return matchesSearch && matchesLevel;
  });

  const handleResolveEscalation = (e) => {
    e.preventDefault();
    if (!selectedEscalation) return;

    const updated = escalations.map((esc) =>
      esc.id === selectedEscalation.id
        ? {
            ...esc,
            status: 'Resolved',
            resolutionNote: resolutionNote,
            resolvedAt: 'Just now',
          }
        : esc
    );
    setEscalations(updated);
    setSelectedEscalation({
      ...selectedEscalation,
      status: 'Resolved',
      resolutionNote: resolutionNote,
    });
    setResolutionModalOpen(false);
    setResolutionNote('');
  };

  const getLevelBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'level 3':
      case 'l3':
      case 'critical':
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
      case 'level 2':
      case 'l2':
      case 'high':
        return 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30';
      case 'level 1':
      case 'l1':
      default:
        return 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30';
      case 'in progress':
      case 'under review':
        return 'bg-[#00D9E8]/15 text-[#00D9E8] border-[#00D9E8]/30';
      case 'escalated':
      case 'open':
      default:
        return 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Critical Escalations & SLA Center
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 font-semibold">
              {filteredEscalations.filter((e) => e.status !== 'Resolved').length} Active Cases
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Monitor high-risk customer complaints, VIP disputes, transit delays, and SLA countdowns
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Critical L3 Incidents</span>
            <span className="p-1.5 rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#EF4444] mt-1">4 Cases</p>
          <p className="text-xs text-[#A7B1C2] mt-1.5">Executive intervention required</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Approaching SLA Breach</span>
            <span className="p-1.5 rounded-lg bg-[#E7B43F]/10 text-[#E7B43F]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#E7B43F] mt-1">6 Tickets</p>
          <p className="text-xs text-[#E7B43F] mt-1.5 font-semibold">&lt; 90 mins SLA target remaining</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Resolved This Week</span>
            <span className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#10B981] mt-1">28 Cases</p>
          <p className="text-xs text-[#64748B] mt-1.5">100% collector satisfaction</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#A7B1C2] mb-1 font-medium">
            <span>Average Resolution SLA</span>
            <span className="p-1.5 rounded-lg bg-[#00D9E8]/10 text-[#00D9E8]">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">3h 15m</p>
          <p className="text-xs text-[#10B981] mt-1.5 font-semibold">Well within 6-hour policy</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search escalations by ID, ticket #, customer, issue or manager..."
            className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
          />
        </div>

        <div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full bg-[#111729] text-white text-xs px-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
          >
            <option value="All">All Severity Levels</option>
            <option value="Level 3">Level 3 (Executive / Critical)</option>
            <option value="Level 2">Level 2 (Management)</option>
            <option value="Level 1">Level 1 (Supervisor)</option>
          </select>
        </div>
      </div>

      {/* Escalations Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#091426] border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Escalation ID</th>
                <th className="py-3.5 px-4 font-semibold">Ticket ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Severity Level</th>
                <th className="py-3.5 px-4 font-semibold">Reason / Issue</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Manager</th>
                <th className="py-3.5 px-4 font-semibold">SLA Deadline</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {filteredEscalations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-[#64748B]">
                    No escalations found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredEscalations.map((esc) => (
                  <tr
                    key={esc.id}
                    onClick={() => setSelectedEscalation(esc)}
                    className="hover:bg-[#070918]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#EF4444]">
                      {esc.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#00D9E8] font-semibold">
                      {esc.ticketId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white group-hover:text-[#00D9E8] transition-colors">
                        {esc.customerName}
                      </p>
                      <p className="text-[10px] text-[#64748B]">{esc.watchModel}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getLevelBadge(
                          esc.level
                        )}`}
                      >
                        {esc.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A7B1C2] max-w-[220px] truncate">
                      {esc.issue}
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">
                      {esc.assignedTo}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[#EF4444] font-bold flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {esc.slaDue || '1h 45m left'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          esc.status
                        )}`}
                      >
                        {esc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {esc.status !== 'Resolved' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEscalation(esc);
                            setResolutionModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#070918] font-bold text-[10px] transition-colors"
                        >
                          Resolve SLA
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#10B981] font-semibold">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escalation Detail Modal */}
      {selectedEscalation && !resolutionModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
                <h3 className="text-base font-bold text-white">
                  Escalation Dossier {selectedEscalation.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEscalation(null)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#111729] border border-[#252D42] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Customer:</span>
                <span className="text-white font-semibold">{selectedEscalation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Associated Ticket:</span>
                <span className="font-mono text-[#00D9E8] font-semibold">{selectedEscalation.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Timepiece Model:</span>
                <span className="text-white font-medium">{selectedEscalation.watchModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A7B1C2]">Assigned Concierge Director:</span>
                <span className="text-[#E7B43F] font-bold">{selectedEscalation.assignedTo}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs">
              <p className="font-bold text-[#EF4444] mb-1">Incident Description & Root Cause:</p>
              <p className="text-white/90 leading-relaxed">{selectedEscalation.issue}</p>
            </div>

            {selectedEscalation.resolutionNote && (
              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs">
                <p className="font-bold text-[#10B981] mb-1">Resolution Summary:</p>
                <p className="text-white/90 leading-relaxed">{selectedEscalation.resolutionNote}</p>
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setSelectedEscalation(null)}
                className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
              >
                Close
              </button>

              {selectedEscalation.status !== 'Resolved' && (
                <button
                  onClick={() => setResolutionModalOpen(true)}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#10B981] text-[#070918] hover:bg-[#059669] transition-colors"
                >
                  Mark Escalation Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolution Submission Modal */}
      {resolutionModalOpen && selectedEscalation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <h3 className="text-base font-bold text-white">Record Escalation Resolution</h3>
              <button onClick={() => setResolutionModalOpen(false)} className="text-[#64748B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveEscalation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Resolution Summary & Outcome *
                </label>
                <textarea
                  rows="3"
                  required
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Detail the concession given, courier priority arranged, or replacement expedited..."
                  className="w-full bg-[#111729] text-white text-xs p-3 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResolutionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#10B981] text-[#070918] hover:bg-[#059669] transition-colors"
                >
                  Submit & Close Escalation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscalationsModule;
