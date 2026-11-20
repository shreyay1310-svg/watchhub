# WatchHub — Phase 1 Microsoft SQL Server Database Schema Proposal

This schema represents the complete relational architecture for the WatchHub enterprise luxury platform. Every table is directly justified by application features present in the code.

---

## 1. Authentication, Roles & Security Tables

### Table 1: `Roles`
- **Purpose**: Defines operational system roles.
- **Columns**:
  - `RoleId` INT IDENTITY(1,1) PRIMARY KEY
  - `RoleName` NVARCHAR(50) NOT NULL UNIQUE (e.g., 'Customer', 'Super Admin', 'Store Admin', 'Inventory Manager', 'Delivery Manager', 'Delivery Partner', 'Customer Support Executive')
  - `Description` NVARCHAR(255) NULL
  - `CreatedAt` DATETIME2 DEFAULT SYSUTCDATETIME() NOT NULL

### Table 2: `Permissions`
- **Purpose**: Granular feature permissions.
- **Columns**:
  - `PermissionId` INT IDENTITY(1,1) PRIMARY KEY
  - `PermissionCode` NVARCHAR(100) NOT NULL UNIQUE (e.g., 'products.manage', 'inventory.adjust', 'delivery.assign', 'tickets.respond')
  - `ModuleName` NVARCHAR(50) NOT NULL
  - `Description` NVARCHAR(255) NULL

### Table 3: `RolePermissions`
- **Purpose**: Many-to-Many mapping of Roles to Permissions.
- **Columns**:
  - `RoleId` INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleId) ON DELETE CASCADE
  - `PermissionId` INT NOT NULL FOREIGN KEY REFERENCES Permissions(PermissionId) ON DELETE CASCADE
  - PRIMARY KEY (`RoleId`, `PermissionId`)

### Table 4: `Users`
- **Purpose**: Primary identity and authentication credentials for all users and staff.
- **Columns**:
  - `UserId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `FullName` NVARCHAR(120) NOT NULL
  - `Email` NVARCHAR(255) NOT NULL UNIQUE
  - `Phone` NVARCHAR(20) NULL UNIQUE
  - `PasswordHash` NVARCHAR(255) NOT NULL (Bcrypt hash)
  - `AvatarUrl` NVARCHAR(500) NULL
  - `IsActive` BIT NOT NULL DEFAULT 1
  - `IsEmailVerified` BIT NOT NULL DEFAULT 0
  - `IsPhoneVerified` BIT NOT NULL DEFAULT 0
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  - `UpdatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_Users_Email` UNIQUE NONCLUSTERED (`Email`)
  - `IX_Users_Phone` NONCLUSTERED (`Phone`) WHERE `Phone` IS NOT NULL

### Table 5: `UserRoles`
- **Purpose**: Many-to-Many mapping supporting multi-role assignment.
- **Columns**:
  - `UserId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE
  - `RoleId` INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleId) ON DELETE CASCADE
  - `AssignedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  - PRIMARY KEY (`UserId`, `RoleId`)

### Table 6: `Addresses`
- **Purpose**: Collector shipping and billing locations (extracted from MongoDB subdocuments).
- **Columns**:
  - `AddressId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `UserId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId) ON DELETE CASCADE
  - `FullName` NVARCHAR(120) NOT NULL
  - `Street` NVARCHAR(255) NOT NULL
  - `Apartment` NVARCHAR(100) NULL
  - `Landmark` NVARCHAR(150) NULL
  - `City` NVARCHAR(80) NOT NULL
  - `State` NVARCHAR(80) NOT NULL
  - `Pincode` NVARCHAR(10) NOT NULL
  - `Country` NVARCHAR(60) NOT NULL DEFAULT 'India'
  - `Phone` NVARCHAR(20) NOT NULL
  - `AddressType` NVARCHAR(20) NOT NULL DEFAULT 'Home' CHECK (AddressType IN ('Home', 'Office', 'Other'))
  - `Latitude` DECIMAL(10, 7) NULL
  - `Longitude` DECIMAL(10, 7) NULL
  - `IsDefault` BIT NOT NULL DEFAULT 0
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_Addresses_UserId` NONCLUSTERED (`UserId`)

