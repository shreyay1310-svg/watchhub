import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboardPath } from '../../routes/ProtectedRoute';

export const AccessDeniedScreen = ({ allowedRoles = [], currentRole = '' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const userRole = currentRole || user?.role || 'Customer';
  const authorizedPath = getRoleDashboardPath(userRole);

  const handleGoToAuthorizedDashboard = () => {
    navigate(authorizedPath, { replace: true });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#070913] text-[#F3EFE6] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background radial luxury glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C4913B]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-[#0D1224]/90 border border-[#C4913B]/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 text-center animate-fade-in">
        {/* Luxury Shield Alert Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert className="w-8 h-8 text-rose-400" strokeWidth={1.8} />
        </div>

        {/* Heading */}
        <span className="text-[11px] font-semibold tracking-widest text-[#C4913B] uppercase mb-1 block">
          Access Restricted
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Unauthorized Portal
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
          Your current session is authenticated as{' '}
          <span className="text-[#E5B869] font-semibold">{userRole}</span>. This portal requires privileged access and cannot be viewed with your current role.
        </p>

        {/* Role Gating Metadata Box */}
        {allowedRoles.length > 0 && (
          <div className="bg-[#080B18] border border-white/10 rounded-xl p-3.5 mb-6 text-left text-xs">
            <div className="flex justify-between items-center mb-1.5 pb-1.5 border-b border-white/5">
              <span className="text-gray-400">Authenticated Role:</span>
              <span className="font-semibold text-rose-300">{userRole}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Required Role:</span>
              <span className="font-medium text-[#C4913B]">{allowedRoles.join(' or ')}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoToAuthorizedDashboard}
            className="w-full h-11 bg-gradient-to-r from-[#C4913B] to-[#9D6E26] hover:from-[#B88432] hover:to-[#8C5F1D] text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            <span>Return to {userRole} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-10 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign In with Another Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedScreen;
