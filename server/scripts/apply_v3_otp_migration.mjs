import { prisma } from '../src/config/prisma.js';

async function migrate() {
  console.log('[Migration] Applying V3 OTP Persistence DDL to Microsoft SQL Server 2025...');
  
  const ddlStatements = [
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchToken')
     BEGIN
         ALTER TABLE OTPVerifications ADD DispatchToken NVARCHAR(64) NULL;
     END;`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchState')
     BEGIN
         ALTER TABLE OTPVerifications ADD DispatchState NVARCHAR(20) NOT NULL CONSTRAINT DF_OTPVerifications_DispatchState DEFAULT 'ACTIVE';
     END;`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'DispatchLockedUntil')
     BEGIN
         ALTER TABLE OTPVerifications ADD DispatchLockedUntil DATETIME2 NULL;
     END;`,
    `IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'UQ_OTPVerifications_Identifier_Purpose')
     BEGIN
         ALTER TABLE OTPVerifications ADD CONSTRAINT UQ_OTPVerifications_Identifier_Purpose UNIQUE (Identifier, Purpose);
     END;`,
    `IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'IX_OTP_ExpiresAt')
     BEGIN
         CREATE NONCLUSTERED INDEX IX_OTP_ExpiresAt ON OTPVerifications (ExpiresAt);
     END;`,
    `IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('OTPVerifications') AND name = 'IX_OTP_DispatchLockedUntil')
     BEGIN
         CREATE NONCLUSTERED INDEX IX_OTP_DispatchLockedUntil ON OTPVerifications (DispatchLockedUntil);
     END;`
  ];

  for (const stmt of ddlStatements) {
    await prisma.$executeRawUnsafe(stmt);
  }

  console.log('[Migration] All DDL statements applied successfully.');

  const cols = await prisma.$queryRawUnsafe(`
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'OTPVerifications'
    ORDER BY ORDINAL_POSITION;
  `);
  console.log('[Migration] Updated OTPVerifications columns:', cols);

  process.exit(0);
}

migrate().catch((err) => {
  console.error('[Migration Error]', err);
  process.exit(1);
});