### Table 7: `OTPVerifications`
- **Purpose**: Cryptographic one-time passwords for registration, login, and forgot-password flows.
- **Columns**:
  - `OtpId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `Identifier` NVARCHAR(255) NOT NULL (email or mobile)
  - `OtpHash` NVARCHAR(128) NOT NULL (HMAC-SHA256)
  - `Channel` NVARCHAR(20) NOT NULL CHECK (Channel IN ('email', 'sms', 'mobile'))
  - `Purpose` NVARCHAR(40) NOT NULL CHECK (Purpose IN ('registration', 'login', 'password_reset', 'sensitive_action'))
  - `Attempts` INT NOT NULL DEFAULT 0
  - `IsVerified` BIT NOT NULL DEFAULT 0
  - `ResendCooldownUntil` DATETIME2 NOT NULL
  - `ExpiresAt` DATETIME2 NOT NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_OTP_Identifier_Purpose` NONCLUSTERED (`Identifier`, `Purpose`, `ExpiresAt`)

---

## 2. Product Catalog, Categories & Brands Tables

### Table 8: `Brands`
- **Purpose**: Watch manufactures (Rolex, Omega, Patek Philippe, Audemars Piguet, etc.).
- **Columns**:
  - `BrandId` INT IDENTITY(1,1) PRIMARY KEY
  - `Slug` NVARCHAR(80) NOT NULL UNIQUE
  - `Name` NVARCHAR(100) NOT NULL UNIQUE
  - `OriginCountry` NVARCHAR(60) NOT NULL DEFAULT 'Switzerland'
  - `HeritageYear` INT NULL
  - `LogoUrl` NVARCHAR(500) NULL
  - `BannerUrl` NVARCHAR(500) NULL
  - `Description` NVARCHAR(MAX) NULL
  - `IsLuxuryTier` BIT NOT NULL DEFAULT 1
  - `IsActive` BIT NOT NULL DEFAULT 1

### Table 9: `Categories`
- **Purpose**: Watch classification (Luxury, Chronograph, Diver, Smartwatch, Classic, Skeleton).
- **Columns**:
  - `CategoryId` INT IDENTITY(1,1) PRIMARY KEY
  - `CategorySlug` NVARCHAR(80) NOT NULL UNIQUE
  - `Name` NVARCHAR(100) NOT NULL UNIQUE
  - `Description` NVARCHAR(MAX) NULL
  - `IconName` NVARCHAR(50) NULL
  - `BannerUrl` NVARCHAR(500) NULL
  - `ParentCategoryId` INT NULL FOREIGN KEY REFERENCES Categories(CategoryId)
  - `IsActive` BIT NOT NULL DEFAULT 1

