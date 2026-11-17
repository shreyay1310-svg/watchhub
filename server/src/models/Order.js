import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: String,
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        sku: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        emoji: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      street: String,
      apartment: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
      phone: String,
      lat: Number,
      lng: Number,
    },
    payment: {
      method: { type: String, enum: ['Online', 'UPI', 'Card', 'COD', 'Net Banking', 'Wallet'], default: 'Online' },
      status: { type: String, enum: ['Created', 'Pending', 'Authorized', 'Captured', 'Completed', 'Failed', 'Refunded', 'Partially Refunded'], default: 'Pending' },
      transactionId: String,
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: { type: String, index: true },
      razorpaySignature: String,
      amount: Number,
    },
    orderStatus: {
      type: String,
      enum: [
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Return Requested',
        'Returned',
      ],
      default: 'Processing',
    },
    delivery: {
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      courierName: { type: String, default: 'BlueDart Express' },
      trackingId: String,
      estimatedDelivery: Date,
      deliveredAt: Date,
    },
    subtotal: Number,
    discount: Number,
    shippingCharges: Number,
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);

