import express from 'express';
import {
  getRiderDashboard,
  getRiderDeliveries,
  verifyRiderDeliveryOtp,
  toggleRiderDuty,
  getRiderEarnings,
  createRiderSupportTicket,
} from '../controllers/riderController.js';

const router = express.Router();

// GET /api/rider/dashboard
router.get('/dashboard', getRiderDashboard);

// GET /api/rider/deliveries
router.get('/deliveries', getRiderDeliveries);

// POST /api/rider/deliveries/:id/verify-otp
router.post('/deliveries/:id/verify-otp', verifyRiderDeliveryOtp);

// PATCH /api/rider/duty
router.patch('/duty', toggleRiderDuty);

// GET /api/rider/earnings
router.get('/earnings', getRiderEarnings);

// POST /api/rider/support
router.post('/support', createRiderSupportTicket);

export default router;
