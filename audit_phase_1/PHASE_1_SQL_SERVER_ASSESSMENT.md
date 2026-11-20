# WatchHub — Phase 1 Microsoft SQL Server Architecture Assessment

## 1. Executive Summary & Architectural Direction

WatchHub is transitioning its target primary persistent datastore from MongoDB to **Microsoft SQL Server (MSSQL)**. 

Luxury e-commerce and enterprise operations require strict ACID transaction guarantees:
- **Zero-discrepancy inventory locking**: Simultaneous checkouts of limited-edition timepieces must prevent overselling via serialized transactions.
- **Financial auditability**: Double-entry ledger fidelity between payments, orders, refunds, and POS transactions.
- **Strict relational integrity**: Enforced foreign key cascades and constraints across multi-tier roles (Store Admin, Inventory Manager, Delivery Manager, Delivery Partner, Support Executive).

---

## 2. Existing MongoDB / Mongoose Implementation Audit

### Existing MongoDB Dependencies in `server/package.json`:
- `mongoose`: `^8.9.5`
- Database connector: `server/src/config/db.js`
- Target URI: `process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/watchhub'`

### Existing Mongoose Schemas & Shortcomings:
1. **`User.js`**:
   - Stores multiple user roles as a single string enum, preventing multi-role assignment.
   - Embeds shipping addresses as a subdocument array within the user document, complicating geospatial queries and default address management.
2. **`Product.js`**:
   - Embeds `variants` and `specifications` as nested unstructured documents. Querying by specific dial size or case material requires deep document path traversal.
   - Brand and Category are stored as raw redundant strings rather than normalized foreign keys.
3. **`Order.js`**:
   - Embeds line items (`items: [{ product, name, price, quantity }]`) without relational order-to-order-item linkage or foreign key referential integrity.
   - Embeds payment summary directly inside the order document, creating data duplication with `Payment.js`.
4. **`Payment.js`**:
   - Stores webhook logs as a loose array of subdocuments.
5. **`OtpVerification.js`**:
   - Relies on MongoDB's TTL index (`expires: 300`) to purge stale verification records. In SQL Server, this requires a temporal query filter (`WHERE expiresAt > GETUTCDATE()`) or a lightweight scheduled cleanup job.
6. **In-Memory Operations Entities**:
   - Warehouses, Stock Movements, Delivery Partners, Shipments, Support Tickets, and Live Chats currently reside in JavaScript memory arrays (`inventoryRoutes.js`, `deliveryRoutes.js`, `supportRoutes.js`). SQL Server will provide dedicated relational tables for all these operational modules.

---

## 3. SQL Server Technology & Hosting Evaluation

### A. Editions Evaluation
| SQL Server Edition | Suitability for WatchHub | Recommended Use Case |
|---|---|---|
| **SQL Server Express** | Free, max 10 GB database size, 1.4 GB memory per instance, 4 cores. | **Recommended for Local Development**: Ideal for local workstation developers running Windows without license fees. |
| **SQL Server Developer Edition** | 100% full Enterprise feature set (Partitioning, In-Memory OLTP, Advanced Analytics), free for development and non-production testing. | **Recommended for Staging / CI Environment**: Mirror exact production enterprise capabilities. |
| **Azure SQL Database / Managed Instance** | Fully managed cloud PaaS, auto-scaling, automated backups, 99.99% SLA, built-in threat detection. | **Recommended for Cloud Production**: Seamless scalability with zero manual OS/DB patching. |
| **SQL Server on Azure / AWS / GCP VM** | Full IaaS control, hybrid connectivity with local warehouse ERP systems. | Alternative for on-premise luxury boutique networks. |

---

## 4. Backend Node.js Connectivity & ORM Comparison

To interact with Microsoft SQL Server from the Node.js/Express backend:

| Tool / ORM | Type Safety | Migration Tooling | Performance | Suitability for WatchHub |
|---|---|---|---|---|
| **Prisma ORM** | Native TypeScript/JavaScript, auto-generated type-safe client. | **Prisma Migrate**: Declarative schema migrations with shadow database testing. | High (Rust query engine, optimized connection pooling). | **RECOMMENDED #1**: Best developer experience, prevents syntax errors, native MSSQL support, built-in schema introspection. |
| **Sequelize** | Traditional JavaScript Active Record ORM. | `sequelize-cli` migration files. | Medium (dynamic SQL string generation overhead). | Viable alternative, but more verbose and error-prone migrations. |
| **TypeORM** | Data Mapper / Active Record with decorators. | Integrated migration generation. | Medium-High. | Complex setup with plain JavaScript ESM projects. |
| **`mssql` (Tedious Driver)** | Low-level driver; raw SQL queries with parameterization. | Manual `.sql` scripts. | Highest raw throughput. | **Recommended for High-Velocity Read Queries & Bulk Seeding**: Use alongside Prisma or as a dedicated connection pool. |

### Architectural Recommendation:
- **ORM**: Use **Prisma ORM** (`@prisma/client` + `prisma`) as the primary data access layer for business logic, schema modeling, foreign key enforcement, and automated database migrations.
- **Connection Driver**: Configure Prisma with connection pooling: `connection_limit=50`, `connection_timeout=30`, `pool_timeout=10`.
- **Direct Queries**: For complex financial aggregation and POS sales analytics, use Prisma's `$queryRaw` with strict parameterization.

---

## 5. Database Security Architecture

1. **SQL Injection Prevention**:
   - Never concatenate raw strings into SQL statements.
   - All queries executed through Prisma ORM or parameterized `mssql.Request().input('param', sql.VarChar, val)` wrappers.
2. **Least Privilege Accounts**:
   - `watchhub_app_user`: Granted only `SELECT`, `INSERT`, `UPDATE`, `DELETE` on operational tables. No `DROP`, `ALTER`, or `TRUNCATE` privileges.
   - `watchhub_migration_admin`: Dedicated schema migration account used solely during CI/CD release pipelines.
3. **Connection Security**:
   - Mandatory TLS 1.3 encryption on connection strings: `Encrypt=True;TrustServerCertificate=False`.
   - Credentials stored exclusively in environment variables (`MSSQL_CONNECTION_STRING`, `MSSQL_USER`, `MSSQL_PASSWORD`), never committed to source code.
4. **Auditing & Row-Level Protection**:
   - SQL Server `AuditLogs` table captures every administrative data modification with caller ID, timestamp, and IP address.
