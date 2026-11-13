import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    variantSku: String,
    dialColor: String,
    strapColor: String,
    caseMaterial: String,
    size: String,
    price: Number,
    stock: { type: Number, default: 0 },
    image: String,
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
    },
    subcategory: { type: String, default: 'Wristwatch' },
    productType: { type: String, default: 'Analog' },
    gender: { type: String, enum: ['Men', 'Women', 'Couple', 'Unisex', 'Kids'], default: 'Men' },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    costPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 18 },
    profitMargin: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    warehouseLocation: { type: String, default: 'Warehouse Zone A - Luxury Vault' },
    barcode: { type: String },
    emoji: { type: String, default: '⌚' },
    image: { type: String },
    images: [{ type: String }],
    specifications: {
      dialSize: String,
      dialShape: { type: String, default: 'Round' },
      dialColor: String,
      caseMaterial: String,
      caseColor: String,
      strapMaterial: String,
      strapColor: String,
      movementType: String,
      displayType: String,
      waterResistance: String,
      watchWeight: String,
      warranty: String,
      countryOfOrigin: String,
    },
    variants: [variantSchema],
    seo: {
      metaTitle: String,
      metaDescription: String,
      slug: String,
    },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    warranty: { type: String, default: '2 Years Manufacturer Warranty' },
    waterproof: { type: String, default: '50M Water Resistant' },
    isTrending: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Draft', 'Archived', 'Out of Stock'], default: 'Active' },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
export default Product;
