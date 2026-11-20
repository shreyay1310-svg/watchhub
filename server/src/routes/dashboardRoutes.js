import { Router } from 'express';
import {
  getSuperAdminStats,
  getStoreAdminStats,
  getInventoryStats,
  getDeliveryStats,
  getSupportStats,
} from '../controllers/dashboardController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/super-admin', authenticate, authorizeRoles('Super Admin'), getSuperAdminStats);
router.get('/store-admin', authenticate, authorizeRoles('Store Admin', 'Super Admin'), getStoreAdminStats);
router.get('/inventory-manager', authenticate, authorizeRoles('Inventory Manager', 'Super Admin'), getInventoryStats);
router.get('/delivery-manager', authenticate, authorizeRoles('Delivery Manager', 'Super Admin'), getDeliveryStats);
router.get(
  '/customer-support',
  authenticate,
  authorizeRoles('Customer Support Executive', 'Customer Support Manager', 'Customer Support', 'Super Admin'),
  getSupportStats
);

export default router;

