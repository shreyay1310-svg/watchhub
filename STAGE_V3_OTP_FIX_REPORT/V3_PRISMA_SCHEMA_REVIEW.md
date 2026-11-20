# V3 PRISMA SCHEMA REVIEW
## Schema Analysis, Constraints, and Mapping

### Model Definition in `server/prisma/schema.prisma`

```prisma
model OTPVerification {
  otpId               String    @id @default(uuid()) @map("OtpId")
  identifier          String    @db.NVarChar(255) @map("Identifier")
  otpHash             String    @db.NVarChar(128) @map("OtpHash")
  channel             String    @db.NVarChar(20) @map("Channel")
  purpose             String    @db.NVarChar(40) @map("Purpose")
  attempts            Int       @default(0) @map("Attempts")
  isVerified          Boolean   @default(false) @map("IsVerified")
  dispatchToken       String?   @db.NVarChar(64) @map("DispatchToken")
  dispatchState       String    @default("ACTIVE") @db.NVarChar(20) @map("DispatchState")
  dispatchLockedUntil DateTime? @map("DispatchLockedUntil")
  resendCooldownUntil DateTime  @map("ResendCooldownUntil")
  expiresAt           DateTime  @map("ExpiresAt")
  createdAt           DateTime  @default(now()) @map("CreatedAt")

  @@unique([identifier, purpose], name: "identifier_purpose", map: "UQ_OTPVerifications_Identifier_Purpose")
  @@index([identifier, purpose, expiresAt], name: "IX_OTP_Identifier_Purpose")
  @@index([expiresAt], name: "IX_OTP_ExpiresAt")
  @@index([dispatchLockedUntil], name: "IX_OTP_DispatchLockedUntil")
  @@map("OTPVerifications")
}
```

---

### Key Architectural Validations

1. **Compound Unique Selector Naming**:
   * Compound unique selector is explicitly declared:
     `@@unique([identifier, purpose], name: "identifier_purpose", map: "UQ_OTPVerifications_Identifier_Purpose")`
   * Generated Prisma Client accessor:
     `prisma.oTPVerification.findUnique({ where: { identifier_purpose: { identifier, purpose } } })`
   * **Verification**: Tested live against Microsoft SQL Server 2025; generated code resolved cleanly with zero compiler or runtime errors.

2. **Physical Constraint & Index Mappings**:
   * `UQ_OTPVerifications_Identifier_Purpose`: Unique constraint on `(Identifier, Purpose)` in SQL Server schema.
   * `IX_OTP_ExpiresAt`: Dedicated nonclustered index on `ExpiresAt` for $O(\log N)$ cleanup query execution.
   * `IX_OTP_DispatchLockedUntil`: Nonclustered index on `DispatchLockedUntil` for fast expired lease recovery.

3. **Data Type Alignments**:
   * `Identifier`: `NVarChar(255)` supports standard RFC 5321 email addresses and E.164 phone numbers.
   * `OtpHash`: `NVarChar(128)` stores 64-character SHA-256 hex strings with headroom for SHA-512 upgrades.
   * `DispatchToken`: `NVarChar(64)` holds 36-character UUIDv4 tokens.
   * `DispatchState`: `NVarChar(20)` stores state identifiers (`RESERVED`, `ACTIVE`, `FAILED`).
   * `DateTime`: Prisma maps `DateTime` to SQL Server `datetime2` (7 decimal fractional second precision), avoiding rounding anomalies.
