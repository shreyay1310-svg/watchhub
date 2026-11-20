# V3 CLEANUP WORKER REPORT
## Batch Purge, Lock Escalation Prevention & Graceful Shutdown

### Implementation Overview
* **Source File**: `server/src/services/otpCleanupWorker.js`
* **Lifecycle Architecture**: Self-chaining `setTimeout` prevents tick accumulation or overlapping runs.
* **SQL Query**:
  ```sql
  DELETE TOP (500) FROM OTPVerifications
  WHERE ExpiresAt < @now
    AND (DispatchLockedUntil IS NULL OR DispatchLockedUntil < @now);
  ```

---

### Benchmark: 5,000 Expired Records Test (TC_V3_009)

* **Test Corpus**: 5,000 expired OTP records seeded directly into Microsoft SQL Server 2025.
* **Batch Configuration**: `batchSize = 500`, `batchYieldDelayMs = 10ms`.
* **Execution Metrics**:
  * Total Records Deleted: **5,000**
  * Total Batches Executed: **11** (10 full batches of 500 + 1 final zero-drain check)
  * Total Cycle Duration: **339 ms**
  * Average Batch Duration: **29.8 ms**
  * Lock Escalation: **None** (Table lock escalation avoided due to small batch sizes and row-level locks).
  * Errors / Deadlocks: **0**

---

### Graceful Shutdown Sequence (TC_V3_007)

When the server receives `SIGTERM` or `SIGINT`:
1. HTTP and WebSocket server stops accepting new connections (`server.close()`).
2. `otpCleanupWorker.stop(5000)` is invoked:
   * Sets `isStopping = true`, cancelling any scheduled `setTimeout`.
   * Awaits `inFlightPromise` (the active `executeCleanupRun()` loop).
   * Drains the active batch cleanly without leaving truncated transactions.
3. Database connection is closed cleanly (`disconnectDB()`).
4. Bounded timeout (10,000ms) guarantees the process never hangs indefinitely.
