# WatchHub – Premium Watches for Every Style ⌚👑

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Deployment-black?style=for-the-badge&logo=vercel)](https://watchhub-store-silk.vercel.app)
[![React 18](https://img.shields.io/badge/Frontend-React_18_%2B_Vite_6-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express_4-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_%2B_Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Android App](https://img.shields.io/badge/Mobile_App-Android_APK_v1.0.0-3DDC84?style=for-the-badge&logo=android)](https://watchhub-store-silk.vercel.app/downloads/WatchHub-latest.apk)

---

## 🌐 Live Production URL
🔗 **Vercel Storefront & API:** [https://watchhub-store-silk.vercel.app](https://watchhub-store-silk.vercel.app)  
📱 **Mobile APK Direct Download:** [WatchHub-latest.apk](https://watchhub-store-silk.vercel.app/downloads/WatchHub-latest.apk)

---

## 🌟 Executive Summary

**WatchHub** is an enterprise-grade luxury e-commerce platform and horological supply-chain tracking ecosystem. Built for luxury timepiece connoisseurs, retailers, and horology manufacturers, it combines a high-performance customer storefront with a comprehensive **6-Role RBAC Operations Management Center**, an interactive **3D Global Watch Manufacturing Hub**, and an **Android Mobile Application with In-App OTA Update Engine**.

---

## 📸 Key Platform Modules

```
                             ┌─────────────────────────────────┐
                             │       WATCHHUB ECOSYSTEM        │
                             └────────────────┬────────────────┘
                                              │
         ┌───────────────────────────────┬────┴──────────────────────────────┐
         ▼                               ▼                                   ▼
┌──────────────────┐           ┌──────────────────┐               ┌──────────────────┐
│   STOREFRONT     │           │ 6-ROLE RBAC HUBS │               │ MANUFACTURING HUB│
│ • 33 Pure Watches│           │ • Super Admin 👑 │               │ • 3D Canvas Globe│
│ • Cart & Coupons │           │ • Store Admin 🏪 │               │ • Supply Chain   │
│ • SSL Checkout   │           │ • Inventory 📦   │               │ • Brand Spotlight│
│ • Live Search    │           │ • Delivery 🚚    │               │ • Factory Matrix │
└──────────────────┘           │ • Support 🎧     │               └──────────────────┘
                               │ • Customer 👤    │
                               └──────────────────┘
```

---

## ✨ Features & Architecture

### 1. 🛍️ Luxury Customer Storefront
- **100% Authentic Wrist Watch Photography**: 33 hand-curated luxury, sports, and smart watch models (Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, Breitling, Tissot, Seiko, Citizen, Casio, Titan, Apple, Samsung, Garmin, Hublot).
- **Dynamic Category Filtering**: Men, Women, Couple, Partywear, Combo Offers, Waterproof, Digital, Smartwatches, Luxury, New Arrivals, and Flash Deals.
- **Smart Shopping Cart Engine**: Live quantity adjustments, dynamic MRP vs discount pricing, promo coupon validator (`FESTIVAL40`, `WATCHHUB10`, `FIRSTBUY`), and free insured shipping calculation.
- **Wishlist & Compare**: One-click move to cart, persistent client storage, and instant visual feedback.

### 2. 🌍 Global Watch Manufacturing Hub & 3D Interactive Map
- **3D Canvas Rotating Globe**: Smooth continuous inertia rotation, latitude/longitude coordinate projection, and pulsing country markers.
- **Supply Chain Flight Paths**: Interactive animated Bezier curves connecting primary horological centers across Switzerland, Germany, Japan, France, India, China, USA, and Canada.
- **Regional Brand Matrix**: In-depth manufacture details, facility counts, key industrial clusters (La Chaux-de-Fonds, Glashütte, Suwa, Hosur, Shenzhen), and hero watch spotlight cards.

### 3. 👥 Enterprise Role-Based Access Control (RBAC)
WatchHub includes 5 specialized administrative operations suites and 1 customer portal:

| Role | Demo Email | Password | Primary Capabilities |
|---|---|---|---|
| **Super Admin 👑** | `superadmin@watchhub.com` | `Admin@123` | Complete platform governance, system logs, revenue analytics |
| **Store Admin 🏪** | `admin@watchhub.com` | `Admin@123` | Product catalog, pricing, banner & coupon management |
| **Inventory Manager 📦** | `inventory@watchhub.com` | `Admin@123` | Multi-warehouse stock tracking, SKU updates, low-stock alerts |
| **Delivery Manager 🚚** | `delivery@watchhub.com` | `Admin@123` | Dispatch staging, courier assignment (BlueDart/Delhivery), tracking |
| **Customer Support 🎧** | `support@watchhub.com` | `Admin@123` | Ticket management, order lookup, refund handling, live chat |
| **Customer 👤** | `customer@watchhub.com` | `Admin@123` | Browsing, ordering, tracking deliveries, profile settings |

### 4. 📱 Android Mobile APK & Auto-Update Engine
- **Pre-compiled APK**: Standalone Android build (`WatchHub-v1.0.0.apk`) bundled with local asset fallbacks.
- **In-App Update Engine**: The app queries `/api/app/version` on launch. When an update is detected, an elegant prompt appears with one-click direct download and seamless upgrade flow.

---

## 🗄️ Database Architecture & Seeds

The full database schema and pre-populated seed data are packaged directly inside the repository under [`/database`](./database):

```
database/
├── products.seed.json          # 33 Luxury & smart watches with HD images & specs
├── users.seed.json             # 6 RBAC demo accounts with bcrypt hashed passwords
├── orders.seed.json            # Realistic e-commerce customer orders with shipping info
├── manufacturingHubs.seed.json # World watch manufacturing facilities & coordinates
├── schema.sql                  # Relational DDL (PostgreSQL / MySQL / Supabase)
└── README.md                   # Complete database setup and import guide
```

### Seeding MongoDB:
```bash
# Seed with a single command
npm run db:seed
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, Lucide React Icons, HTML5 Canvas |
| **Backend** | Node.js 26, Express.js 4, RESTful APIs, Helmet, CORS, Morgan |
| **Database** | MongoDB 8, Mongoose ODM, MongoDB Atlas Ready |
| **Authentication** | JWT Access & Refresh Tokens, bcryptjs, RBAC Middleware |
| **Mobile** | Android Studio Gradle Project, Standalone APK, Webview App Architecture |
| **Deployment** | Vercel Serverless Functions + Global Edge Network |

---

## 🚀 Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/shreyay1310-svg/watchhub.git
cd watchhub
```

### 2. Install dependencies
```bash
# Install root, backend, and frontend packages
npm install
npm run install:all
```

### 3. Setup Environment Variables
Create a `.env` file in `/server`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/watchhub
JWT_SECRET=super_secret_watchhub_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database
```bash
npm run db:seed
```

### 5. Start the Development Servers
```bash
# In Terminal 1 (Frontend):
npm run dev:client

# In Terminal 2 (Backend API):
npm run dev:server
```
Visit **`http://localhost:5173`** to view the app locally.

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API operational status and server timestamp |
| `GET` | `/api/products` | Retrieve all active watch products |
| `POST` | `/api/products` | Create a new watch product (Admin) |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/dashboard/stats` | Retrieve aggregated dashboard metrics |
| `GET` | `/api/app/version` | Query latest Android APK version & download URL |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

Developed with passion for luxury horology and modern full-stack web engineering.
