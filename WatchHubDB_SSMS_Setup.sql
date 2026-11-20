-- ==============================================================================
-- WATCHHUB ATELIER — COMPLETE MICROSOFT SQL SERVER 2025 DATABASE SETUP SCRIPT
-- Compatible with: SQL Server Management Studio (SSMS), Azure Data Studio, sqlcmd
-- Target Database: WatchHubDB
-- ==============================================================================

USE [master];
GO

-- 1. CREATE DATABASE
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'WatchHubDB')
BEGIN
    CREATE DATABASE [WatchHubDB];
    PRINT 'Database WatchHubDB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database WatchHubDB already exists.';
END
GO

USE [WatchHubDB];
GO

-- 2. CREATE SCHEMA
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo')
BEGIN
    EXEC sp_executesql N'CREATE SCHEMA [dbo];';
END
GO

-- 3. CREATE TABLES
-- ==============================================================================

-- 3.1 Roles Table
IF OBJECT_ID(N'[dbo].[Roles]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Roles] (
        [RoleId] INT NOT NULL IDENTITY(1,1),
        [RoleName] NVARCHAR(50) NOT NULL,
        [Description] NVARCHAR(255),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Roles_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Roles_pkey] PRIMARY KEY CLUSTERED ([RoleId]),
        CONSTRAINT [Roles_RoleName_key] UNIQUE NONCLUSTERED ([RoleName])
    );
END
GO

-- 3.2 Permissions Table
IF OBJECT_ID(N'[dbo].[Permissions]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Permissions] (
        [PermissionId] INT NOT NULL IDENTITY(1,1),
        [PermissionCode] NVARCHAR(100) NOT NULL,
        [ModuleName] NVARCHAR(50) NOT NULL,
        [Description] NVARCHAR(255),
        CONSTRAINT [Permissions_pkey] PRIMARY KEY CLUSTERED ([PermissionId]),
        CONSTRAINT [Permissions_PermissionCode_key] UNIQUE NONCLUSTERED ([PermissionCode])
    );
END
GO

-- 3.3 RolePermissions Mapping Table
IF OBJECT_ID(N'[dbo].[RolePermissions]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[RolePermissions] (
        [RoleId] INT NOT NULL,
        [PermissionId] INT NOT NULL,
        CONSTRAINT [RolePermissions_pkey] PRIMARY KEY CLUSTERED ([RoleId],[PermissionId])
    );
END
GO

-- 3.4 Users Table
IF OBJECT_ID(N'[dbo].[Users]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Users] (
        [UserId] NVARCHAR(1000) NOT NULL,
        [FullName] NVARCHAR(120) NOT NULL,
        [Email] NVARCHAR(255) NOT NULL,
        [Phone] NVARCHAR(20),
        [PasswordHash] NVARCHAR(255) NOT NULL,
        [AvatarUrl] NVARCHAR(500),
        [IsActive] BIT NOT NULL CONSTRAINT [Users_IsActive_df] DEFAULT 1,
        [IsEmailVerified] BIT NOT NULL CONSTRAINT [Users_IsEmailVerified_df] DEFAULT 0,
        [IsPhoneVerified] BIT NOT NULL CONSTRAINT [Users_IsPhoneVerified_df] DEFAULT 0,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Users_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Users_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([UserId]),
        CONSTRAINT [Users_Email_key] UNIQUE NONCLUSTERED ([Email]),
        CONSTRAINT [Users_Phone_key] UNIQUE NONCLUSTERED ([Phone])
    );
    CREATE NONCLUSTERED INDEX [IX_Users_Email] ON [dbo].[Users]([Email]);
    CREATE NONCLUSTERED INDEX [IX_Users_Phone] ON [dbo].[Users]([Phone]);
END
GO

