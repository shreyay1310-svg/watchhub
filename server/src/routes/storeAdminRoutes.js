import { Router } from 'express';
import {
  getStoreAdminOverview,
  getSalesOverviewChart,
  getSalesByChannel,
  searchPosProducts,
  createPosOrder,
  getStoreAdminOrders,
  updateOrderStatus,
  getStoreAdminCustomers,
  getStoreAdminCoupons,
  createStoreAdminCoupon,
} from '../controllers/storeAdminController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

// Protect all store admin endpoints to Store Admin & Super Admin
router.use(authenticate, authorizeRoles('Store Admin', 'Super Admin'));

router.get('/overview', getStoreAdminOverview);
router.get('/sales-overview', getSalesOverviewChart);
router.get('/sales-by-channel', getSalesByChannel);
router.get('/pos/search', searchPosProducts);
router.post('/pos/order', createPosOrder);
router.get('/orders', getStoreAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/customers', getStoreAdminCustomers);
router.get('/coupons', getStoreAdminCoupons);
router.post('/coupons', createStoreAdminCoupon);

export default router;