### Table 10: `Products`
- **Purpose**: Individual horological timepiece master records.
- **Columns**:
  - `ProductId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `Sku` NVARCHAR(50) NOT NULL UNIQUE
  - `BrandId` INT NOT NULL FOREIGN KEY REFERENCES Brands(BrandId)
  - `CategoryId` INT NOT NULL FOREIGN KEY REFERENCES Categories(CategoryId)
  - `Name` NVARCHAR(200) NOT NULL
  - `SubTitle` NVARCHAR(255) NULL
  - `Gender` NVARCHAR(20) NOT NULL DEFAULT 'Men' CHECK (Gender IN ('Men', 'Women', 'Couple', 'Unisex', 'Kids'))
  - `MovementType` NVARCHAR(50) NOT NULL (e.g., 'Automatic', 'Manual-Wind', 'Quartz', 'Tourbillon')
  - `CaseMaterial` NVARCHAR(80) NOT NULL (e.g., 'Oystersteel', '18K Yellow Gold', 'Titanium')
  - `DialColor` NVARCHAR(50) NOT NULL
  - `StrapMaterial` NVARCHAR(80) NOT NULL
  - `WaterResistance` NVARCHAR(50) NOT NULL (e.g., '300m / 1,000ft')
  - `Price` DECIMAL(12, 2) NOT NULL CHECK (Price >= 0)
  - `OriginalPrice` DECIMAL(12, 2) NOT NULL CHECK (OriginalPrice >= 0)
  - `CostPrice` DECIMAL(12, 2) NOT NULL DEFAULT 0
  - `DiscountPercentage` DECIMAL(5, 2) NOT NULL DEFAULT 0
  - `LowStockThreshold` INT NOT NULL DEFAULT 5
  - `IsFeatured` BIT NOT NULL DEFAULT 0
  - `IsActive` BIT NOT NULL DEFAULT 1
  - `Description` NVARCHAR(MAX) NOT NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  - `UpdatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_Products_Sku` UNIQUE NONCLUSTERED (`Sku`)
  - `IX_Products_BrandId` NONCLUSTERED (`BrandId`)
  - `IX_Products_CategoryId` NONCLUSTERED (`CategoryId`)
  - `IX_Products_Price` NONCLUSTERED (`Price`)

### Table 11: `ProductImages`
- **Purpose**: High-definition watch galleries, dial closeups, and exhibition caseback photos.
- **Columns**:
  - `ImageId` INT IDENTITY(1,1) PRIMARY KEY
  - `ProductId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(ProductId) ON DELETE CASCADE
  - `ImageUrl` NVARCHAR(500) NOT NULL
  - `DisplayOrder` INT NOT NULL DEFAULT 0
  - `IsPrimary` BIT NOT NULL DEFAULT 0

---

## 3. Inventory, Warehouse & Stock Control Tables

### Table 12: `Warehouses`
- **Purpose**: Multi-location inventory depots (Main Luxury Vault, Regional Distribution Hubs).
- **Columns**:
  - `WarehouseId` INT IDENTITY(1,1) PRIMARY KEY
  - `WarehouseCode` NVARCHAR(30) NOT NULL UNIQUE
  - `Name` NVARCHAR(120) NOT NULL
  - `Address` NVARCHAR(255) NOT NULL
  - `City` NVARCHAR(80) NOT NULL
  - `State` NVARCHAR(80) NOT NULL
  - `ContactPhone` NVARCHAR(20) NOT NULL
  - `ManagerId` UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Users(UserId)
  - `IsActive` BIT NOT NULL DEFAULT 1

