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
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    payment: {
      method: { type: String, enum: ['Online', 'UPI', 'Card', 'COD'], default: 'Online' },
      status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Completed' },
      transactionId: String,
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

