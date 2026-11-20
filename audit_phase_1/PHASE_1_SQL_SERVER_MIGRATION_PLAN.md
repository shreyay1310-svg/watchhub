# WatchHub — Phase 1 Microsoft SQL Server Migration Plan

## 1. Migration Strategy Overview

The migration from MongoDB/Mongoose to Microsoft SQL Server will follow a phased, non-breaking cutover strategy once user approval for Phase 2 is granted.

```
[Phase 1: Audit Complete] ➔ [Phase 2.1: Provision SQL Server] ➔ [Phase 2.2: Setup Prisma ORM]
                                       ↓
[Phase 2.5: API Controller Refactor] ‹- [Phase 2.4: Seed Initial Data] ‹- [Phase 2.3: Execute Schema Migrations]
                                       ↓
                          [Phase 2.6: Verification & Testing]
```

---

## 2. Step-by-Step Phase 2 Implementation Plan

### Step 1: Install SQL Server Dependencies
In `server/package.json`, add:
- `@prisma/client`: `^6.x`
- `prisma`: `^6.x` (devDependency)
- `@types/mssql`: For type definition support

### Step 2: Initialize Prisma with Microsoft SQL Server Provider
Run `npx prisma init --datasource-provider sqlserver`.
In `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```
Define the 22 relational models matching `PHASE_1_DATABASE_SCHEMA_PROPOSAL.md`.

### Step 3: Execute Schema Migration
Run `npx prisma migrate dev --name init_watchhub_mssql`.
This will:
- Connect to `WatchHubDB`.
- Execute standard DDL to generate all 22 normalized tables, foreign keys, unique constraints, and indexes.
- Generate the auto-completed `@prisma/client`.

### Step 4: Seed WatchHub Master Data
Create `server/prisma/seed.js` to seed:
- System Roles: `Customer`, `Super Admin`, `Store Admin`, `Inventory Manager`, `Delivery Manager`, `Delivery Partner`, `Customer Support Executive`.
- Master Horology Brands: `Rolex`, `Omega`, `Patek Philippe`, `Audemars Piguet`, `Tag Heuer`, `Cartier`.
- Primary Categories: `Luxury`, `Chronograph`, `Diver`, `Smartwatches`, `Sports`, `Limited Edition`.
- Initial Product Catalog (migrated from `client/src/data/products.js` and `server/src/scripts/seed.js`).
- Default Warehouse: `Zone A - Luxury Vault`.

### Step 5: Refactor Backend Controllers (Mongoose ➔ Prisma Client)
Replace Mongoose syntax with Prisma Client queries:
- **Authentication (`authController.js`)**:
  - `User.findOne({ email })` ➔ `prisma.user.findUnique({ where: { email } })`
  - `new User(...).save()` ➔ `prisma.user.create({ data: { ... } })`
- **Product Catalog (`productController.js`)**:
  - `Product.find(filter)` ➔ `prisma.product.findMany({ where: filter, include: { brand: true, category: true, images: true } })`
- **Order Checkout (`paymentRoutes.js` / `orderController.js`)**:
  - Atomic transaction:
    ```javascript
    await prisma.$transaction(async (tx) => {
      // 1. Lock and verify available stock
      const inventory = await tx.inventory.findFirst({ where: { productId, warehouseId } });
      if (inventory.availableStock < qty) throw new Error('Stock unavailable');
      
      // 2. Deduct stock
      await tx.inventory.update({ where: { inventoryId }, data: { currentStock: { decrement: qty } } });
      
      // 3. Create Order and OrderItems
      const order = await tx.order.create({ data: { ... } });
      
      // 4. Record stock transaction
      await tx.stockTransaction.create({ data: { transactionType: 'SALES_DISPATCH', ... } });
    });
    ```
- **Operations Routes (`inventoryRoutes.js`, `deliveryRoutes.js`, `supportRoutes.js`)**:
  - Replace in-memory array operations with persistent Prisma table queries.

### Step 6: Decommission MongoDB
- Remove `mongoose` from `server/package.json`.
- Delete `server/src/config/db.js` and remove MongoDB connection logic from `server.js`.
- Clean up unused `server/src/models/*.js` Mongoose schema files.

---

## 3. Rollback & Contingency Strategy

1. **Code Preservation**: All changes in Phase 2 will be committed to a dedicated feature branch (`feature/mssql-migration`) before merging to `main`.
2. **Dual-Driver Safety**: During transition, controllers can fall back to existing in-memory data structures if database environment variables are omitted, ensuring zero service disruption during local development.
3. **Database Backups**: Full `.bak` snapshot of `WatchHubDB` created prior to running any destructive migration scripts.