-- 3.5 UserRoles Mapping Table
IF OBJECT_ID(N'[dbo].[UserRoles]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[UserRoles] (
        [UserId] NVARCHAR(1000) NOT NULL,
        [RoleId] INT NOT NULL,
        [AssignedAt] DATETIME2 NOT NULL CONSTRAINT [UserRoles_AssignedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [UserRoles_pkey] PRIMARY KEY CLUSTERED ([UserId],[RoleId])
    );
END
GO

-- 3.6 Addresses Table
IF OBJECT_ID(N'[dbo].[Addresses]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Addresses] (
        [AddressId] NVARCHAR(1000) NOT NULL,
        [UserId] NVARCHAR(1000) NOT NULL,
        [FullName] NVARCHAR(120) NOT NULL,
        [Street] NVARCHAR(255) NOT NULL,
        [Apartment] NVARCHAR(100),
        [Landmark] NVARCHAR(150),
        [City] NVARCHAR(80) NOT NULL,
        [State] NVARCHAR(80) NOT NULL,
        [Pincode] NVARCHAR(10) NOT NULL,
        [Country] NVARCHAR(60) NOT NULL CONSTRAINT [Addresses_Country_df] DEFAULT 'India',
        [Phone] NVARCHAR(20) NOT NULL,
        [AddressType] NVARCHAR(20) NOT NULL CONSTRAINT [Addresses_AddressType_df] DEFAULT 'Home',
        [Latitude] DECIMAL(10,7),
        [Longitude] DECIMAL(10,7),
        [IsDefault] BIT NOT NULL CONSTRAINT [Addresses_IsDefault_df] DEFAULT 0,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Addresses_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Addresses_pkey] PRIMARY KEY CLUSTERED ([AddressId])
    );
    CREATE NONCLUSTERED INDEX [IX_Addresses_UserId] ON [dbo].[Addresses]([UserId]);
END
GO

