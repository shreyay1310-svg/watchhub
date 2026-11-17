import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true, // in INR
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: [
        'Created',
        'Pending',
        'Authorized',
        'Captured',
        'Failed',
        'Refunded',
        'Partially Refunded',
      ],
      default: 'Created',
      index: true,
    },
    method: {
      type: String, // 'upi', 'card', 'netbanking', 'wallet'
      default: 'upi',
    },
    customer: {
      name: String,
      email: String,
      phone: String,
    },
    webhookEventsReceived: [
      {
        eventId: String,
        eventType: String,
        receivedAt: { type: Date, default: Date.now },
      },
    ],
    refunds: [
      {
        refundId: String,
        amount: Number,
        status: String,
        speed: String,
        notes: String,
        processedBy: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
