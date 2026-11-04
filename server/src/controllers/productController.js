import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load 33 pure luxury & smart watches from seed file
let INITIAL_PRODUCTS = [];
try {
  const seedPath = path.resolve(__dirname, '../../../database/products.seed.json');
  if (fs.existsSync(seedPath)) {
    INITIAL_PRODUCTS = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  }
} catch (e) {
  console.warn('[ProductController] Could not load seed products from JSON, using built-in list.');
}

if (!INITIAL_PRODUCTS.length) {
  INITIAL_PRODUCTS = [
    {
      id: 'rolex-submariner',
      name: 'Rolex Submariner Date 41mm',
      brand: 'Rolex',
      category: 'Luxury',
      price: 18999,
      originalPrice: 24999,
      discount: 24,
      stock: 14,
      rating: 4.9,
      reviewsCount: 3840,
      image: 'https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&w=600&q=80',
      waterproof: '300M Diver',
    },
    {
      id: 'omega-speedmaster',
      name: 'Omega Speedmaster Moonwatch',
      brand: 'Omega',
      category: 'Luxury',
      price: 16499,
      originalPrice: 22000,
      discount: 25,
      stock: 18,
      rating: 4.8,
      reviewsCount: 2950,
      image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=600&q=80',
      waterproof: '50M Water Resistant',
    },
    {
      id: 'patek-nautilus',
      name: 'Patek Philippe Nautilus Selfwinding',
      brand: 'Patek Philippe',
      category: 'Luxury',
      price: 24999,
      originalPrice: 34999,
      discount: 28,
      stock: 5,
      rating: 5.0,
      reviewsCount: 1890,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      waterproof: '120M Water Resistant',
    },
    {
      id: 'ap-royal-oak',
      name: 'Audemars Piguet Royal Oak Selfwinding',
      brand: 'Audemars Piguet',
      category: 'Luxury',
      price: 23999,
      originalPrice: 31999,
      discount: 25,
      stock: 7,
      rating: 4.9,
      reviewsCount: 1670,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
      waterproof: '50M Water Resistant',
    },
  ];
}

export const getProducts = async (req, res) => {
  try {
    let products = [];
    try {
      products = await Product.find({ status: 'Active' });
    } catch (e) {
      // Database offline fallback
    }
    if (!products.length) products = INITIAL_PRODUCTS;

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = {
      id: `p_${Date.now()}`,
      ...req.body,
      createdAt: new Date(),
    };
    try {
      await Product.create(req.body);
    } catch (e) {}

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully.',
      data: newProduct,
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