-- 3.7 OTPVerifications Table (V3 Enterprise Persistence Architecture)
IF OBJECT_ID(N'[dbo].[OTPVerifications]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[OTPVerifications] (
        [OtpId] NVARCHAR(1000) NOT NULL,
        [Identifier] NVARCHAR(255) NOT NULL,
        [OtpHash] NVARCHAR(128) NOT NULL,
        [Channel] NVARCHAR(20) NOT NULL,
        [Purpose] NVARCHAR(40) NOT NULL,
        [Attempts] INT NOT NULL CONSTRAINT [OTPVerifications_Attempts_df] DEFAULT 0,
        [IsVerified] BIT NOT NULL CONSTRAINT [OTPVerifications_IsVerified_df] DEFAULT 0,
        [DispatchToken] NVARCHAR(64) NULL,
        [DispatchState] NVARCHAR(20) NOT NULL CONSTRAINT [DF_OTPVerifications_DispatchState] DEFAULT 'ACTIVE',
        [DispatchLockedUntil] DATETIME2 NULL,
        [ResendCooldownUntil] DATETIME2 NOT NULL,
        [ExpiresAt] DATETIME2 NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [OTPVerifications_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [OTPVerifications_pkey] PRIMARY KEY CLUSTERED ([OtpId]),
        CONSTRAINT [UQ_OTPVerifications_Identifier_Purpose] UNIQUE NONCLUSTERED ([Identifier], [Purpose])
    );
    CREATE NONCLUSTERED INDEX [IX_OTP_Identifier_Purpose] ON [dbo].[OTPVerifications]([Identifier], [Purpose], [ExpiresAt]);
    CREATE NONCLUSTERED INDEX [IX_OTP_ExpiresAt] ON [dbo].[OTPVerifications]([ExpiresAt]);
    CREATE NONCLUSTERED INDEX [IX_OTP_DispatchLockedUntil] ON [dbo].[OTPVerifications]([DispatchLockedUntil]);
END
GO

-- 3.8 Brands Table
IF OBJECT_ID(N'[dbo].[Brands]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Brands] (
        [BrandId] INT NOT NULL IDENTITY(1,1),
        [Slug] NVARCHAR(80) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [OriginCountry] NVARCHAR(60) NOT NULL CONSTRAINT [Brands_OriginCountry_df] DEFAULT 'Switzerland',
        [HeritageYear] INT,
        [LogoUrl] NVARCHAR(500),
        [BannerUrl] NVARCHAR(500),
        [Description] NVARCHAR(max),
        [IsLuxuryTier] BIT NOT NULL CONSTRAINT [Brands_IsLuxuryTier_df] DEFAULT 1,
        [IsActive] BIT NOT NULL CONSTRAINT [Brands_IsActive_df] DEFAULT 1,
        CONSTRAINT [Brands_pkey] PRIMARY KEY CLUSTERED ([BrandId]),
        CONSTRAINT [Brands_Slug_key] UNIQUE NONCLUSTERED ([Slug]),
        CONSTRAINT [Brands_Name_key] UNIQUE NONCLUSTERED ([Name])
    );
END
GO

-- 3.9 Categories Table
IF OBJECT_ID(N'[dbo].[Categories]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Categories] (
        [CategoryId] INT NOT NULL IDENTITY(1,1),
        [CategorySlug] NVARCHAR(80) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [Description] NVARCHAR(max),
        [IconName] NVARCHAR(50),
        [BannerUrl] NVARCHAR(500),
        [ParentCategoryId] INT,
        [IsActive] BIT NOT NULL CONSTRAINT [Categories_IsActive_df] DEFAULT 1,
        CONSTRAINT [Categories_pkey] PRIMARY KEY CLUSTERED ([CategoryId]),
        CONSTRAINT [Categories_CategorySlug_key] UNIQUE NONCLUSTERED ([CategorySlug]),
        CONSTRAINT [Categories_Name_key] UNIQUE NONCLUSTERED ([Name])
    );
END
GO

-- 3.10 Products Table
IF OBJECT_ID(N'[dbo].[Products]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Products] (
        [ProductId] NVARCHAR(1000) NOT NULL,
        [Sku] NVARCHAR(50) NOT NULL,
        [BrandId] INT NOT NULL,
        [CategoryId] INT NOT NULL,
        [Name] NVARCHAR(200) NOT NULL,
        [SubTitle] NVARCHAR(255),
        [Gender] NVARCHAR(20) NOT NULL CONSTRAINT [Products_Gender_df] DEFAULT 'Men',
        [MovementType] NVARCHAR(50) NOT NULL,
        [CaseMaterial] NVARCHAR(80) NOT NULL,
        [DialColor] NVARCHAR(50) NOT NULL,
        [StrapMaterial] NVARCHAR(80) NOT NULL,
        [WaterResistance] NVARCHAR(50) NOT NULL,
        [Price] DECIMAL(12,2) NOT NULL,
        [OriginalPrice] DECIMAL(12,2) NOT NULL,
        [CostPrice] DECIMAL(12,2) NOT NULL CONSTRAINT [Products_CostPrice_df] DEFAULT 0,
        [DiscountPercentage] DECIMAL(5,2) NOT NULL CONSTRAINT [Products_DiscountPercentage_df] DEFAULT 0,
        [LowStockThreshold] INT NOT NULL CONSTRAINT [Products_LowStockThreshold_df] DEFAULT 5,
        [IsFeatured] BIT NOT NULL CONSTRAINT [Products_IsFeatured_df] DEFAULT 0,
        [IsActive] BIT NOT NULL CONSTRAINT [Products_IsActive_df] DEFAULT 1,
        [Description] NVARCHAR(max) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Products_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Products_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Products_pkey] PRIMARY KEY CLUSTERED ([ProductId]),
        CONSTRAINT [Products_Sku_key] UNIQUE NONCLUSTERED ([Sku])
    );
    CREATE NONCLUSTERED INDEX [IX_Products_Sku] ON [dbo].[Products]([Sku]);
    CREATE NONCLUSTERED INDEX [IX_Products_BrandId] ON [dbo].[Products]([BrandId]);
    CREATE NONCLUSTERED INDEX [IX_Products_CategoryId] ON [dbo].[Products]([CategoryId]);
    CREATE NONCLUSTERED INDEX [IX_Products_Price] ON [dbo].[Products]([Price]);
END
GO

-- 3.11 ProductImages Table
IF OBJECT_ID(N'[dbo].[ProductImages]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ProductImages] (
        [ImageId] INT NOT NULL IDENTITY(1,1),
        [ProductId] NVARCHAR(1000) NOT NULL,
        [ImageUrl] NVARCHAR(500) NOT NULL,
        [DisplayOrder] INT NOT NULL CONSTRAINT [ProductImages_DisplayOrder_df] DEFAULT 0,
        [IsPrimary] BIT NOT NULL CONSTRAINT [ProductImages_IsPrimary_df] DEFAULT 0,
        CONSTRAINT [ProductImages_pkey] PRIMARY KEY CLUSTERED ([ImageId])
    );
    CREATE NONCLUSTERED INDEX [IX_ProductImages_ProductId] ON [dbo].[ProductImages]([ProductId]);
