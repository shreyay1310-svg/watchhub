import mongoose from 'mongoose';

const locationHistorySchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    shipmentId: {
      type: String,
      index: true,
    },
    riderId: {
      type: String,
      required: true,
      index: true,
    },
    riderName: String,
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    speed: Number,
    heading: Number,
    accuracy: Number,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export const LocationHistory = mongoose.model('LocationHistory', locationHistorySchema);
