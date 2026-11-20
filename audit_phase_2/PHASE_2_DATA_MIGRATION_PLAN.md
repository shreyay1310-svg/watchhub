# WATCHHUB — PHASE 2 DATA MIGRATION PLAN
**Comprehensive Schema Mapping, Transformation Rules & Verification Protocols**

- **Project**: WatchHub — Luxury Horology E-Commerce Platform
- **Source Data Sources**: MongoDB Collections (`users`, `products`, `orders`, `payments`, `otpverifications`, `auditlogs`) + In-Memory Domain Ledgers (`inventory`, `deliveries`, `support`, `coupons`)
- **Target Database**: Microsoft SQL Server 2025 Standard Developer Edition (`WatchHubDB`)
- **ORM / Migrator**: Prisma ORM (v6.19.x)
- **Status**: **MIGRATION BLUEPRINT READY — AWAITING STAGE APPROVAL (READ-ONLY)**

---

## 1. Complete MongoDB / In-Memory to MSSQL Relational Field Mapping

### 1. Identity & RBAC Domain (`Users`, `Roles`, `Permissions`, `Addresses`)

#### Entity 1: `Users` (Source: MongoDB `users` collection)
| MongoDB Source Field | Target MSSQL Column | Target Data Type | Nullable | Transformation / Normalization Rule |
|---|---|---|:---:|---|
| `_id` (ObjectId) | `userId` | `VARCHAR(36)` (UUID) | No | Convert 24-character hex ObjectId to standard UUID string or preserve string representation. |
| `name` | `fullName` | `NVARCHAR(150)` | No | Trim whitespace; enforce minimum 2 characters. |
| `email` | `email` | `NVARCHAR(255)` | No | Lowercase, trim; enforce unique index `UQ_Users_Email`. |
| `password` | `passwordHash` | `VARCHAR(255)` | No | Verbatim copy of existing bcrypt hash (zero re-hashing). |
| `phone` | `phone` | `VARCHAR(25)` | Yes | Clean formatting; enforce unique constraint when present. |
| `avatar` | `avatarUrl` | `NVARCHAR(500)` | Yes | Store absolute image URL or placeholder. |
| `isActive` | `isActive` | `BIT` | No | Default `1` (true). |
| `isEmailVerified` | `isEmailVerified` | `BIT` | No | Direct boolean to bit conversion (`true` -> `1`, `false` -> `0`). |
| `isPhoneVerified` | `isPhoneVerified` | `BIT` | No | Direct boolean to bit conversion. |
| `twoFactorEnabled` | `twoFactorEnabled` | `BIT` | No | Direct boolean to bit conversion. |
| `createdAt` | `createdAt` | `DATETIME2(3)` | No | Parse BSON ISODate to SQL Server `DATETIME2`. |
| `updatedAt` | `updatedAt` | `DATETIME2(3)` | No | Parse BSON ISODate to SQL Server `DATETIME2`. |

#### Entity 2 & 3: `Roles` & `UserRoles` (Normalized from `User.role` string)
| Source Field | Target Table & Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| Role string literal ('Customer', 'Store Admin', etc.) | `Roles.roleName` | `NVARCHAR(50)` | Unique lookup / insert into `Roles` table to obtain `roleId` (Identity INT). |
| `_id` & `role` pair | `UserRoles.[userId, roleId]` | `VARCHAR(36), INT` | Insert composite foreign key row into `UserRoles` junction table. |

#### Entity 4: `Addresses` (Unnested from MongoDB `User.addresses[]` embedded array)
| MongoDB Embedded Field | Target MSSQL Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| Generated UUID | `addressId` | `VARCHAR(36)` | Generate UUID v4 for each unnested address. |
| Parent `_id` | `userId` | `VARCHAR(36)` | Foreign key reference to parent `Users.userId`. |
| `addressType` | `addressType` | `NVARCHAR(30)` | Default to 'Home' / 'Billing' / 'Shipping'. |
| `street` / `addressLine1` | `streetAddress` | `NVARCHAR(255)` | Verbatim copy. |
| `city` | `city` | `NVARCHAR(100)` | Verbatim copy. |
| `state` | `state` | `NVARCHAR(100)` | Verbatim copy. |
| `postalCode` / `pincode`| `postalCode` | `VARCHAR(20)` | Validated 6-digit postal code. |
| `country` | `country` | `NVARCHAR(100)` | Default 'India'. |
| `isDefault` | `isDefault` | `BIT` | Direct bit mapping. |