END
GO

-- 3.12 Warehouses Table
IF OBJECT_ID(N'[dbo].[Warehouses]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Warehouses] (
        [WarehouseId] INT NOT NULL IDENTITY(1,1),
        [WarehouseCode] NVARCHAR(30) NOT NULL,
        [Name] NVARCHAR(120) NOT NULL,
        [Address] NVARCHAR(255) NOT NULL,
        [City] NVARCHAR(80) NOT NULL,
        [State] NVARCHAR(80) NOT NULL,
        [ContactPhone] NVARCHAR(20) NOT NULL,
        [ManagerId] NVARCHAR(1000),
        [IsActive] BIT NOT NULL CONSTRAINT [Warehouses_IsActive_df] DEFAULT 1,
        CONSTRAINT [Warehouses_pkey] PRIMARY KEY CLUSTERED ([WarehouseId]),
        CONSTRAINT [Warehouses_WarehouseCode_key] UNIQUE NONCLUSTERED ([WarehouseCode])
    );
END
GO

-- 3.13 Inventory Table
IF OBJECT_ID(N'[dbo].[Inventory]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Inventory] (
        [InventoryId] NVARCHAR(1000) NOT NULL,
        [ProductId] NVARCHAR(1000) NOT NULL,
        [WarehouseId] INT NOT NULL,
        [CurrentStock] INT NOT NULL CONSTRAINT [Inventory_CurrentStock_df] DEFAULT 0,
        [ReservedStock] INT NOT NULL CONSTRAINT [Inventory_ReservedStock_df] DEFAULT 0,
        [LastRestockedAt] DATETIME2,
        [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Inventory_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Inventory_pkey] PRIMARY KEY CLUSTERED ([InventoryId]),
        CONSTRAINT [Inventory_ProductId_WarehouseId_key] UNIQUE NONCLUSTERED ([ProductId],[WarehouseId])
    );
END
GO

-- 3.14 StockTransactions Table
IF OBJECT_ID(N'[dbo].[StockTransactions]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[StockTransactions] (
        [TransactionId] NVARCHAR(1000) NOT NULL,
        [ProductId] NVARCHAR(1000) NOT NULL,
        [WarehouseId] INT NOT NULL,
        [TransactionType] NVARCHAR(30) NOT NULL,
        [QuantityChange] INT NOT NULL,
        [ReferenceNumber] NVARCHAR(100),
        [PerformedByUserId] NVARCHAR(1000) NOT NULL,
        [Notes] NVARCHAR(500),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [StockTransactions_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [StockTransactions_pkey] PRIMARY KEY CLUSTERED ([TransactionId])
    );
    CREATE NONCLUSTERED INDEX [IX_StockTransactions_Product_Warehouse] ON [dbo].[StockTransactions]([ProductId], [WarehouseId], [CreatedAt]);
END
GO

-- 3.15 Coupons Table
IF OBJECT_ID(N'[dbo].[Coupons]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Coupons] (
        [CouponId] INT NOT NULL IDENTITY(1,1),
        [Code] NVARCHAR(50) NOT NULL,
        [DiscountPercentage] DECIMAL(5,2) NOT NULL,
        [MaxDiscountAmount] DECIMAL(10,2),
        [MinOrderAmount] DECIMAL(12,2) NOT NULL CONSTRAINT [Coupons_MinOrderAmount_df] DEFAULT 0,
        [ValidFrom] DATETIME2 NOT NULL,
        [ValidUntil] DATETIME2 NOT NULL,
        [UsageLimit] INT NOT NULL CONSTRAINT [Coupons_UsageLimit_df] DEFAULT 1000,
        [TimesUsed] INT NOT NULL CONSTRAINT [Coupons_TimesUsed_df] DEFAULT 0,
        [IsActive] BIT NOT NULL CONSTRAINT [Coupons_IsActive_df] DEFAULT 1,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Coupons_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Coupons_pkey] PRIMARY KEY CLUSTERED ([CouponId]),
        CONSTRAINT [Coupons_Code_key] UNIQUE NONCLUSTERED ([Code])
    );
