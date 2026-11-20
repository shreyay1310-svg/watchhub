# WatchHub — Phase 2: MongoDB Backup Verification Report
**Generated:** 2026-11-19T11:18:00.000Z  
**Backup Identifier:** `snapshot_pre_phase2`  
**Storage Path:** `server/backups/snapshot_pre_phase2/`  
**Audit Purpose:** Cryptographic Hash Verification, Cold Storage Integrity, and Restore Dry-Run  

---

## 1. Backup Summary

Prior to any write activity on Microsoft SQL Server 2025, an offline cold snapshot was taken of all operational and catalog collections. The backup is stored in structured, serialized JSON records with a cryptographic SHA-256 manifest.

---

## 2. Cryptographic Hash & File Size Verification

All 10 backup archives were individually hashed using SHA-256 and matched against `manifest.json`:

| File Name | Record Count | File Size (Bytes) | SHA-256 Checksum | Integrity Status |
|-----------|--------------|-------------------|------------------|------------------|
| `users.json` | 6 | 3,009 | `d3476356406af1a4c7c6de8c8356647ea498844f87e556e941d250dc28622667` | **VERIFIED MATCH** |
| `products.json` | 33 | 21,095 | `3d7740753d5b64d35348db4b9a970bd09b6a478068f151197b0d92e8e60182a9` | **VERIFIED MATCH** |
| `orders.json` | 3 | 3,427 | `c8f2318ca5cf96005475895383d7fd4539268755269d7d2b76ce3ab31596d376` | **VERIFIED MATCH** |
| `coupons.json` | 3 | 609 | `b7894b15bf5aad70ce33cfec89eb184313ac859f16dc42a8a475382590982b5f` | **VERIFIED MATCH** |
| `deliveries.json` | 3 | 8,108 | `376f1e3080ba23e6cf1f3eb0aad8b3282c9e78402bc716a5b4d1057150ac5516` | **VERIFIED MATCH** |
| `delivery_partners.json` | 3 | 2,005 | `e9017ad5058639c0082724e5ad9250e4d83a5e474ac2bbec365aea79b30745d2` | **VERIFIED MATCH** |
| `inventory.json` | 8 | 5,685 | `1b087ea6d1ee336697aa9c81b65bfbd20f627ac6b8b0a9d3952d61b19c77c903` | **VERIFIED MATCH** |
| `warehouses.json` | 3 | 1,231 | `3101cbfd460aaad08b6060d807bada34c7e5acbd5ca60d97855195242d376681` | **VERIFIED MATCH** |
| `stock_transactions.json` | 5 | 2,093 | `ec51e8dec5d0237b2b61308324eddb7ea3de988068d9fe3a11dde0277818d77d` | **VERIFIED MATCH** |
| `support_tickets.json` | 6 | 9,801 | `b977dd5c5686ebde660f3eb8f74e7a4b0fec8364519873416c0b1320caa07d3c` | **VERIFIED MATCH** |
| `manifest.json` | — | 2,150 | Cryptographic Manifest Metadata | **VERIFIED MATCH** |

**Total Snapshot Records:** 73  
**Total Data Size on Disk:** 59,213 Bytes (57.8 KB)  
**Corrupted or Truncated Files:** 0  

---

## 3. Restore Dry-Run Test

A cold restore dry-run validation was performed in memory using Node.js:
1. All 10 JSON files were read from disk and parsed via `JSON.parse()`.
2. Syntax and schema structural parsing: **100% valid JSON** (0 syntax errors).
3. Primary key uniqueness validation:
   - `users.json`: 6 unique emails, 0 collisions.
   - `products.json`: 33 unique SKUs, 0 collisions.
   - `orders.json`: 3 unique order IDs, 0 collisions.
   - `coupons.json`: 3 unique codes, 0 collisions.
   - `deliveries.json`: 3 unique tracking numbers / AWBs, 0 collisions.
   - `warehouses.json`: 3 unique warehouse codes, 0 collisions.
   - `support_tickets.json`: 6 unique ticket IDs, 0 collisions.

---

## 4. Preservation Directive

The directory `server/backups/snapshot_pre_phase2/` has been permanently retained as an offline cold recovery archive. It is excluded from Git commits via `.gitignore` to prevent leaking hashed credentials while remaining intact on local disk for disaster recovery.

**Audit Status:** **PASS (100% Verified & Validated)**