---

### 2. Product Catalog Domain (`Brands`, `Categories`, `Products`, `ProductImages`)

#### Entity 5 & 6: `Brands` & `Categories` (Normalized from `Product.brand` and `Product.category` strings)
| Source Field | Target Table & Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| `Product.brand` ('Rolex', 'Omega') | `Brands.brandName`, `Brands.slug` | `NVARCHAR(100)`, `VARCHAR(100)` | Unique lookup/insert into `Brands`. Generate slug via lowercase kebab-case. |
| `Product.category` ('Chronograph') | `Categories.categoryName`, `Categories.slug` | `NVARCHAR(100)`, `VARCHAR(100)` | Unique lookup/insert into `Categories`. Generate slug via lowercase kebab-case. |

#### Entity 7: `Products` (Source: MongoDB `products` collection)
| MongoDB Source Field | Target MSSQL Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| `_id` | `productId` | `VARCHAR(36)` | Convert ObjectId to UUID string. |
| `name` | `name` | `NVARCHAR(255)` | Verbatim copy. |
| `slug` | `slug` | `VARCHAR(255)` | Unique product URL slug. |
| `sku` | `sku` | `VARCHAR(100)` | Unique inventory SKU (e.g., 'RLX-SUB-001'). |
| `description` | `description` | `NVARCHAR(MAX)` | Rich text product overview. |
| `price` | `price` | `DECIMAL(12, 2)` | Cast float/int to fixed decimal monetary precision. |
| `originalPrice` | `originalPrice` | `DECIMAL(12, 2)` | Cast float/int to decimal. |
| `costPrice` | `costPrice` | `DECIMAL(12, 2)` | Cast float/int to decimal. |
| `brandId` (FK) | `brandId` | `INT` | Resolved FK from `Brands` table. |
| `categoryId` (FK) | `categoryId` | `INT` | Resolved FK from `Categories` table. |
| `isFeatured` | `isFeatured` | `BIT` | Direct bit mapping. |
| `isActive` | `isActive` | `BIT` | Direct bit mapping. |
| `specifications.caseDiameter` | `caseDiameter` | `VARCHAR(50)` | Flattened from nested specifications object. |
| `specifications.movement` | `movement` | `VARCHAR(100)` | Flattened from nested specifications object. |
| `specifications.waterResistance`| `waterResistance` | `VARCHAR(50)` | Flattened from nested specifications object. |
| `createdAt`, `updatedAt` | `createdAt`, `updatedAt` | `DATETIME2(3)` | Date conversion. |

#### Entity 8: `ProductImages` (Unnested from `Product.images[]`)
| Source Field | Target Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| Identity INT | `imageId` | `BIGINT` | Auto-increment primary key. |
| Parent `_id` | `productId` | `VARCHAR(36)` | Foreign key reference to `Products.productId`. |
| `imageUrl` | `imageUrl` | `NVARCHAR(500)` | Asset path or remote CDN image URL. |
| Index position | `isPrimary` | `BIT` | `1` for index 0, `0` for gallery images. |
| Display order | `sortOrder` | `INT` | Index position integer. |

---

### 3. Orders & Payments Domain (`Orders`, `OrderItems`, `Payments`)