END
GO

-- 3.16 Orders Table
IF OBJECT_ID(N'[dbo].[Orders]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Orders] (
        [OrderId] NVARCHAR(1000) NOT NULL,
        [OrderNumber] NVARCHAR(50) NOT NULL,
        [CustomerId] NVARCHAR(1000) NOT NULL,
        [ShippingAddressId] NVARCHAR(1000) NOT NULL,
        [OrderStatus] NVARCHAR(30) NOT NULL CONSTRAINT [Orders_OrderStatus_df] DEFAULT 'Confirmed',
        [Subtotal] DECIMAL(12,2) NOT NULL,
        [ShippingFee] DECIMAL(10,2) NOT NULL CONSTRAINT [Orders_ShippingFee_df] DEFAULT 0,
        [DiscountAmount] DECIMAL(10,2) NOT NULL CONSTRAINT [Orders_DiscountAmount_df] DEFAULT 0,
        [TotalAmount] DECIMAL(12,2) NOT NULL,
        [ShippingMethod] NVARCHAR(50) NOT NULL CONSTRAINT [Orders_ShippingMethod_df] DEFAULT 'Armoured Transit',
        [SpecialInstructions] NVARCHAR(500),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Orders_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [Orders_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Orders_pkey] PRIMARY KEY CLUSTERED ([OrderId]),
        CONSTRAINT [Orders_OrderNumber_key] UNIQUE NONCLUSTERED ([OrderNumber])
    );
    CREATE NONCLUSTERED INDEX [IX_Orders_OrderNumber] ON [dbo].[Orders]([OrderNumber]);
    CREATE NONCLUSTERED INDEX [IX_Orders_CustomerId] ON [dbo].[Orders]([CustomerId]);
    CREATE NONCLUSTERED INDEX [IX_Orders_Status] ON [dbo].[Orders]([OrderStatus]);
END
GO

-- 3.17 OrderItems Table
IF OBJECT_ID(N'[dbo].[OrderItems]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[OrderItems] (
        [OrderItemId] NVARCHAR(1000) NOT NULL,
        [OrderId] NVARCHAR(1000) NOT NULL,
        [ProductId] NVARCHAR(1000) NOT NULL,
        [UnitPrice] DECIMAL(12,2) NOT NULL,
        [Quantity] INT NOT NULL CONSTRAINT [OrderItems_Quantity_df] DEFAULT 1,
        CONSTRAINT [OrderItems_pkey] PRIMARY KEY CLUSTERED ([OrderItemId])
    );
    CREATE NONCLUSTERED INDEX [IX_OrderItems_OrderId] ON [dbo].[OrderItems]([OrderId]);
END
GO

-- 3.18 Payments Table
IF OBJECT_ID(N'[dbo].[Payments]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Payments] (
        [PaymentId] NVARCHAR(1000) NOT NULL,
        [OrderId] NVARCHAR(1000) NOT NULL,
        [RazorpayOrderId] NVARCHAR(100) NOT NULL,
        [RazorpayPaymentId] NVARCHAR(100),
        [RazorpaySignature] NVARCHAR(255),
        [Amount] DECIMAL(12,2) NOT NULL,
        [Currency] NVARCHAR(10) NOT NULL CONSTRAINT [Payments_Currency_df] DEFAULT 'INR',
        [PaymentStatus] NVARCHAR(30) NOT NULL CONSTRAINT [Payments_PaymentStatus_df] DEFAULT 'Created',
        [PaymentMethod] NVARCHAR(40) NOT NULL CONSTRAINT [Payments_PaymentMethod_df] DEFAULT 'UPI',
        [FailureReason] NVARCHAR(500),
        [CapturedAt] DATETIME2,
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Payments_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Payments_pkey] PRIMARY KEY CLUSTERED ([PaymentId]),
        CONSTRAINT [Payments_RazorpayOrderId_key] UNIQUE NONCLUSTERED ([RazorpayOrderId]),
        CONSTRAINT [Payments_RazorpayPaymentId_key] UNIQUE NONCLUSTERED ([RazorpayPaymentId])
    );
    CREATE NONCLUSTERED INDEX [IX_Payments_OrderId] ON [dbo].[Payments]([OrderId]);
    CREATE NONCLUSTERED INDEX [IX_Payments_RazorpayOrderId] ON [dbo].[Payments]([RazorpayOrderId]);