### Table 13: `Inventory`
- **Purpose**: Live stock levels mapped to specific warehouses.
- **Columns**:
  - `InventoryId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `ProductId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(ProductId)
  - `WarehouseId` INT NOT NULL FOREIGN KEY REFERENCES Warehouses(WarehouseId)
  - `CurrentStock` INT NOT NULL DEFAULT 0 CHECK (CurrentStock >= 0)
  - `ReservedStock` INT NOT NULL DEFAULT 0 CHECK (ReservedStock >= 0)
  - `AvailableStock` AS (CurrentStock - ReservedStock) PERSISTED
  - `LastRestockedAt` DATETIME2 NULL
  - `UpdatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  - CONSTRAINT `UQ_Product_Warehouse` UNIQUE (`ProductId`, `WarehouseId`)

### Table 14: `StockTransactions`
- **Purpose**: Immutable ledger tracking every physical watch movement (Inbound, Adjustment, Transfer, Order Reservation).
- **Columns**:
  - `TransactionId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `ProductId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(ProductId)
  - `WarehouseId` INT NOT NULL FOREIGN KEY REFERENCES Warehouses(WarehouseId)
  - `TransactionType` NVARCHAR(30) NOT NULL CHECK (TransactionType IN ('PURCHASE_INBOUND', 'SALES_DISPATCH', 'RESERVATION', 'RETURN_RESTOCK', 'ADJUSTMENT_WRITE_OFF', 'WAREHOUSE_TRANSFER'))
  - `QuantityChange` INT NOT NULL (Positive for additions, negative for deductions)
  - `ReferenceNumber` NVARCHAR(100) NULL (Order ID, PO number, or RMA number)
  - `PerformedByUserId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId)
  - `Notes` NVARCHAR(500) NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_StockTransactions_Product_Warehouse` NONCLUSTERED (`ProductId`, `WarehouseId`, `CreatedAt`)

---

## 4. Orders, Line Items & Payments Tables

### Table 15: `Orders`
- **Purpose**: Customer purchase transactions and fulfillment tracking.
- **Columns**:
  - `OrderId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `OrderNumber` NVARCHAR(50) NOT NULL UNIQUE (e.g., 'WH-2026-10482')
  - `CustomerId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId)
  - `ShippingAddressId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Addresses(AddressId)
  - `OrderStatus` NVARCHAR(30) NOT NULL DEFAULT 'Confirmed' CHECK (OrderStatus IN ('Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'))
  - `Subtotal` DECIMAL(12, 2) NOT NULL
  - `ShippingFee` DECIMAL(10, 2) NOT NULL DEFAULT 0
  - `DiscountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0
  - `TotalAmount` DECIMAL(12, 2) NOT NULL
  - `ShippingMethod` NVARCHAR(50) NOT NULL DEFAULT 'Armoured Transit'
  - `SpecialInstructions` NVARCHAR(500) NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  - `UpdatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_Orders_OrderNumber` UNIQUE NONCLUSTERED (`OrderNumber`)
  - `IX_Orders_CustomerId` NONCLUSTERED (`CustomerId`)
  - `IX_Orders_Status` NONCLUSTERED (`OrderStatus`)

### Table 16: `OrderItems`
- **Purpose**: Normalized individual line items within an order (replaces embedded array).
- **Columns**:
  - `OrderItemId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `OrderId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Orders(OrderId) ON DELETE CASCADE
  - `ProductId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Products(ProductId)
  - `UnitPrice` DECIMAL(12, 2) NOT NULL
  - `Quantity` INT NOT NULL DEFAULT 1 CHECK (Quantity > 0)
  - `TotalPrice` AS (UnitPrice * Quantity) PERSISTED
- **Indexes**:
  - `IX_OrderItems_OrderId` NONCLUSTERED (`OrderId`)

### Table 17: `Payments`
- **Purpose**: Razorpay transactions, webhooks, and refunds ledger.
- **Columns**:
  - `PaymentId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `OrderId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Orders(OrderId)
  - `RazorpayOrderId` NVARCHAR(100) NOT NULL UNIQUE
  - `RazorpayPaymentId` NVARCHAR(100) NULL UNIQUE
  - `RazorpaySignature` NVARCHAR(255) NULL
  - `Amount` DECIMAL(12, 2) NOT NULL
  - `Currency` NVARCHAR(10) NOT NULL DEFAULT 'INR'
  - `PaymentStatus` NVARCHAR(30) NOT NULL DEFAULT 'Created' CHECK (PaymentStatus IN ('Created', 'Pending', 'Authorized', 'Captured', 'Failed', 'Refunded', 'Partially Refunded'))
  - `PaymentMethod` NVARCHAR(40) NOT NULL DEFAULT 'UPI'
  - `FailureReason` NVARCHAR(500) NULL
  - `CapturedAt` DATETIME2 NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_Payments_OrderId` NONCLUSTERED (`OrderId`)
  - `IX_Payments_RazorpayOrderId` UNIQUE NONCLUSTERED (`RazorpayOrderId`)

---

## 5. Delivery, Logistics & Tracking Tables

### Table 18: `Deliveries`
- **Purpose**: Physical dispatch and shipment consignments.
- **Columns**:
  - `DeliveryId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `OrderId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Orders(OrderId)
  - `CourierPartner` NVARCHAR(80) NOT NULL DEFAULT 'BlueDart Express'
  - `TrackingNumber` NVARCHAR(100) NOT NULL UNIQUE
  - `AssignedRiderId` UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Users(UserId)
  - `DeliveryStatus` NVARCHAR(30) NOT NULL DEFAULT 'Scheduled' CHECK (DeliveryStatus IN ('Scheduled', 'In Transit', 'Out for Delivery', 'Attempted', 'Delivered', 'Returned'))
  - `DeliveryHandoverOtp` NVARCHAR(10) NOT NULL
  - `DispatchedAt` DATETIME2 NULL
  - `DeliveredAt` DATETIME2 NULL
  - `ProofOfDeliveryPhotoUrl` NVARCHAR(500) NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()

### Table 19: `DeliveryLocationPings`
- **Purpose**: High-frequency GPS breadcrumbs emitted by riders via Socket.IO (replaces `LocationHistory.js`).
- **Columns**:
  - `PingId` BIGINT IDENTITY(1,1) PRIMARY KEY
  - `DeliveryId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Deliveries(DeliveryId) ON DELETE CASCADE
  - `RiderId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId)
  - `Latitude` DECIMAL(10, 7) NOT NULL
  - `Longitude` DECIMAL(10, 7) NOT NULL
  - `SpeedKmh` DECIMAL(5, 2) NULL
  - `HeadingDegrees` DECIMAL(5, 2) NULL
  - `PingTimestamp` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_DeliveryLocationPings_DeliveryId` NONCLUSTERED (`DeliveryId`, `PingTimestamp` DESC)