#### Entity 9: `Orders` (Source: MongoDB `orders` collection)
| MongoDB Source Field | Target MSSQL Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| `_id` | `orderId` | `VARCHAR(36)` | Order UUID. |
| `orderNumber` | `orderNumber` | `VARCHAR(50)` | Unique human-readable code (e.g., 'WH-2026-1001'). |
| `user` (ObjectId) | `customerId` | `VARCHAR(36)` | Foreign key to `Users.userId`. |
| `shippingAddress` | `shippingAddressId` | `VARCHAR(36)` | Linked to `Addresses.addressId`. |
| `orderStatus` | `orderStatus` | `VARCHAR(50)` | 'Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'. |
| `paymentStatus` | `paymentStatus` | `VARCHAR(50)` | 'Pending', 'Captured', 'Failed', 'Refunded'. |
| `subtotal` | `subtotal` | `DECIMAL(12, 2)` | Decimal currency. |
| `shippingCharges` | `shippingFee` | `DECIMAL(12, 2)` | Decimal currency. |
| `discount` | `discountAmount` | `DECIMAL(12, 2)` | Decimal currency. |
| `totalAmount` | `totalAmount` | `DECIMAL(12, 2)` | Decimal currency. |
| `createdAt` | `createdAt` | `DATETIME2(3)` | Transaction timestamp. |

#### Entity 10: `OrderItems` (Unnested from `Order.items[]`)
| MongoDB Embedded Field | Target MSSQL Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| Generated UUID | `orderItemId` | `VARCHAR(36)` | Primary key UUID. |
| Parent `_id` | `orderId` | `VARCHAR(36)` | Foreign key to `Orders.orderId`. |
| `item.productId` / SKU | `productId` | `VARCHAR(36)` | Resolved foreign key to `Products.productId`. |
| `item.quantity` | `quantity` | `INT` | Quantity integer. |
| `item.price` | `unitPrice` | `DECIMAL(12, 2)` | Unit price at moment of purchase. |
| `quantity * price` | `subtotal` | `DECIMAL(12, 2)` | Computed line total. |

#### Entity 11: `Payments` (Source: MongoDB `payments` collection)
| MongoDB Source Field | Target MSSQL Column | Target Data Type | Transformation Rule |
|---|---|---|---|
| `_id` | `paymentId` | `VARCHAR(36)` | Payment UUID. |
| `orderId` | `orderId` | `VARCHAR(36)` | Foreign key to `Orders.orderId`. |
| `razorpayOrderId` | `razorpayOrderId` | `VARCHAR(100)` | Razorpay order reference code. |
| `razorpayPaymentId` | `razorpayPaymentId` | `VARCHAR(100)` | Captured transaction ID from Razorpay. |
| `razorpaySignature` | `razorpaySignature` | `VARCHAR(255)` | HMAC-SHA256 signature string. |
| `amount` | `amount` | `DECIMAL(12, 2)` | Verified monetary amount. |
| `currency` | `currency` | `VARCHAR(10)` | Default 'INR'. |
| `status` | `paymentStatus` | `VARCHAR(50)` | 'Created', 'Captured', 'Failed'. |
| `createdAt` | `createdAt` | `DATETIME2(3)` | Payment capture timestamp. |

---

### 4. Logistics, Inventory & Support Domains (Deferred Items HD-008, HD-009, HD-010, HD-012)

#### Entity 12, 13, 14: `Warehouses`, `Inventory`, `StockTransactions` (Source: In-Memory `INVENTORY_DATABASE`)
- `Warehouses`: Populated with regional luxury fulfillment vaults (`WH-DEL-01`, `WH-MUM-01`, `WH-BLR-01`).
- `Inventory`: Mapped with composite unique key on `[productId, warehouseId]`, storing `stockOnHand`, `reservedStock`, and `reorderThreshold`.
- `StockTransactions`: Audit ledger capturing lot numbers, `quantityChange`, `transactionType` ('Inbound', 'Outbound', 'Adjustment'), and `performedBy`.

#### Entity 15 & 16: `Deliveries` & `DeliveryLocationPings` (Source: In-Memory `SHIPMENTS` & `DELIVERY_PARTNERS`)
- `Deliveries`: Links `orderId` to assigned rider `Users.userId`, tracking `trackingNumber` (AWB), `deliveryStatus`, `estimatedDeliveryAt`, and cryptographic `deliveryHandoverOtp`.
- `DeliveryLocationPings`: Telematics stream storing `latitude DECIMAL(10, 7)`, `longitude DECIMAL(10, 7)`, `speedKnots`, and `pingTimestamp`.

