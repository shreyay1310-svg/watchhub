import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Men',
        'Women',
        'Couple',
        'Partywear',
        'Combo Offers',
        'Waterproof',
        'Digital',
        'Smartwatches',
        'Luxury',
        'Sports',
        'Kids',
      ],
    },
    gender: { type: String, enum: ['Men', 'Women', 'Couple', 'Unisex'], default: 'Men' },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    emoji: { type: String, default: '⌚' },
    images: [{ type: String }],
    specifications: {
      movement: String,
      caseDiameter: String,
      strapMaterial: String,
      dialColor: String,
      glassMaterial: String,
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    warranty: { type: String, default: '2 Years Manufacturer Warranty' },
    waterproof: { type: String, default: '50M Water Resistant' },
    isTrending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Draft', 'Archived'], default: 'Active' },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);

