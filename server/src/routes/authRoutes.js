import { Router } from 'express';
import { login, register, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { sendFast2SMS } from '../services/smsService.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getMe);

// Real Mobile SMS OTP Endpoint via Fast2SMS
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, mobile, otp } = req.body;
    const targetPhone = phone || mobile;
    if (!targetPhone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }
    const smsResult = await sendFast2SMS(targetPhone, otp);
    return res.status(200).json({
      success: true,
      phone: targetPhone,
      otp,
      smsResult,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

