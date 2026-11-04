-- =====================================================================
-- WatchHub Luxury E-Commerce Platform Database Schema
-- Compatible with PostgreSQL 14+, MySQL 8.0+, Supabase, SQLite 3
-- =====================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone VARCHAR(30),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Customer',
    avatar VARCHAR(255) DEFAULT '👤',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    street TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(30),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    gender VARCHAR(30) DEFAULT 'Unisex',
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    discount INT DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    reviews_count INT DEFAULT 0,
    stock INT DEFAULT 10,
    image TEXT NOT NULL,
    waterproof VARCHAR(100),
    warranty VARCHAR(150),
    description TEXT,
    is_trending BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    customer_id VARCHAR(36) REFERENCES users(id),
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(191) NOT NULL,
    customer_phone VARCHAR(30),
    payment_method VARCHAR(50) DEFAULT 'Online',
    payment_status VARCHAR(50) DEFAULT 'Completed',
    transaction_id VARCHAR(100),
    order_status VARCHAR(50) DEFAULT 'Processing',
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) DEFAULT 0,
    shipping_charges NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    courier_name VARCHAR(100) DEFAULT 'BlueDart Express',
    tracking_id VARCHAR(100),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    emoji VARCHAR(20) DEFAULT '⌚'
);

CREATE TABLE IF NOT EXISTS manufacturing_hubs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    flag VARCHAR(10),
    companies_count VARCHAR(50),
    brands_count VARCHAR(50),
    hero_tag VARCHAR(150),
    description TEXT,
    key_hubs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high-performance e-commerce queries
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

