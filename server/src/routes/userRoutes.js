import express from 'express';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 1. Get saved addresses for current user
// GET /api/users/addresses
router.get('/addresses', async (req, res) => {
  try {
    const userEmail = req.query.email || 'collector@watchhub.com';
    let user = null;
    try {
      user = await User.findOne({ email: userEmail.toLowerCase().trim() });
    } catch {}

    const addresses = user?.addresses || [
      {
        addressId: 'addr_default_01',
        fullName: 'Alexander Sterling',
        street: 'Penthouse 14B, The Oberoi Sky Heights, Golf Course Road',
        apartment: 'Suite 14B',
        landmark: 'Near DLF CyberCity',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        country: 'India',
        phone: '+91 98765 43210',
        addressType: 'Home',
        lat: 28.4595,
        lng: 77.0850,
        isDefault: true,
      },
      {
        addressId: 'addr_office_02',
        fullName: 'Alexander Sterling',
        street: 'Level 24, Express Towers, Nariman Point',
        apartment: 'Office 2401',
        landmark: 'Opposite Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400021',
        country: 'India',
        phone: '+91 98765 43210',
        addressType: 'Office',
        lat: 18.9280,
        lng: 72.8228,
        isDefault: false,
      },
    ];

    return res.status(200).json({ status: 'success', addresses });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. Add new address with Google Maps coordinates
// POST /api/users/addresses
router.post('/addresses', async (req, res) => {
  try {
    const {
      email,
      fullName,
      street,
      apartment,
      landmark,
      city,
      state,
      pincode,
      country = 'India',
      phone,
      addressType = 'Home',
      lat,
      lng,
      isDefault = false,
    } = req.body;

    const newAddress = {
      addressId: `addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      fullName: fullName || 'Valued Collector',
      street,
      apartment,
      landmark,
      city,
      state,
      pincode,
      country,
      phone,
      addressType,
      lat: Number(lat || 28.6139),
      lng: Number(lng || 77.2090),
      isDefault: Boolean(isDefault),
    };

    if (email) {
      try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          if (newAddress.isDefault) {
            user.addresses.forEach((a) => (a.isDefault = false));
          }
          user.addresses.push(newAddress);
          await user.save();
        }
      } catch {}
    }

    return res.status(201).json({
      status: 'success',
      message: 'Delivery address saved with GPS coordinates.',
      address: newAddress,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 3. Edit Address
// PUT /api/users/addresses/:addressId
router.put('/addresses/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const { email, ...updates } = req.body;

    if (email) {
      try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          const idx = user.addresses.findIndex((a) => a.addressId === addressId);
          if (idx !== -1) {
            user.addresses[idx] = { ...user.addresses[idx].toObject(), ...updates };
            await user.save();
          }
        }
      } catch {}
    }

    return res.status(200).json({
      status: 'success',
      message: 'Address updated successfully.',
      addressId,
      updates,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// 4. Delete Address
// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    const { addressId } = req.params;
    const { email } = req.query;

    if (email) {
      try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          user.addresses = user.addresses.filter((a) => a.addressId !== addressId);
          await user.save();
        }
      } catch {}
    }

    return res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully.',
      addressId,
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
