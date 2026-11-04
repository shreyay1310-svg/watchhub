import React, { useState } from 'react';
import { Search, Plus, Filter, ShieldCheck, MoreVertical, Edit, Trash2, Key, CheckCircle, XCircle } from 'lucide-react';

const INITIAL_USERS = [
  { id: 'u1', name: 'Vikramaditya Singhania', email: 'superadmin@watchhub.in', role: 'Super Admin', department: 'Executive Management', status: 'Active', lastLogin: '10 mins ago', avatar: '👑' },
  { id: 'u2', name: 'Rajesh Mehra', email: 'storeadmin@watchhub.in', role: 'Store Admin', department: 'E-Commerce Operations', status: 'Active', lastLogin: '1 hour ago', avatar: '🏪' },
  { id: 'u3', name: 'Suresh Patel', email: 'inventory@watchhub.in', role: 'Inventory Manager', department: 'Warehousing & Stock', status: 'Active', lastLogin: '3 hours ago', avatar: '📦' },
  { id: 'u4', name: 'Amit Sharma', email: 'delivery@watchhub.in', role: 'Delivery Manager', department: 'Logistics & Dispatch', status: 'Active', lastLogin: '25 mins ago', avatar: '🚚' },
  { id: 'u5', name: 'Neha Kapoor', email: 'support@watchhub.in', role: 'Customer Support Executive', department: 'Helpdesk & CRM', status: 'Active', lastLogin: '5 mins ago', avatar: '🎧' },
  { id: 'u6', name: 'Ananya Singh', email: 'ananya@gmail.com', role: 'Customer', department: 'Retail Consumer', status: 'Active', lastLogin: 'Yesterday', avatar: '👤' },
  { id: 'u7', name: 'Rahul Verma', email: 'rahul.v@gmail.com', role: 'Customer', department: 'Retail Consumer', status: 'Active', lastLogin: '03 Nov 2026', avatar: '👤' },
  { id: 'u8', name: 'Priya Yadav', email: 'priya.y@gmail.com', role: 'Customer', department: 'Retail Consumer', status: 'Inactive', lastLogin: '28 Oct 2026', avatar: '👤' },
];

export const UsersManagementModule = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Store Admin', department: 'E-Commerce Operations' });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const created = {
      id: `u_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: 'Active',
      lastLogin: 'Never',
      avatar: newUser.role === 'Store Admin' ? '🏪' : newUser.role === 'Inventory Manager' ? '📦' : newUser.role === 'Delivery Manager' ? '🚚' : '🎧',
    };
    setUsers([created, ...users]);
    setModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Store Admin', department: 'E-Commerce Operations' });
  };

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div className="space-y-5">
      {/* Module Title & Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>👥</span> Users & Role-Based Permissions
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage staff accounts, assign granular permissions and oversee customer accounts.
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-gold text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 outline-none focus:border-watch-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 font-semibold">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold bg-white text-gray-800"
          >
            <option value="All">All Roles ({users.length})</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Store Admin">Store Admin</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Delivery Manager">Delivery Manager</option>
            <option value="Customer Support Executive">Support Executive</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10.5px]">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role & Permissions</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm border border-gray-200">
                        {u.avatar}
                      </span>
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-[11px] text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[10.5px] border border-amber-200">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-medium">{u.department}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit cursor-pointer ${
                        u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {u.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {u.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-[11px]">{u.lastLogin}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => alert(`Edit permissions for ${u.name}`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-watch-gold" title="Edit Permissions">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => alert(`Reset password sent for ${u.email}`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600" title="Reset Password">
                        <Key className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-1">Add New Staff Member</h3>
            <p className="text-xs text-gray-500 mb-4">Assign role and create credentials for internal staff.</p>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Meera Sen"
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="name@watchhub.in"
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full h-9 px-3 border border-gray-300 rounded-lg outline-none focus:border-watch-gold bg-white"
                >
                  <option value="Store Admin">Store Admin</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Delivery Manager">Delivery Manager</option>
                  <option value="Customer Support Executive">Customer Support Executive</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs py-2 px-4">
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementModule;

