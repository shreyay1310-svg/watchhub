import React, { useState } from 'react';
import { X, UserPlus, Shield, Check, AlertCircle, Building, Key, Mail, Phone, Lock } from 'lucide-react';
import api from '../../services/api';

/**
 * 1. Add Staff Member Modal
 */
export function AddStaffModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: 'E-Commerce Operations',
    roleId: '2',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/super-admin/staff', formData);
      if (res.data.status === 'success') {
        onSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-xs">
      <div className="w-full max-w-lg bg-[#0B1222] border border-[#D6A33A]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-[#080E1C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D6A33A]/20 border border-[#D6A33A]/40 flex items-center justify-center text-[#D6A33A]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Add New Staff Member</h3>
              <p className="text-[11px] text-gray-400">Onboard operational personnel to WatchHub Atelier</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Rajesh Mehra"
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rajesh@watchhub.in"
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Employee ID</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="EMP-1049"
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Assigned Role *</label>
              <select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              >
                <option value="2">Store Admin</option>
                <option value="3">Inventory Manager</option>
                <option value="4">Delivery Manager</option>
                <option value="5">Customer Support Executive</option>
                <option value="7">Delivery Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-9 px-3 rounded-xl bg-[#111A2C] border border-white/10 text-white outline-none focus:border-[#D6A33A]"
              >
                <option value="E-Commerce Operations">E-Commerce Operations</option>
                <option value="Warehousing & Stock">Warehousing & Stock</option>
                <option value="Logistics & Dispatch">Logistics & Dispatch</option>
                <option value="Helpdesk & CRM">Helpdesk & CRM</option>
                <option value="Executive Management">Executive Management</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-300 mb-1">Account Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'Active'}
                  onChange={() => setFormData({ ...formData, status: 'Active' })}
                  className="accent-[#D6A33A]"
                />
                <span>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'Inactive'}
                  onChange={() => setFormData({ ...formData, status: 'Inactive' })}
                  className="accent-[#D6A33A]"
                />
                <span>Inactive</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#D6A33A] hover:bg-[#F6C453] text-black font-bold shadow-lg shadow-[#D6A33A]/20 transition-all flex items-center gap-1.5"
            >
              {loading ? 'Creating...' : 'Create Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * 2. View User Details Modal
 */
export function ViewUserModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-xs">
      <div className="w-full max-w-md bg-[#0B1222] border border-[#D6A33A]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-[#080E1C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D6A33A]" />
            <h3 className="font-bold text-white text-sm">User Profile Information</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 border border-indigo-500/40 flex items-center justify-center text-white font-bold text-base">
              {user.initials || 'WH'}
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{user.name}</h4>
              <p className="text-[11px] text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#111A2C] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">Role</span>
              <span className="font-bold text-[#F6C453]">{user.role}</span>
            </div>

            <div className="bg-[#111A2C] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">Department</span>
              <span className="font-bold text-white">{user.department}</span>
            </div>

            <div className="bg-[#111A2C] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">Status</span>
              <span className={user.status === 'Active' ? 'text-emerald-400 font-bold' : 'text-gray-400 font-bold'}>
                {user.status}
              </span>
            </div>

            <div className="bg-[#111A2C] p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">Phone</span>
              <span className="text-gray-300">{user.phone || 'Not recorded'}</span>
            </div>
          </div>

          <div className="bg-[#111A2C] p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">Last Active</span>
            <span className="text-gray-300">{user.lastLogin || 'Recent'}</span>
          </div>
        </div>

        <div className="p-3 bg-[#080E1C] border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. Permissions Matrix Modal
 */
export function PermissionsModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const permissionsList = [
    { code: 'VIEW_DASHBOARD', name: 'View Operational Dashboard', granted: true },
    { code: 'MANAGE_INVENTORY', name: 'Manage Watch Inventory & Stock', granted: ['Super Admin', 'Store Admin', 'Inventory Manager'].includes(user.role) },
    { code: 'PROCESS_ORDERS', name: 'Order Processing & Status Updates', granted: ['Super Admin', 'Store Admin', 'Delivery Manager'].includes(user.role) },
    { code: 'SUPPORT_TICKETS', name: 'Resolve Customer Support Inquiries', granted: ['Super Admin', 'Customer Support Executive'].includes(user.role) },
    { code: 'AUDIT_LOGS_VIEW', name: 'Inspect Security & Audit Logs', granted: user.role === 'Super Admin' },
    { code: 'MANAGE_USERS', name: 'Create, Modify & Manage Staff Accounts', granted: user.role === 'Super Admin' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-xs">
      <div className="w-full max-w-lg bg-[#0B1222] border border-[#D6A33A]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-[#080E1C] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#D6A33A]" />
            <div>
              <h3 className="font-bold text-white text-sm">Role Permissions Matrix</h3>
              <p className="text-[11px] text-gray-400">{user.name} &bull; {user.role}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
          {permissionsList.map((p) => (
            <div
              key={p.code}
              className="p-3 rounded-xl bg-[#111A2C] border border-white/5 flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-white block">{p.name}</span>
                <span className="text-[10px] text-gray-400 font-mono">{p.code}</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  p.granted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {p.granted ? 'Permitted' : 'Restricted'}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#080E1C] border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#D6A33A] text-black font-bold hover:bg-[#F6C453]"
          >
            Acknowledge Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
