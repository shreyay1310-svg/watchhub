import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';
import SuperAdminLayout from '../../components/superadmin/SuperAdminLayout';
import SuperAdminOverviewModule from '../../components/superadmin/modules/SuperAdminOverviewModule';
import SuperAdminUsersRolesModule from '../../components/superadmin/modules/SuperAdminUsersRolesModule';
import SuperAdminRolesPermissionsModule from '../../components/superadmin/modules/SuperAdminRolesPermissionsModule';
import SuperAdminDepartmentsModule from '../../components/superadmin/modules/SuperAdminDepartmentsModule';
import SuperAdminAuditSecurityModule from '../../components/superadmin/modules/SuperAdminAuditSecurityModule';
import SuperAdminOperationsModule from '../../components/superadmin/modules/SuperAdminOperationsModule';
import SuperAdminSettingsModule from '../../components/superadmin/modules/SuperAdminSettingsModule';
import ReleaseManagementModule from '../../components/dashboards/modules/ReleaseManagementModule';
import ReportsAnalyticsModule from '../../components/dashboards/modules/ReportsAnalyticsModule';

export default function SuperAdminDashboardPage({ initialTab = 'users' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/releases')) return 'releases';
    if (location.pathname.includes('/users')) return 'users';
    if (location.pathname.includes('/audit')) return 'audit';
    if (location.pathname.includes('/overview')) return 'overview';
    return initialTab;
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverviewModule onNavigate={setActiveTab} />;
      case 'releases':
        return <ReleaseManagementModule />;
      case 'users':
      case 'staff':
      case 'accounts':
        return <SuperAdminUsersRolesModule />;
      case 'permissions':
        return <SuperAdminRolesPermissionsModule />;
      case 'departments':
        return <SuperAdminDepartmentsModule />;
      case 'audit':
        return <SuperAdminAuditSecurityModule />;
      case 'analytics':
        return <ReportsAnalyticsModule />;
      case 'health':
        return <SuperAdminOperationsModule subTab="health" />;
      case 'database':
        return <SuperAdminOperationsModule subTab="database" />;
      case 'api-monitoring':
      case 'error-logs':
        return <SuperAdminOperationsModule subTab="api-monitoring" />;
      case 'backup':
        return <SuperAdminOperationsModule subTab="backup" />;
      case 'settings':
        return <SuperAdminSettingsModule />;
      default:
        return <SuperAdminUsersRolesModule />;
    }
  };

  return (
    <>
      <SEO
        title="Super Admin Command Center — WatchHub Atelier"
        description="Supreme Platform Governance & Enterprise Horology Command Console"
      />
      <SuperAdminLayout
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {renderActiveModule()}
      </SuperAdminLayout>
    </>
  );
}
