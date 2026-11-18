import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  PlusCircle,
  Search,
  Star,
  CheckCircle2,
  Clock,
  Edit,
  Trash2,
  X,
  Lock,
} from 'lucide-react';

export const TeamPermissionsModule = ({
  agents = [],
  setAgents,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentForm, setAgentForm] = useState({
    name: '',
    email: '',
    role: 'Support Executive',
    status: 'online',
    permissions: ['tickets.manage', 'orders.lookup', 'livechat.respond'],
  });

  const availablePermissions = [
    { id: 'tickets.manage', label: 'Ticket Triage & Management' },
    { id: 'orders.lookup', label: 'Customer Order & AWB Lookup' },
    { id: 'livechat.respond', label: 'Live Chat Direct Messaging' },
    { id: 'refunds.authorize', label: 'Refund Authorization (Razorpay)' },
    { id: 'escalations.lead', label: 'Critical L3 Escalation Lead' },
    { id: 'knowledge.publish', label: 'Knowledge Base Publishing' },
  ];

  const filteredAgents = agents.filter((ag) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      ag.name?.toLowerCase().includes(q) ||
      ag.email?.toLowerCase().includes(q) ||
      ag.role?.toLowerCase().includes(q)
    );
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedAgent) {
      // Edit
      const updated = agents.map((a) =>
        a.id === selectedAgent.id ? { ...a, ...agentForm } : a
      );
      setAgents(updated);
    } else {
      // Create
      const newAg = {
        id: `agent_${Date.now()}`,
        ...agentForm,
        avatar: '🎧',
        resolvedTickets: 0,
        csat: '5.0',
        rating: 5.0,
      };
      setAgents([newAg, ...agents]);
    }
    setModalOpen(false);
    setSelectedAgent(null);
  };

  const handleTogglePermission = (permId) => {
    if (agentForm.permissions.includes(permId)) {
      setAgentForm({
        ...agentForm,
        permissions: agentForm.permissions.filter((p) => p !== permId),
      });
    } else {
      setAgentForm({
        ...agentForm,
        permissions: [...agentForm.permissions, permId],
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Team & Role-Based Permissions
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00D9E8]/15 text-[#00D9E8] border border-[#00D9E8]/30 font-semibold">
              {agents.length} Executives
            </span>
          </h2>
          <p className="text-xs text-[#A7B1C2] mt-0.5">
            Configure agent RBAC permissions, allocate concierge shift coverage & review SLAs
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAgent(null);
            setAgentForm({
              name: '',
              email: '',
              role: 'Support Executive',
              status: 'online',
              permissions: ['tickets.manage', 'orders.lookup', 'livechat.respond'],
            });
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918] font-bold text-xs hover:shadow-[0_0_20px_rgba(0,217,232,0.4)] transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Support Agent</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Total Staff Members</span>
          <p className="text-2xl font-bold text-white mt-1">{agents.length}</p>
          <p className="text-xs text-[#64748B] mt-1.5">Across L1, L2 and L3 tiers</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Active Right Now</span>
          <p className="text-2xl font-bold text-[#10B981] mt-1">
            {agents.filter((a) => a.status === 'online').length} Online
          </p>
          <p className="text-xs text-[#10B981] mt-1.5 font-semibold">24/7 Concierge coverage</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Team Resolution Output</span>
          <p className="text-2xl font-bold text-[#00D9E8] mt-1">1,096 Cases</p>
          <p className="text-xs text-[#64748B] mt-1.5">This calendar month</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111729] border border-[#252D42] shadow-lg">
          <span className="text-xs text-[#A7B1C2] font-medium">Team Average CSAT</span>
          <p className="text-2xl font-bold text-[#E7B43F] mt-1">4.88 / 5</p>
          <p className="text-xs text-[#E7B43F] mt-1.5 font-semibold">Exceeds luxury benchmark</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A7B1C2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team members by name, email, or role..."
          className="w-full bg-[#111729] text-white text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
        />
      </div>

      {/* Team Roster Table */}
      <div className="rounded-2xl bg-[#111729] border border-[#252D42] overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#091426] border-b border-[#252D42] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Agent Name</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Role Designation</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Resolved</th>
                <th className="py-3.5 px-4 font-semibold">CSAT</th>
                <th className="py-3.5 px-4 font-semibold">Key Permissions</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252D42]/60">
              {filteredAgents.map((ag) => (
                <tr key={ag.id} className="hover:bg-[#070918]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00D9E8]/20 to-[#E7B43F]/20 border border-[#00D9E8]/40 flex items-center justify-center text-sm">
                      {ag.avatar || '🎧'}
                    </span>
                    <span>{ag.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#A7B1C2]">{ag.email}</td>
                  <td className="py-3.5 px-4 text-white font-medium">{ag.role}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        ag.status === 'online'
                          ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                          : ag.status === 'busy'
                          ? 'bg-[#E7B43F]/15 text-[#E7B43F] border-[#E7B43F]/30'
                          : 'bg-white/10 text-[#64748B] border-[#252D42]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          ag.status === 'online'
                            ? 'bg-[#10B981]'
                            : ag.status === 'busy'
                            ? 'bg-[#E7B43F]'
                            : 'bg-[#64748B]'
                        }`}
                      />
                      <span className="capitalize">{ag.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#10B981]">
                    {ag.resolvedTickets || 142}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#E7B43F] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{ag.csat || '4.9'}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#A7B1C2]">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(ag.permissions || ['tickets.manage', 'orders.lookup']).map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.2 rounded bg-[#070918] border border-[#252D42] text-[9px] text-[#00D9E8]"
                        >
                          {p.split('.')[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedAgent(ag);
                        setAgentForm({
                          name: ag.name,
                          email: ag.email,
                          role: ag.role,
                          status: ag.status,
                          permissions: ag.permissions || ['tickets.manage', 'orders.lookup'],
                        });
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-[#00D9E8]/10 hover:bg-[#00D9E8] text-[#00D9E8] hover:text-[#070918] font-bold text-[11px] border border-[#00D9E8]/30 transition-colors"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Agent Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091426] border border-[#252D42] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#252D42]">
              <h3 className="text-base font-bold text-white">
                {selectedAgent ? 'Edit Agent & RBAC Privileges' : 'Add New Support Agent'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  placeholder="support@watchhub.com"
                  className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Role</label>
                  <select
                    value={agentForm.role}
                    onChange={(e) => setAgentForm({ ...agentForm, role: e.target.value })}
                    className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  >
                    <option value="Customer Support Executive">Support Executive</option>
                    <option value="Customer Support Manager">Support Manager</option>
                    <option value="VIP Concierge Lead">VIP Concierge Lead</option>
                    <option value="Warranty & Service Specialist">Warranty Specialist</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#A7B1C2] block mb-1">Status</label>
                  <select
                    value={agentForm.status}
                    onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
                    className="w-full bg-[#111729] text-white text-xs px-3 py-2 rounded-xl border border-[#252D42] focus:outline-none focus:border-[#00D9E8]"
                  >
                    <option value="online">Online (Taking Chats)</option>
                    <option value="busy">Busy (In Resolution)</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A7B1C2] block mb-2">
                  Role-Based Permissions (RBAC)
                </label>
                <div className="space-y-2 p-3 bg-[#111729] border border-[#252D42] rounded-xl">
                  {availablePermissions.map((perm) => {
                    const isChecked = agentForm.permissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2.5 text-xs text-white cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.id)}
                          className="rounded border-[#252D42] text-[#00D9E8] focus:ring-0 cursor-pointer"
                        />
                        <span className={isChecked ? 'text-white font-medium' : 'text-[#A7B1C2]'}>
                          {perm.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#A7B1C2] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#00D9E8] to-[#00B4D8] text-[#070918]"
                >
                  Save Agent Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPermissionsModule;
