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
    addresses: [
      {
        fullName: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
        isDefault: Boolean,
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

