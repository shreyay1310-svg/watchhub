import { Router } from 'express';
import {
  getSuperAdminStats,
  getStoreAdminStats,
  getInventoryStats,
  getDeliveryStats,
  getSupportStats,
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/super-admin', getSuperAdminStats);
router.get('/store-admin', getStoreAdminStats);
router.get('/inventory-manager', getInventoryStats);
router.get('/delivery-manager', getDeliveryStats);
router.get('/customer-support', getSupportStats);

export default router;

