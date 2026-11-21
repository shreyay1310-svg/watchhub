import React, { useState, useEffect } from 'react';
import { Building, Users, Shield, Plus, RefreshCw, UserCheck } from 'lucide-react';
import api from '../../../services/api';

export default function SuperAdminDepartmentsModule() {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/super-admin/departments');
      if (res.data.status === 'success') {
        setDepartments(res.data.departments);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in text-xs select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold font-serif text-white tracking-wide flex items-center gap-2">
            <Building className="w-5 h-5 text-[#D6A33A]" />
            <span>Corporate Departments & Staff Allocation</span>
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Operational business units, departmental leads, and personnel distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDepartments}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D6A33A]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-[#0B1222] border border-white/10 hover:border-[#D6A33A]/40 rounded-2xl p-5 shadow-lg space-y-4 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D6A33A]/10 border border-[#D6A33A]/20 flex items-center justify-center text-[#D6A33A]">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{dept.name}</h3>
                  <span className="text-[10px] text-[#D6A33A] font-mono">{dept.code}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {dept.status}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-gray-400">
                <span>Department Head:</span>
                <span className="font-bold text-white">{dept.head}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Target Role:</span>
                <span className="text-[#F6C453] font-semibold">{dept.roleTarget}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Staff Allocation:</span>
                <span className="font-bold text-white px-2 py-0.5 rounded bg-white/5">
                  {dept.staffCount} Personnel
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
