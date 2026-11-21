import { Router } from 'express';
import {
  getSuperAdminOverview,
  getUsersAndRoles,
  createStaffMember,
  toggleUserStatus,
  updateUserRole,
  getRolesAndPermissions,
  getDepartmentsList,
  getAuditLogs,
  getDatabaseDiagnostics,
  getSystemHealth,
} from '../controllers/superAdminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Strict RBAC Middleware: Only Super Admin can access these operational control routes
router.use(authenticate);
router.use(authorizeRoles('Super Admin'));

router.get('/overview', getSuperAdminOverview);
router.get('/users', getUsersAndRoles);
router.post('/staff', createStaffMember);
router.put('/users/:userId/status', toggleUserStatus);
router.put('/users/:userId/role', updateUserRole);
router.get('/roles', getRolesAndPermissions);
router.get('/departments', getDepartmentsList);
router.get('/audit-logs', getAuditLogs);
router.get('/database-diagnostics', getDatabaseDiagnostics);
router.get('/system-health', getSystemHealth);

export default router;
