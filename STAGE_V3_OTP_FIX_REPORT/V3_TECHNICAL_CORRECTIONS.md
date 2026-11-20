# V3 TECHNICAL CORRECTIONS REPORT
## WatchHub Microsoft SQL Server 2025 OTP Persistence & Distributed Concurrency

### Executive Overview
In OTP Persistence Architecture Review V2, five critical and high-priority architectural risks were identified:
1. **Lack of Dispatch Reservation Ownership**: Process-local in-flight sets failed across multi-instance Node.js clusters, allowing race conditions and delayed email dispatch activations to overwrite newer OTP requests.
2. **Ambiguous Lease and Cooldown Lifecycle**: Unclear state boundaries between in-flight dispatch leases, rate-limiting cooldowns, and OTP expiration.
3. **Ungraceful Cleanup Worker Termination**: Timers were cleared on worker shutdown, but active SQL Server batch deletions were severed abruptly or allowed to race against Prisma disconnection.
4. **Lock Escalation in Bulk Purging**: Unbounded or poorly scheduled batch purges risked table-level lock escalation on `OTPVerifications`.
5. **Coupled Security Secrets & Vulnerable String Comparison**: Use of `JWT_ACCESS_SECRET` fallback coupled session authentication with OTP security, and standard string comparison risked timing attacks.

---

### Technical Corrections Implemented

#### 1. Unique Lease Token & Distributed Reservation Protocol
* **Location**: `server/src/services/otpService.js` (`acquireReservation`, `requestAndSendOtp`)
* **Database Columns**: `DispatchToken NVARCHAR(64)`, `DispatchState NVARCHAR(20)`, `DispatchLockedUntil DATETIME2`.
* **Correction**: Every reservation request generates a cryptographically unique `DispatchToken` (UUIDv4) and acquires ownership using atomic SQL Server conditional updates.
* **Guarded Transition**: External SMTP requests (Gmail SMTP / Resend) are executed strictly **outside** the database transaction. When dispatch finishes, the state transition to `ACTIVE` is guarded with `WHERE DispatchToken = @dispatchToken`. If the 30-second lease expired and another process took over, the old process's update affects 0 rows and is safely discarded.

#### 2. Three-State Lifecycle Machine (`RESERVED`, `ACTIVE`, `FAILED`)
* **State Machine**:
  * `RESERVED`: Process holds an active lease (`DispatchLockedUntil > now`). Concurrent dispatches are rejected (`inFlight: true`).
  * `ACTIVE`: Email dispatched; OTP ready for user verification. Enforces 60-second cooldown (`ResendCooldownUntil > now`).
  * `FAILED`: Delivery failed or lease expired. Rollback permits immediate retry without locking the customer out for 60 seconds.
* **Time Standards**: All comparisons use ISO 8601 UTC timestamps consistently.

#### 3. Graceful Cleanup Worker (`server/src/services/otpCleanupWorker.js`)
* **Scheduler**: Self-chaining `setTimeout` prevents overlapping cleanup cycles.
* **Shutdown Handlers**: Single `async stop(timeoutMs)` method clears future timers, sets `isStopping = true`, and cleanly `await`s any currently executing batch promise before Prisma disconnects.
* **Signal Registration**: Wired to `SIGTERM` and `SIGINT` in `server/src/server.js` using `process.once()`.

#### 4. Bounded Batched Purge & Lock Escalation Avoidance
* **SQL Implementation**: `DELETE TOP (500) FROM OTPVerifications WHERE ExpiresAt < @now AND (DispatchLockedUntil IS NULL OR DispatchLockedUntil < @now)`.
* **Lock Management**: 50ms yield delay between batches releases row/page locks and prevents SQL Server from escalating to table locks.
* **Transient Retry**: Deadlock (error 1205) and transient socket resets are detected and retried with exponential backoff up to 3 times.

#### 5. Dedicated HMAC Secret & Constant-Time Validation
* **Decoupled Configuration**: Removed `JWT_ACCESS_SECRET` fallback. Configured `OTP_HASH_SECRET_CURRENT` and optional `OTP_HASH_SECRET_PREVIOUS`.
* **Digest Binding**: HMAC-SHA256 is bound to `normalizedId:normalizedPurpose:normalizedOtp`.
* **Constant-Time Comparison**: `verifyHashTimingSafe` enforces 32-byte digest length and compares buffers via `crypto.timingSafeEqual()`, completely mitigating timing side-channel attacks.