---

## 6. Customer Support & System Auditing Tables

### Table 20: `SupportTickets`
- **Purpose**: Collector inquiry tickets, warranty claims, and escalation management.
- **Columns**:
  - `TicketId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `TicketNumber` NVARCHAR(30) NOT NULL UNIQUE (e.g., 'TKT-1092')
  - `CustomerId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId)
  - `OrderId` UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Orders(OrderId)
  - `Subject` NVARCHAR(200) NOT NULL
  - `Category` NVARCHAR(50) NOT NULL CHECK (Category IN ('Order Status', 'Delivery Delay', 'Watch Authenticity', 'Returns & Refunds', 'Warranty Service', 'Other'))
  - `Priority` NVARCHAR(20) NOT NULL DEFAULT 'Normal' CHECK (Priority IN ('Urgent', 'High', 'Normal', 'Low'))
  - `Status` NVARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (Status IN ('Open', 'In Progress', 'Pending Customer', 'Resolved', 'Closed'))
  - `AssignedAgentId` UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Users(UserId)
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
  - `UpdatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_SupportTickets_CustomerId` NONCLUSTERED (`CustomerId`)
  - `IX_SupportTickets_Status_Priority` NONCLUSTERED (`Status`, `Priority`)

### Table 21: `SupportMessages`
- **Purpose**: Individual chat messages and agent replies within a support ticket.
- **Columns**:
  - `MessageId` UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID()
  - `TicketId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES SupportTickets(TicketId) ON DELETE CASCADE
  - `SenderUserId` UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Users(UserId)
  - `MessageText` NVARCHAR(MAX) NOT NULL
  - `AttachmentUrl` NVARCHAR(500) NULL
  - `IsInternalNote` BIT NOT NULL DEFAULT 0
  - `SentAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()

### Table 22: `AuditLogs`
- **Purpose**: Security, price changes, role modifications, and administrative audit trails.
- **Columns**:
  - `AuditId` BIGINT IDENTITY(1,1) PRIMARY KEY
  - `PerformedByUserId` UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES Users(UserId)
  - `Action` NVARCHAR(80) NOT NULL
  - `ModuleName` NVARCHAR(60) NOT NULL
  - `TargetEntityId` NVARCHAR(100) NULL
  - `DetailsJson` NVARCHAR(MAX) NULL
  - `IpAddress` NVARCHAR(50) NULL
  - `CreatedAt` DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
- **Indexes**:
  - `IX_AuditLogs_Module_CreatedAt` NONCLUSTERED (`ModuleName`, `CreatedAt` DESC)
