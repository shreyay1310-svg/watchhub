import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  UserCheck,
  MapPin,
  Users,
  Compass,
  AlertTriangle,
  RotateCcw,
  FileBarChart2,
  Layers,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DELIVERY_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/delivery-manager/dashboard' },
  { id: 'orders', label: 'Delivery Orders', icon: Truck, badge: '28', path: '/delivery-manager/orders' },
  { id: 'assign', label: 'Assign Deliveries', icon: UserCheck, badge: '2', path: '/delivery-manager/assign' },
  { id: 'tracking', label: 'Shipment Tracking', icon: MapPin, path: '/delivery-manager/tracking' },
  { id: 'partners', label: 'Delivery Partners', icon: Users, badge: '6', path: '/delivery-manager/partners' },
  { id: 'routes', label: 'Route Planning', icon: Compass, path: '/delivery-manager/routes' },
  { id: 'attempts', label: 'Delivery Attempts', icon: AlertTriangle, badge: '3', badgeColor: '#FF4966', path: '/delivery-manager/attempts' },
  { id: 'returns', label: 'Returns & Pickups', icon: RotateCcw, badge: '3', badgeColor: '#FFB020', path: '/delivery-manager/returns' },
  { id: 'reports', label: 'Delivery Reports', icon: FileBarChart2, path: '/delivery-manager/reports' },
  { id: 'areas', label: 'Service Areas', icon: Layers, badge: '5', path: '/delivery-manager/areas' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/delivery-manager/settings' },
];

export const DeliveryManagerSidebar = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } bg-[#081529] text-white flex-shrink-0 flex flex-col justify-between transition-all duration-300 border-r border-[#28334B] select-none z-30`}
    >
      {/* Top Header / Branding */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#28334B]">
          <Link
            to="/delivery-manager/dashboard"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6500FF] via-[#8B00FF] to-[#E9B94F] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6500FF]/30 flex-shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="leading-tight">
                <span className="font-serif font-bold text-base text-white tracking-wide block">
                  WatchHub
                </span>
                <span className="text-[10px] font-bold text-[#E9B94F] tracking-widest uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D5FF] animate-pulse" />
                  DELIVERY MANAGER
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Modules (11 Dedicated Items) */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-185px)] custom-scrollbar">
          {DELIVERY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const currentPath = (location.pathname || '').replace(/\/$/, '');
            const isActive = activeTab === item.id || currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (setActiveTab) setActiveTab(item.id);
                  if (item.path && location.pathname !== item.path) {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6500FF] to-[#8B00FF] text-white font-bold shadow-md shadow-[#6500FF]/40 border border-[#8B00FF]/50'
                    : 'text-[#A7B1C2] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-[#A7B1C2] group-hover:text-white group-hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!sidebarCollapsed && (
                  <span className="flex-1 text-left truncate tracking-wide">
                    {item.label}
                  </span>
                )}

                {!sidebarCollapsed && item.badge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'rgba(233, 185, 79, 0.2)',
                      color: item.badgeColor || '#E9B94F',
                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'rgba(233, 185, 79, 0.4)'}`,
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#E9B94F] rounded-l-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sidebar: Logged-in Employee Profile */}
      <div className="p-3 border-t border-[#28334B] bg-[#070918]/60">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-[#11172C] border border-[#28334B] flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
                KV
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Karan Verma'}
                </p>
                <p className="text-[10px] text-[#E9B94F] font-semibold truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C98B]" />
                  Delivery Manager
                </p>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="p-1.5 rounded-lg text-[#A7B1C2] hover:text-white hover:bg-white/10 transition-colors"
                title="Profile Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-[#FF4966] bg-[#FF4966]/10 hover:bg-[#FF4966]/20 border border-[#FF4966]/30 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6500FF] to-[#00D5FF] flex items-center justify-center text-xs font-bold text-white shadow-md cursor-pointer"
              title="Karan Verma • Delivery Manager"
              onClick={() => setActiveTab('settings')}
            >
              KV
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-[#FF4966] hover:bg-[#FF4966]/20 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DeliveryManagerSidebar;