#### Entity 17 & 18: `SupportTickets` & `SupportMessages` (Source: In-Memory `SUPPORT_TICKETS`)
- `SupportTickets`: Links `customerId` and `orderId`, tracking `ticketNumber`, `subject`, `priority` ('High', 'Urgent'), and `status` ('Open', 'Resolved').
- `SupportMessages`: Relational conversational thread linking `ticketId` and `senderUserId`, storing `messageText` and `sentAt`.

#### Entity 19: `Coupons` & `CouponUsages` (Source: In-Memory `ACTIVE_COUPONS`)
- `Coupons`: Stores `code` (e.g., 'WATCHHUB10'), `discountPercentage DECIMAL(5, 2)`, `maxDiscountAmount DECIMAL(12, 2)`, `minOrderAmount DECIMAL(12, 2)`, and `isActive BIT`.
- `CouponUsages`: Audit table tracking which `userId` redeemed which `couponId` on which `orderId`.

#### Entity 20 & 21: `OTPVerifications` & `AuditLogs`
- `OTPVerifications`: Phone/Email OTP verification records with `expiresAt` index.
- `AuditLogs`: Security event logging capturing `moduleName`, `action`, `ipAddress`, and `performedBy`.

---

## 2. Pre-Migration Snapshot & Backup Verification Protocol

Before writing any record to SQL Server, a complete, immutable snapshot of the existing MongoDB state must be exported, hashed, and tested for restoreability.

### Automated Backup Script (`server/scripts/backup_mongodb_snapshot.js`)
```javascript
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { Product } from '../src/models/Product.js';
import { Order } from '../src/models/Order.js';
import { Payment } from '../src/models/Payment.js';

async function generateSnapshot() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(process.cwd(), `server/backups/snapshot_${timestamp}`);
  fs.mkdirSync(backupDir, { recursive: true });

  const collections = [
    { name: 'users', model: User },
    { name: 'products', model: Product },
    { name: 'orders', model: Order },
    { name: 'payments', model: Payment },
  ];

  const manifest = { timestamp, collections: {} };

  for (const col of collections) {
    const docs = await col.model.find({}).lean();
    const filePath = path.join(backupDir, `${col.name}.json`);
    const jsonStr = JSON.stringify(docs, null, 2);
    fs.writeFileSync(filePath, jsonStr, 'utf8');

    const hash = crypto.createHash('sha256').update(jsonStr).digest('hex');
    manifest.collections[col.name] = {
      recordCount: docs.length,
      fileSize: fs.statSync(filePath).size,
      sha256: hash,
    };
  }

  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Snapshot complete: ${backupDir}`);
  return manifest;
}
```

### Dry-Run Restore Verification Test
1. Connect to isolated temporary test namespace: `mongodb://localhost:27017/WatchHub_Backup_Verification`.
2. Import exported JSON collections.
3. Assert that:
   - `importedUserCount === manifest.collections.users.recordCount`
   - `importedProductCount === manifest.collections.products.recordCount`
   - `importedOrderCount === manifest.collections.orders.recordCount`
4. Disconnect and drop `WatchHub_Backup_Verification`.
5. Only proceed to Phase 2 data seeding if the dry-run restore achieves a **100.0% verification score**.

---

## 3. Bidirectional Record-Count Reconciliation Protocol

Following data migration, an automated reconciliation query suite verifies that zero records were lost in transit:

```sql
-- RECONCILIATION QUERY SUITE (Execute on WatchHubDB)
SELECT 
  'Users' AS Entity, COUNT(*) AS MssqlCount FROM Users
UNION ALL
SELECT 'Addresses', COUNT(*) FROM Addresses
UNION ALL
SELECT 'Products', COUNT(*) FROM Products
UNION ALL
SELECT 'ProductImages', COUNT(*) FROM ProductImages
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'OrderItems', COUNT(*) FROM OrderItems
UNION ALL
SELECT 'Payments', COUNT(*) FROM Payments
UNION ALL
SELECT 'Coupons', COUNT(*) FROM Coupons;
```

