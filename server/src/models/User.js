import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: [
        'Customer',
        'Super Admin',
        'Store Admin',
        'Inventory Manager',
        'Delivery Manager',
        'Customer Support Executive',
      ],
      default: 'Customer',
    },
    permissions: [{ type: String }],
    avatar: { type: String, default: '👤' },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    addresses: [
      {
        addressId: { type: String, default: () => `addr_${Date.now()}_${Math.floor(Math.random()*1000)}` },
        fullName: String,
        street: String,
        apartment: String,
        landmark: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
        phone: String,
        addressType: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
        lat: Number,
        lng: Number,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);