END
GO

-- 3.19 Deliveries Table
IF OBJECT_ID(N'[dbo].[Deliveries]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Deliveries] (
        [DeliveryId] NVARCHAR(1000) NOT NULL,
        [OrderId] NVARCHAR(1000) NOT NULL,
        [CourierPartner] NVARCHAR(80) NOT NULL CONSTRAINT [Deliveries_CourierPartner_df] DEFAULT 'BlueDart Express',
        [TrackingNumber] NVARCHAR(100) NOT NULL,
        [AssignedRiderId] NVARCHAR(1000),
        [DeliveryStatus] NVARCHAR(30) NOT NULL CONSTRAINT [Deliveries_DeliveryStatus_df] DEFAULT 'Scheduled',
        [DeliveryHandoverOtp] NVARCHAR(10) NOT NULL,
        [DispatchedAt] DATETIME2,
        [DeliveredAt] DATETIME2,
        [ProofOfDeliveryPhotoUrl] NVARCHAR(500),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Deliveries_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [Deliveries_pkey] PRIMARY KEY CLUSTERED ([DeliveryId]),
        CONSTRAINT [Deliveries_TrackingNumber_key] UNIQUE NONCLUSTERED ([TrackingNumber])
    );
END
GO

-- 3.20 DeliveryLocationPings Table
IF OBJECT_ID(N'[dbo].[DeliveryLocationPings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[DeliveryLocationPings] (
        [PingId] BIGINT NOT NULL IDENTITY(1,1),
        [DeliveryId] NVARCHAR(1000) NOT NULL,
        [RiderId] NVARCHAR(1000) NOT NULL,
        [Latitude] DECIMAL(10,7) NOT NULL,
        [Longitude] DECIMAL(10,7) NOT NULL,
        [SpeedKmh] DECIMAL(5,2),
        [HeadingDegrees] DECIMAL(5,2),
        [PingTimestamp] DATETIME2 NOT NULL CONSTRAINT [DeliveryLocationPings_PingTimestamp_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [DeliveryLocationPings_pkey] PRIMARY KEY CLUSTERED ([PingId])
    );
    CREATE NONCLUSTERED INDEX [IX_DeliveryLocationPings_DeliveryId] ON [dbo].[DeliveryLocationPings]([DeliveryId], [PingTimestamp]);
END
GO

-- 3.21 SupportTickets Table
IF OBJECT_ID(N'[dbo].[SupportTickets]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[SupportTickets] (
        [TicketId] NVARCHAR(1000) NOT NULL,
        [TicketNumber] NVARCHAR(30) NOT NULL,
        [CustomerId] NVARCHAR(1000) NOT NULL,
        [OrderId] NVARCHAR(1000),
        [Subject] NVARCHAR(200) NOT NULL,
        [Category] NVARCHAR(50) NOT NULL,
        [Priority] NVARCHAR(20) NOT NULL CONSTRAINT [SupportTickets_Priority_df] DEFAULT 'Normal',
        [Status] NVARCHAR(20) NOT NULL CONSTRAINT [SupportTickets_Status_df] DEFAULT 'Open',
        [AssignedAgentId] NVARCHAR(1000),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [SupportTickets_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [SupportTickets_UpdatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [SupportTickets_pkey] PRIMARY KEY CLUSTERED ([TicketId]),
        CONSTRAINT [SupportTickets_TicketNumber_key] UNIQUE NONCLUSTERED ([TicketNumber])
    );
    CREATE NONCLUSTERED INDEX [IX_SupportTickets_CustomerId] ON [dbo].[SupportTickets]([CustomerId]);
    CREATE NONCLUSTERED INDEX [IX_SupportTickets_Status_Priority] ON [dbo].[SupportTickets]([Status], [Priority]);
END
GO

-- 3.22 SupportMessages Table
IF OBJECT_ID(N'[dbo].[SupportMessages]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[SupportMessages] (
        [MessageId] NVARCHAR(1000) NOT NULL,
        [TicketId] NVARCHAR(1000) NOT NULL,
        [SenderUserId] NVARCHAR(1000) NOT NULL,
        [MessageText] NVARCHAR(max) NOT NULL,
        [AttachmentUrl] NVARCHAR(500),
        [IsInternalNote] BIT NOT NULL CONSTRAINT [SupportMessages_IsInternalNote_df] DEFAULT 0,
        [SentAt] DATETIME2 NOT NULL CONSTRAINT [SupportMessages_SentAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [SupportMessages_pkey] PRIMARY KEY CLUSTERED ([MessageId])
    );
END
GO

-- 3.23 AuditLogs Table
IF OBJECT_ID(N'[dbo].[AuditLogs]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[AuditLogs] (
        [AuditId] BIGINT NOT NULL IDENTITY(1,1),
        [PerformedByUserId] NVARCHAR(1000),
        [Action] NVARCHAR(80) NOT NULL,
        [ModuleName] NVARCHAR(60) NOT NULL,
        [TargetEntityId] NVARCHAR(100),
        [DetailsJson] NVARCHAR(max),
        [IpAddress] NVARCHAR(50),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [AuditLogs_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [AuditLogs_pkey] PRIMARY KEY CLUSTERED ([AuditId])
    );
    CREATE NONCLUSTERED INDEX [IX_AuditLogs_Module_CreatedAt] ON [dbo].[AuditLogs]([ModuleName], [CreatedAt]);
END
GO

-- ==============================================================================
-- 4. FOREIGN KEY CONSTRAINTS
-- ==============================================================================

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'RolePermissions_RoleId_fkey')
    ALTER TABLE [dbo].[RolePermissions] ADD CONSTRAINT [RolePermissions_RoleId_fkey] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles]([RoleId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'RolePermissions_PermissionId_fkey')
    ALTER TABLE [dbo].[RolePermissions] ADD CONSTRAINT [RolePermissions_PermissionId_fkey] FOREIGN KEY ([PermissionId]) REFERENCES [dbo].[Permissions]([PermissionId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'UserRoles_UserId_fkey')
    ALTER TABLE [dbo].[UserRoles] ADD CONSTRAINT [UserRoles_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'UserRoles_RoleId_fkey')
    ALTER TABLE [dbo].[UserRoles] ADD CONSTRAINT [UserRoles_RoleId_fkey] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Roles]([RoleId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Addresses_UserId_fkey')
    ALTER TABLE [dbo].[Addresses] ADD CONSTRAINT [Addresses_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Categories_ParentCategoryId_fkey')
    ALTER TABLE [dbo].[Categories] ADD CONSTRAINT [Categories_ParentCategoryId_fkey] FOREIGN KEY ([ParentCategoryId]) REFERENCES [dbo].[Categories]([CategoryId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Products_BrandId_fkey')
    ALTER TABLE [dbo].[Products] ADD CONSTRAINT [Products_BrandId_fkey] FOREIGN KEY ([BrandId]) REFERENCES [dbo].[Brands]([BrandId]) ON DELETE NO ACTION ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Products_CategoryId_fkey')
    ALTER TABLE [dbo].[Products] ADD CONSTRAINT [Products_CategoryId_fkey] FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[Categories]([CategoryId]) ON DELETE NO ACTION ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'ProductImages_ProductId_fkey')
    ALTER TABLE [dbo].[ProductImages] ADD CONSTRAINT [ProductImages_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products]([ProductId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Warehouses_ManagerId_fkey')
    ALTER TABLE [dbo].[Warehouses] ADD CONSTRAINT [Warehouses_ManagerId_fkey] FOREIGN KEY ([ManagerId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE SET NULL ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Inventory_ProductId_fkey')
    ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Inventory_WarehouseId_fkey')
    ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [Inventory_WarehouseId_fkey] FOREIGN KEY ([WarehouseId]) REFERENCES [dbo].[Warehouses]([WarehouseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'StockTransactions_ProductId_fkey')
    ALTER TABLE [dbo].[StockTransactions] ADD CONSTRAINT [StockTransactions_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products]([ProductId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'StockTransactions_WarehouseId_fkey')
    ALTER TABLE [dbo].[StockTransactions] ADD CONSTRAINT [StockTransactions_WarehouseId_fkey] FOREIGN KEY ([WarehouseId]) REFERENCES [dbo].[Warehouses]([WarehouseId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'StockTransactions_PerformedByUserId_fkey')
    ALTER TABLE [dbo].[StockTransactions] ADD CONSTRAINT [StockTransactions_PerformedByUserId_fkey] FOREIGN KEY ([PerformedByUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Orders_CustomerId_fkey')
    ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_CustomerId_fkey] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Orders_ShippingAddressId_fkey')
    ALTER TABLE [dbo].[Orders] ADD CONSTRAINT [Orders_ShippingAddressId_fkey] FOREIGN KEY ([ShippingAddressId]) REFERENCES [dbo].[Addresses]([AddressId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'OrderItems_OrderId_fkey')
    ALTER TABLE [dbo].[OrderItems] ADD CONSTRAINT [OrderItems_OrderId_fkey] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders]([OrderId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'OrderItems_ProductId_fkey')
    ALTER TABLE [dbo].[OrderItems] ADD CONSTRAINT [OrderItems_ProductId_fkey] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Products]([ProductId]) ON DELETE NO ACTION ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Payments_OrderId_fkey')
    ALTER TABLE [dbo].[Payments] ADD CONSTRAINT [Payments_OrderId_fkey] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders]([OrderId]) ON DELETE NO ACTION ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Deliveries_OrderId_fkey')
    ALTER TABLE [dbo].[Deliveries] ADD CONSTRAINT [Deliveries_OrderId_fkey] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders]([OrderId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'Deliveries_AssignedRiderId_fkey')
    ALTER TABLE [dbo].[Deliveries] ADD CONSTRAINT [Deliveries_AssignedRiderId_fkey] FOREIGN KEY ([AssignedRiderId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'DeliveryLocationPings_DeliveryId_fkey')
    ALTER TABLE [dbo].[DeliveryLocationPings] ADD CONSTRAINT [DeliveryLocationPings_DeliveryId_fkey] FOREIGN KEY ([DeliveryId]) REFERENCES [dbo].[Deliveries]([DeliveryId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'DeliveryLocationPings_RiderId_fkey')
    ALTER TABLE [dbo].[DeliveryLocationPings] ADD CONSTRAINT [DeliveryLocationPings_RiderId_fkey] FOREIGN KEY ([RiderId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'SupportTickets_CustomerId_fkey')
    ALTER TABLE [dbo].[SupportTickets] ADD CONSTRAINT [SupportTickets_CustomerId_fkey] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'SupportTickets_OrderId_fkey')
    ALTER TABLE [dbo].[SupportTickets] ADD CONSTRAINT [SupportTickets_OrderId_fkey] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders]([OrderId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'SupportTickets_AssignedAgentId_fkey')
    ALTER TABLE [dbo].[SupportTickets] ADD CONSTRAINT [SupportTickets_AssignedAgentId_fkey] FOREIGN KEY ([AssignedAgentId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'SupportMessages_TicketId_fkey')
    ALTER TABLE [dbo].[SupportMessages] ADD CONSTRAINT [SupportMessages_TicketId_fkey] FOREIGN KEY ([TicketId]) REFERENCES [dbo].[SupportTickets]([TicketId]) ON DELETE CASCADE ON UPDATE CASCADE;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'SupportMessages_SenderUserId_fkey')
    ALTER TABLE [dbo].[SupportMessages] ADD CONSTRAINT [SupportMessages_SenderUserId_fkey] FOREIGN KEY ([SenderUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE NO ACTION ON UPDATE NO ACTION;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'AuditLogs_PerformedByUserId_fkey')
    ALTER TABLE [dbo].[AuditLogs] ADD CONSTRAINT [AuditLogs_PerformedByUserId_fkey] FOREIGN KEY ([PerformedByUserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE SET NULL ON UPDATE CASCADE;
GO

PRINT 'WatchHubDB schema, tables, indexes, and constraints successfully initialized.';
GO
