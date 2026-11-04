# 🗄️ WatchHub Database Architecture & Seed Guide

This directory contains the production database definitions, schema specifications, seed files, and automated import scripts for the **WatchHub Luxury E-Commerce Platform**.

---

## 📁 Database Files Overview

| File | Type | Description |
|---|---|---|
| [`products.seed.json`](./products.seed.json) | JSON Data | Complete 33 luxury, smart & sports watch catalog with genuine HD photography, prices, technical specifications, and inventory counts. |
| [`users.seed.json`](./users.seed.json) | JSON Data | 6 pre-configured user accounts covering all 6 RBAC roles (Super Admin, Store Admin, Inventory Manager, Delivery Manager, Customer Support, Customer) with pre-hashed bcrypt passwords. |
| [`orders.seed.json`](./orders.seed.json) | JSON Data | Realistic e-commerce customer orders with shipping addresses, courier tracking IDs (BlueDart, Delhivery), payment info, and item lists. |
| [`manufacturingHubs.seed.json`](./manufacturingHubs.seed.json) | JSON Data | Global watch manufacturing regions (Switzerland, Germany, Japan, France, India, China) with brand profiles, facility counts, and featured signature models. |
| [`schema.sql`](./schema.sql) | SQL Script | Relational DDL schema script with primary keys, foreign keys, cascade deletes, and B-Tree indexes for PostgreSQL, MySQL, and Supabase. |

---

## ⚡ Quick Database Seeding

To automatically populate MongoDB with all seed collections:

```bash
# From the project root
npm run db:seed

# Or from inside the server directory
cd server
npm run seed
```

### Direct MongoDB Shell / Mongoimport

If you prefer using native MongoDB command line tools:

```bash
# Import Products
mongoimport --uri "mongodb://127.0.0.1:27017/watchhub" --collection products --file database/products.seed.json --jsonArray --drop

# Import Users
mongoimport --uri "mongodb://127.0.0.1:27017/watchhub" --collection users --file database/users.seed.json --jsonArray --drop

# Import Orders
mongoimport --uri "mongodb://127.0.0.1:27017/watchhub" --collection orders --file database/orders.seed.json --jsonArray --drop
```

### Relational Database Import (PostgreSQL / MySQL / Supabase)

To run the SQL DDL schema:

```bash
# PostgreSQL
psql -h localhost -U postgres -d watchhub -f database/schema.sql

# MySQL
mysql -u root -p watchhub < database/schema.sql
```

---

## 🔑 Pre-seeded Role Accounts (Credentials)

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Super Admin** | `superadmin@watchhub.com` | `Admin@123` | Full system access, audit logs, revenue control |
| **Store Admin** | `admin@watchhub.com` | `Admin@123` | Product catalog, pricing, banner & coupon management |
| **Inventory Manager**| `inventory@watchhub.com` | `Admin@123` | Stock updates, warehouse tracking, low-stock alerts |
| **Delivery Manager** | `delivery@watchhub.com` | `Admin@123` | Order dispatch, courier tracking (BlueDart/Delhivery) |
| **Customer Support** | `support@watchhub.com` | `Admin@123` | Ticket resolution, customer queries, refund initiation |
| **Customer** | `customer@watchhub.com` | `Admin@123` | Browsing, shopping cart, checkout, order tracking |
