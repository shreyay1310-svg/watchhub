import { prisma } from '../src/config/prisma.js';

async function main() {
  console.log('[Database] Adding OTP and password change fields to dbo.Users table...');

  const statements = [
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'OtpCode')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [OtpCode] NVARCHAR(10) NULL;
         PRINT 'Added OtpCode column';
     END`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'OtpHash')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [OtpHash] NVARCHAR(128) NULL;
         PRINT 'Added OtpHash column';
     END`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'OtpExpiresAt')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [OtpExpiresAt] DATETIME2 NULL;
         PRINT 'Added OtpExpiresAt column';
     END`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'OtpPurpose')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [OtpPurpose] NVARCHAR(40) NULL;
         PRINT 'Added OtpPurpose column';
     END`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'ResetPasswordToken')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [ResetPasswordToken] NVARCHAR(255) NULL;
         PRINT 'Added ResetPasswordToken column';
     END`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'ResetPasswordExpiresAt')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [ResetPasswordExpiresAt] DATETIME2 NULL;
         PRINT 'Added ResetPasswordExpiresAt column';
     END`,
    `IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'PasswordChangedAt')
     BEGIN
         ALTER TABLE [dbo].[Users] ADD [PasswordChangedAt] DATETIME2 NULL;
         PRINT 'Added PasswordChangedAt column';
     END`
  ];

  for (const sql of statements) {
    await prisma.$executeRawUnsafe(sql);
  }

  const columns = await prisma.$queryRawUnsafe(`
    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Users' 
    ORDER BY ORDINAL_POSITION;
  `);

  console.log('[Database] Updated dbo.Users Schema:');
  console.table(columns);

  process.exit(0);
}

main().catch((err) => {
  console.error('[Error]', err);
  process.exit(1);
});
