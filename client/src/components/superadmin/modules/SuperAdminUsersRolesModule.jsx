import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Layers,
  Building,
  Search,
  RotateCcw,
  Plus,
  Eye,
  Edit2,
  Key,
  Trash2,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Crown,
  Home,
  Check,
} from 'lucide-react';
import api from '../../../services/api';
import { AddStaffModal, ViewUserModal, PermissionsModal } from '../SuperAdminModals';

export default function SuperAdminUsersRolesModule() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState({
    totalUsers: 24,
    activeUsers: 21,
    totalRoles: 7,
    totalDepartments: 5,
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected row checkboxes
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [permissionsUser, setPermissionsUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/super-admin/users', {
        params: {
          search: searchTerm,
          role: selectedRole,
          department: selectedDepartment,
          status: selectedStatus,
          page,
          limit: rowsPerPage,
        },
      });

      if (res.data.status === 'success') {
        setUsers(res.data.users);
        setTotalCount(res.data.count);
        setTotalPages(res.data.totalPages || 1);
        setOverview({
          totalUsers: res.data.totalUsers,
          activeUsers: res.data.activeUsers,
          totalRoles: res.data.totalRoles,
          totalDepartments: res.data.totalDepartments,
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, selectedRole, selectedDepartment, selectedStatus, page, rowsPerPage]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRole('All');
    setSelectedDepartment('All');
    setSelectedStatus('All');
    setPage(1);
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status !== 'Active';
    try {
      await api.put(`/api/super-admin/users/${user.id}/status`, { isActive: newStatus });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      {/* 1. Breadcrumb Bar */}
      <div className="flex items-center gap-2 text-gray-400 text-xs">
        <Home className="w-3.5 h-3.5 text-gray-500" />
        <span>/</span>
        <span>System Administration</span>
        <span>/</span>
        <span className="text-[#D6A33A] font-semibold">Users & Roles</span>
      </div>

      {/* 2. Page Header & Add Staff Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D6A33A]/20 to-[#8C601E]/40 border border-[#D6A33A]/50 flex items-center justify-center text-[#D6A33A] shadow-md">
            <Users className="w-5 h-5 text-[#F6C453]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
              Users & Role-Based Permissions
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">
              Manage staff accounts, assign granular permissions and oversee customer accounts.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddStaffOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A33A] to-[#F6C453] text-black font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#D6A33A]/20 hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* 3. Four KPI Metric Cards (Matching screenshot styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <div className="relative rounded-2xl bg-[#131530] border border-purple-500/25 p-4 overflow-hidden shadow-lg shadow-purple-950/20 group hover:border-purple-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
            <Users className="w-16 h-16 text-purple-500/5 absolute -right-2 -bottom-2 pointer-events-none" />
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400 block">Total Users</span>
            <div className="text-2xl font-bold font-serif text-white mt-0.5">{overview.totalUsers}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>&uarr; +8.3% vs last month</span>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="relative rounded-2xl bg-[#0D1D3A] border border-blue-500/25 p-4 overflow-hidden shadow-lg shadow-blue-950/20 group hover:border-blue-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <Shield className="w-16 h-16 text-blue-500/5 absolute -right-2 -bottom-2 pointer-events-none" />
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400 block">Active Users</span>
            <div className="text-2xl font-bold font-serif text-white mt-0.5">{overview.activeUsers}</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>{Math.round((overview.activeUsers / (overview.totalUsers || 1)) * 100)}% of total users</span>
            </div>
          </div>
        </div>

        {/* Roles Card */}
        <div className="relative rounded-2xl bg-[#221B14] border border-amber-500/25 p-4 overflow-hidden shadow-lg shadow-amber-950/20 group hover:border-amber-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <Layers className="w-16 h-16 text-amber-500/5 absolute -right-2 -bottom-2 pointer-events-none" />
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400 block">Roles</span>
            <div className="text-2xl font-bold font-serif text-white mt-0.5">{overview.totalRoles}</div>
            <div className="text-[10px] text-gray-400 mt-1 truncate">Admin, Store, Support, Vendor...</div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="relative rounded-2xl bg-[#0C221F] border border-emerald-500/25 p-4 overflow-hidden shadow-lg shadow-emerald-950/20 group hover:border-emerald-500/40 transition-all">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Building className="w-4 h-4" />
            </div>
            <Building className="w-16 h-16 text-emerald-500/5 absolute -right-2 -bottom-2 pointer-events-none" />
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-medium text-gray-400 block">Departments</span>
            <div className="text-2xl font-bold font-serif text-white mt-0.5">{overview.totalDepartments}</div>
            <div className="text-[10px] text-gray-400 mt-1 truncate">Operations, Support, Sales...</div>
          </div>
        </div>
      </div>

      {/* 4. Filter and Search Controls Bar */}
      <div className="bg-[#0B1222] border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or employee ID..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#111A2C] border border-white/10 hover:border-white/20 focus:border-[#D6A33A] text-white outline-none placeholder:text-gray-500"
          />
        </div>

        {/* Select Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Dropdown */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[#111A2C] border border-white/10 hover:border-white/20 text-white outline-none focus:border-[#D6A33A] cursor-pointer"
            >
              <option value="All">Role: All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Store Admin">Store Admin</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Delivery Manager">Delivery Manager</option>
              <option value="Customer Support Executive">Support Executive</option>
              <option value="Delivery Partner">Delivery Partner</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[#111A2C] border border-white/10 hover:border-white/20 text-white outline-none focus:border-[#D6A33A] cursor-pointer"
            >
              <option value="All">Department: All Departments</option>
              <option value="Executive Management">Executive Management</option>
              <option value="E-Commerce Operations">E-Commerce Operations</option>
              <option value="Warehousing & Stock">Warehousing & Stock</option>
              <option value="Logistics & Dispatch">Logistics & Dispatch</option>
              <option value="Helpdesk & CRM">Helpdesk & CRM</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[#111A2C] border border-white/10 hover:border-white/20 text-white outline-none focus:border-[#D6A33A] cursor-pointer"
            >
              <option value="All">Status: All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-1.5 font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 5. Users Data Table */}
      <div className="bg-[#0B1222] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#080E1C] text-gray-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-[#D6A33A] rounded"
                  />
                </th>
                <th className="py-3.5 px-4">USER</th>
                <th className="py-3.5 px-4">ROLE & PERMISSIONS</th>
                <th className="py-3.5 px-4">DEPARTMENT</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">LAST LOGIN</th>
                <th className="py-3.5 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    <div className="w-6 h-6 border-2 border-[#D6A33A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading users & permissions...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No users matching the selected filters found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelected = selectedIds.includes(u.id);
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-white/5 transition-colors ${isSelected ? 'bg-white/5' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(u.id)}
                          className="accent-[#D6A33A] rounded cursor-pointer"
                        />
                      </td>

                      {/* User Avatar + Name + Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-900/60 to-purple-900/50 border border-indigo-500/30 flex items-center justify-center text-white font-bold text-xs">
                            {u.initials}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{u.name}</div>
                            <div className="text-[11px] text-gray-400">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Permissions Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#D6A33A]/10 text-[#F6C453] border border-[#D6A33A]/30">
                          <Crown className="w-3.5 h-3.5 text-[#D6A33A]" />
                          <span>{u.role}</span>
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          <span>{u.department}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{u.status}</span>
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{u.lastLogin}</span>
                        </div>
                      </td>

                      {/* Actions: View, Edit, Permissions, Deactivate */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* View Button (Blue) */}
                          <button
                            type="button"
                            onClick={() => setViewUser(u)}
                            className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button (Yellow/Gold) */}
                          <button
                            type="button"
                            onClick={() => setViewUser(u)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Permissions Button (Purple) */}
                          <button
                            type="button"
                            onClick={() => setPermissionsUser(u)}
                            className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors"
                            title="Manage Permissions"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Status / Lock Button (Red) */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title={u.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Table Footer with Pagination Controls */}
        <div className="px-4 py-3 bg-[#080E1C] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            Showing <span className="font-bold text-white">{users.length}</span> of{' '}
            <span className="font-bold text-white">{totalCount}</span> users
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#111A2C] border border-white/10 rounded-lg px-2 py-1 text-white outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="w-7 h-7 rounded-lg bg-[#D6A33A] text-black font-extrabold flex items-center justify-center">
                {page}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddStaffModal
        isOpen={addStaffOpen}
        onClose={() => setAddStaffOpen(false)}
        onSuccess={() => fetchUsers()}
      />
      <ViewUserModal
        user={viewUser}
        isOpen={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
      />
      <PermissionsModal
        user={permissionsUser}
        isOpen={Boolean(permissionsUser)}
        onClose={() => setPermissionsUser(null)}
      />
    </div>
  );
}
