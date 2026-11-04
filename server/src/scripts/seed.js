import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databaseDir = path.resolve(__dirname, '../../../database');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/watchhub';

async function seedDatabase() {
  console.log('🔄 Connecting to MongoDB at:', uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Products
    const productsPath = path.join(databaseDir, 'products.seed.json');
    if (fs.existsSync(productsPath)) {
      const rawProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      await Product.deleteMany({});
      const formattedProducts = rawProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.id.toUpperCase(),
        brand: p.brand,
        category: p.category,
        gender: p.gender || 'Unisex',
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        discount: p.discount || 0,
        rating: p.rating || 4.5,
        reviewsCount: p.reviewsCount || 0,
        stock: p.stock || 10,
        image: p.image,
        description: p.description || '',
        waterproof: p.waterproof || '',
        warranty: p.warranty || '',
        isTrending: !!p.isTrending,
        isNew: !!p.isNew,
        status: 'Active',
      }));
      await Product.insertMany(formattedProducts);
      console.log(`📦 Seeded ${formattedProducts.length} authentic watch products.`);
    }

    // 2. Users
    const usersPath = path.join(databaseDir, 'users.seed.json');
    if (fs.existsSync(usersPath)) {
      const rawUsers = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      await User.deleteMany({});
      await User.insertMany(rawUsers);
      console.log(`👥 Seeded ${rawUsers.length} RBAC users (Super Admin, Store Admin, Managers, Customer).`);
    }

    // 3. Orders
    const ordersPath = path.join(databaseDir, 'orders.seed.json');
    if (fs.existsSync(ordersPath)) {
      const rawOrders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
      await Order.deleteMany({});
      await Order.insertMany(rawOrders);
      console.log(`📑 Seeded ${rawOrders.length} sample customer orders.`);
    }

    console.log('🎉 WatchHub database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding error:', error.message);
    console.log('ℹ️ Note: If MongoDB server is offline, seed files are available in the /database directory as static JSON and SQL scripts.');
    process.exit(1);
  }
}

seedDatabase();