**Reconciliation Gate Rule**:
```text
Discrepancy = | MongoDB_Source_Count - MSSQL_Target_Count |
IF (Discrepancy != 0) -> HALT MIGRATION -> DO NOT PROMOTE MSSQL -> TRIGGER ROLLBACK
```

---

## 4. Referential Integrity Orphan-Detection Queries

To verify that foreign key relationships are strictly intact without orphaned records:

```sql
-- 1. Check for orphaned OrderItems (OrderItems without valid parent Order)
SELECT COUNT(*) AS OrphanedOrderItems 
FROM OrderItems 
WHERE orderId NOT IN (SELECT orderId FROM Orders);

-- 2. Check for orphaned ProductImages (ProductImages without valid Product)
SELECT COUNT(*) AS OrphanedProductImages 
FROM ProductImages 
WHERE productId NOT IN (SELECT productId FROM Products);

-- 3. Check for orphaned UserRoles (UserRoles without valid User)
SELECT COUNT(*) AS OrphanedUserRoles 
FROM UserRoles 
WHERE userId NOT IN (SELECT userId FROM Users);

-- 4. Check for orphaned Addresses (Addresses without valid User)
SELECT COUNT(*) AS OrphanedAddresses 
FROM Addresses 
WHERE userId NOT IN (SELECT userId FROM Users);

-- 5. Check for orphaned Payments (Payments without valid Order)
SELECT COUNT(*) AS OrphanedPayments 
FROM Payments 
WHERE orderId NOT IN (SELECT orderId FROM Orders);

-- 6. Check for orphaned Deliveries (Deliveries without valid Order)
SELECT COUNT(*) AS OrphanedDeliveries 
FROM Deliveries 
WHERE orderId NOT IN (SELECT orderId FROM Orders);

-- 7. Check for orphaned SupportMessages (Messages without valid Ticket)
SELECT COUNT(*) AS OrphanedMessages 
FROM SupportMessages 
WHERE ticketId NOT IN (SELECT ticketId FROM SupportTickets);
```

**Referential Integrity Gate Rule**: Every query above **MUST return 0**. Any non-zero count blocks promotion.

---

## 5. Idempotent Seeding Architecture (Zero Duplicate Key Errors)

All seed operations in Phase 2 Stage 3 are implemented with strict **upsert semantics** keyed on natural business unique constraints:

```javascript
// Idempotent Role Seeding
await prisma.role.upsert({
  where: { roleName: 'Super Admin' },
  update: { description: 'Full system administrative access' },
  create: { roleName: 'Super Admin', description: 'Full system administrative access' }
});

// Idempotent Brand Seeding
await prisma.brand.upsert({
  where: { slug: 'rolex' },
  update: { brandName: 'Rolex' },
  create: { brandName: 'Rolex', slug: 'rolex', country: 'Switzerland' }
});

// Idempotent Category Seeding
await prisma.category.upsert({
  where: { slug: 'chronograph' },
  update: { categoryName: 'Chronograph' },
  create: { categoryName: 'Chronograph', slug: 'chronograph' }
});

// Idempotent Product Seeding
await prisma.product.upsert({
  where: { sku: 'RLX-SUB-124060' },
  update: { price: 18999.00, isActive: true },
  create: {
    sku: 'RLX-SUB-124060',
    slug: 'rolex-submariner-no-date',
    name: 'Rolex Submariner No-Date',
    price: 18999.00,
    brandId: rolexBrand.brandId,
    categoryId: diverCategory.categoryId,
    isActive: true
  }
});

// Idempotent Coupon Seeding
await prisma.coupon.upsert({
  where: { code: 'WATCHHUB10' },
  update: { discountPercentage: 10.00, maxDiscountAmount: 25000.00, minOrderAmount: 10000.00, isActive: true },
  create: { code: 'WATCHHUB10', discountPercentage: 10.00, maxDiscountAmount: 25000.00, minOrderAmount: 10000.00, isActive: true }
});
```
This guarantees that running seed operations multiple times produces identical state without duplicate errors.
