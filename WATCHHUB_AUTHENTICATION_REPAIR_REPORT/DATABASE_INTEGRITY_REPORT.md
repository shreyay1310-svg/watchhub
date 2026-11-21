# WATCHHUB ATELIER — DATABASE INTEGRITY REPORT

**Database Engine:** Microsoft SQL Server 2025  
**Connection Host:** `127.0.0.1:1433`  
**Database Name:** `WatchHubDB`  
**ORM:** Prisma 6.19.3  
**Audit Type:** Non-Destructive Integrity, Schema Alignment & Relational Integrity  

---

## 1. USER & ROLE TABLE STATUS

### 1.1 `dbo.Users` Schema Alignment
All columns verified and aligned with `server/prisma/schema.prisma`:
- `UserId` (NVARCHAR(36), PK)
- `FullName` (NVARCHAR(150), NOT NULL)
- `Email` (NVARCHAR(255), UNIQUE, NOT NULL)
- `Phone` (NVARCHAR(30), NULLABLE)
- `PasswordHash` (NVARCHAR(255), NOT NULL)
- `AvatarUrl` (NVARCHAR(500), NULLABLE)
- `IsActive` (BIT, NOT NULL, DEFAULT 1)
- `IsEmailVerified` (BIT, NOT NULL, DEFAULT 0)
- `IsPhoneVerified` (BIT, NOT NULL, DEFAULT 0)
- `OtpCode` (NVARCHAR(10), NULLABLE)
- `OtpHash` (NVARCHAR(128), NULLABLE)
- `OtpExpiresAt` (DATETIME2, NULLABLE)
- `OtpPurpose` (NVARCHAR(40), NULLABLE)
- `ResetPasswordToken` (NVARCHAR(255), NULLABLE)
- `ResetPasswordExpiresAt` (DATETIME2, NULLABLE)
- `PasswordChangedAt` (DATETIME2, NULLABLE)
- `CreatedAt` (DATETIME2, NOT NULL)
- `UpdatedAt` (DATETIME2, NOT NULL)

### 1.2 `dbo.Roles` Table Integrity
Verified 7 primary roles in `WatchHubDB`:
1. `Super Admin`
2. `Store Admin`
3. `Inventory Manager`
4. `Delivery Manager`
5. `Delivery Partner`
6. `Customer Support Executive`
7. `Customer`

### 1.3 `dbo.UserRoles` Mapping Integrity
- Primary Foreign Key constraints (`FK_UserRoles_Users` and `FK_UserRoles_Roles`) active and valid.
- Zero orphaned `UserRoles` records detected.
- Every verified role account has a corresponding relational link in `dbo.UserRoles`.

---

## 2. VERIFIED ROLE ACCOUNTS AUDIT

| Email Address | Name | Assigned Role | IsActive | Password Hash Verified (`Admin@123`) |
| :--- | :--- | :--- | :--- | :--- |
| `superadmin@watchhub.com` | Vikram Malhotra | Super Admin | `true` | **PASS (bcrypt)** |
| `admin@watchhub.com` | Aanya Singhania | Store Admin | `true` | **PASS (bcrypt)** |
| `inventory@watchhub.com` | Rajesh Mehta | Inventory Manager | `true` | **PASS (bcrypt)** |
| `delivery@watchhub.com` | Karan Verma | Delivery Manager | `true` | **PASS (bcrypt)** |
| `rider@watchhub.com` | Rohan Singh | Delivery Partner | `true` | **PASS (bcrypt)** |
| `rohan.singh@watchhub.com` | Rohan Singh | Delivery Partner | `true` | **PASS (bcrypt)** |
| `support@watchhub.com` | Pooja Sharma | Customer Support Executive | `true` | **PASS (bcrypt)** |
| `customer@watchhub.com` | Arjun Kapoor | Customer | `true` | **PASS (bcrypt)** |

---

## 3. ZERO-DESTRUCTION COMPLIANCE
- Zero tables dropped (`DROP TABLE` was never executed).
- Zero tables truncated (`TRUNCATE` was never executed).
- Zero database resets occurred.
- All pre-existing customer records, orders, product inventory, and tracking entries remain 100% intact.
