-- ============================================================================
-- WatchHub V3 Forward-Only SQL Server Migration Script
-- Target Database: Microsoft SQL Server 2025 (WatchHubDB)
-- Purpose: Add distributed reservation columns, compound uniqueness, and indexes
-- Safety: Non-destructive, idempotent, preserves all existing table data
-- ============================================================================

USE [WatchHubDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

PRINT 'Starting WatchHub V3 OTP Persistence Schema Migration...';
GO

-- 1. Add DispatchToken column
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchToken'
)
BEGIN
    ALTER TABLE [dbo].[OTPVerifications] ADD [DispatchToken] NVARCHAR(64) NULL;
    PRINT 'Added column [DispatchToken].';
END
ELSE
BEGIN
    PRINT 'Column [DispatchToken] already exists.';
END
GO

-- 2. Add DispatchState column with default constraint
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchState'
)
BEGIN
    ALTER TABLE [dbo].[OTPVerifications] ADD [DispatchState] NVARCHAR(20) NOT NULL 
        CONSTRAINT [DF_OTPVerifications_DispatchState] DEFAULT 'ACTIVE';
    PRINT 'Added column [DispatchState] with default ACTIVE.';
END
ELSE
BEGIN
    PRINT 'Column [DispatchState] already exists.';
END
GO

-- 3. Add DispatchLockedUntil column
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchLockedUntil'
)
BEGIN
    ALTER TABLE [dbo].[OTPVerifications] ADD [DispatchLockedUntil] DATETIME2 NULL;
    PRINT 'Added column [DispatchLockedUntil].';
END
ELSE
BEGIN
    PRINT 'Column [DispatchLockedUntil] already exists.';
END
GO

-- 4. Add Unique Constraint on (Identifier, Purpose)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes 
    WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'UQ_OTPVerifications_Identifier_Purpose'
)
BEGIN
    ALTER TABLE [dbo].[OTPVerifications] 
        ADD CONSTRAINT [UQ_OTPVerifications_Identifier_Purpose] UNIQUE ([Identifier], [Purpose]);
    PRINT 'Added unique constraint [UQ_OTPVerifications_Identifier_Purpose].';
END
ELSE
BEGIN
    PRINT 'Unique constraint [UQ_OTPVerifications_Identifier_Purpose] already exists.';
END
GO

-- 5. Add Nonclustered Index on ExpiresAt
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes 
    WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'IX_OTP_ExpiresAt'
)
BEGIN
    CREATE NONCLUSTERED INDEX [IX_OTP_ExpiresAt] ON [dbo].[OTPVerifications] ([ExpiresAt]);
    PRINT 'Created index [IX_OTP_ExpiresAt].';
END
ELSE
BEGIN
    PRINT 'Index [IX_OTP_ExpiresAt] already exists.';
END
GO

-- 6. Add Nonclustered Index on DispatchLockedUntil
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes 
    WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'IX_OTP_DispatchLockedUntil'
)
BEGIN
    CREATE NONCLUSTERED INDEX [IX_OTP_DispatchLockedUntil] ON [dbo].[OTPVerifications] ([DispatchLockedUntil]);
    PRINT 'Created index [IX_OTP_DispatchLockedUntil].';
END
ELSE
BEGIN
    PRINT 'Index [IX_OTP_DispatchLockedUntil] already exists.';
END
GO

PRINT 'WatchHub V3 OTP Persistence Schema Migration Completed Successfully.';
GO

-- ============================================================================
-- SAFE ROLLBACK PROCEDURE (Documented Only - Do NOT Execute in Production)
-- ============================================================================
/*
IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'IX_OTP_DispatchLockedUntil')
    DROP INDEX [IX_OTP_DispatchLockedUntil] ON [dbo].[OTPVerifications];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'IX_OTP_ExpiresAt')
    DROP INDEX [IX_OTP_ExpiresAt] ON [dbo].[OTPVerifications];

IF EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'UQ_OTPVerifications_Identifier_Purpose')
    ALTER TABLE [dbo].[OTPVerifications] DROP CONSTRAINT [UQ_OTPVerifications_Identifier_Purpose];

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchLockedUntil')
    ALTER TABLE [dbo].[OTPVerifications] DROP COLUMN [DispatchLockedUntil];

IF EXISTS (SELECT 1 FROM sys.default_constraints WHERE name = 'DF_OTPVerifications_DispatchState')
    ALTER TABLE [dbo].[OTPVerifications] DROP CONSTRAINT [DF_OTPVerifications_DispatchState];

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchState')
    ALTER TABLE [dbo].[OTPVerifications] DROP COLUMN [DispatchState];

IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchToken')
    ALTER TABLE [dbo].[OTPVerifications] DROP COLUMN [DispatchToken];
*/
