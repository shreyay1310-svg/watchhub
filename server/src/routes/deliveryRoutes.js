import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  getDeliveryOverview,
  createShipment,
  assignOrders,
  updateDeliveryStatus,
  registerPartner,
  recordAttemptFailure,
  createReturnPickup,
  getDeliveryReports,
  verifyDeliveryOtp,
} from '../controllers/deliveryController.js';

const router = express.Router();

// 1. GET /api/delivery
router.get('/', getDeliveryOverview);

// 2. POST /api/delivery/create-shipment
router.post('/create-shipment', createShipment);

// 3. POST /api/delivery/assign
router.post('/assign', assignOrders);

// 4. POST /api/delivery/update-status
router.post('/update-status', updateDeliveryStatus);

// 5. POST /api/delivery/partner
router.post('/partner', registerPartner);

// 6. POST /api/delivery/attempt-failure
router.post('/attempt-failure', recordAttemptFailure);

// 7. POST /api/delivery/return-pickup
router.post('/return-pickup', createReturnPickup);

// 8. GET /api/delivery/reports
router.get('/reports', getDeliveryReports);

// 9. POST /api/delivery/verify-otp (Cryptographic Handover Verification)
router.post(
  '/verify-otp',
  authenticate,
  authorizeRoles('Delivery Partner', 'Delivery Manager', 'Super Admin'),
  verifyDeliveryOtp
);

export default router;
