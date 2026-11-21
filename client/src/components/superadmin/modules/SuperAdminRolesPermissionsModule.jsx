import React, { useState, useEffect } from 'react';
import { Key, Shield, Layers, CheckCircle2, XCircle, Search, RefreshCw, Crown, Lock } from 'lucide-react';
import api from '../../../services/api';

export default function SuperAdminRolesPermissionsModule() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(1);

  const fetchRolesData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/super-admin/roles');
      if (res.data.status === 'success') {
        setRoles(res.data.roles);
        setPermissions(res.data.permissions);
      }
    } catch (err) {
      console.error('Failed to load roles and permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <Key className="w-5 h-5 text-[#D6A33A]" />
            <span>Role Permissions & Authority Matrix</span>
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Inspect canonical roles, granular module permissions, and strict isolation scopes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchRolesData}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D6A33A]' : ''}`} />
          <span>Reload Matrix</span>
        </button>
      </div>

      {/* Main Grid: Left Role Selector + Right Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-4 shadow-lg space-y-2">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block px-1 mb-2">
            System Defined Roles ({roles.length})
          </span>

          {roles.map((r) => {
            const isSelected = r.id === selectedRoleId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoleId(r.id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#D6A33A]/15 border-[#D6A33A] text-white shadow-md'
                    : 'bg-[#111A2C] border-white/5 text-gray-300 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Crown className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D6A33A]' : 'text-gray-400'}`} />
                    {r.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-gray-300 font-bold">
                    {r.assignedUsers} users
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{r.description}</p>
              </button>
            );
          })}
        </div>

        {/* Permissions Breakdown for Selected Role */}
        <div className="lg:col-span-2 bg-[#0B1222] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D6A33A]" />
                <span>Permissions Granted to {selectedRole?.name}</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">{selectedRole?.description}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D6A33A]/15 text-[#D6A33A] border border-[#D6A33A]/30">
              {selectedRole?.permissions?.length || 0} Permissions
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
            {permissions.length === 0 ? (
              <div className="py-8 text-center text-gray-400">Loading permissions...</div>
            ) : (
              permissions.map((p) => {
                const isGranted =
                  selectedRole?.name === 'Super Admin' ||
                  selectedRole?.permissions?.some((rp) => rp.code === p.permissionCode);

                return (
                  <div
                    key={p.permissionId}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isGranted
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-[#111A2C] border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        <span>{p.permissionCode}</span>
                        <span className="text-[10px] font-normal text-gray-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/10">
                          {p.moduleName}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{p.description}</div>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isGranted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Authorized</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <Lock className="w-3 h-3" />
                          <span>Restricted</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
