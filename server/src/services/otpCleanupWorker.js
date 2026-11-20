// WatchHub V3 Distributed OTP Cleanup Worker
// Implements bounded batch deletion, self-chaining scheduling,
// transient error retry, execution metrics, and graceful shutdown.
import { prisma } from '../config/prisma.js';

export class OtpCleanupWorker {
  constructor(options = {}) {
    this.batchSize = options.batchSize || 500;
    this.intervalMs = options.intervalMs || 60 * 1000; // 60 seconds
    this.batchYieldDelayMs = options.batchYieldDelayMs || 50; // 50ms pause between batches
    this.maxTransientRetries = options.maxTransientRetries || 3;

    this.isRunning = false;
    this.isStopping = false;
    this.currentTimer = null;
    this.inFlightPromise = null;

    // Execution metrics
    this.metrics = {
      totalBatches: 0,
      totalDeleted: 0,
      totalFailures: 0,
      totalRetries: 0,
      lastRunDurationMs: 0,
      lastRunTimestamp: null,
    };
  }

  /**
   * Start the worker with self-chaining scheduler
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isStopping = false;
    console.log(`[OTP Cleanup Worker] Started with batchSize=${this.batchSize}, interval=${this.intervalMs}ms.`);
    this.scheduleNext(this.intervalMs);
  }

  /**
   * Schedule the next execution using self-chaining setTimeout
   */
  scheduleNext(delayMs) {
    if (!this.isRunning || this.isStopping) return;
    if (this.currentTimer) clearTimeout(this.currentTimer);

    this.currentTimer = setTimeout(async () => {
      this.currentTimer = null;
      if (!this.isRunning || this.isStopping) return;

      try {
        this.inFlightPromise = this.executeCleanupRun();
        await this.inFlightPromise;
      } catch (err) {
        console.error('[OTP Cleanup Worker] Unexpected run error:', err.message);
      } finally {
        this.inFlightPromise = null;
        if (this.isRunning && !this.isStopping) {
          this.scheduleNext(this.intervalMs);
        }
      }
    }, delayMs);
  }

  /**
   * Execute a full cleanup cycle, draining expired records in bounded batches
   */
  async executeCleanupRun() {
    const startTime = Date.now();
    let cycleDeleted = 0;
    let cycleBatches = 0;

    while (this.isRunning && !this.isStopping) {
      let deletedInBatch = 0;
      let retries = 0;
      let success = false;

      while (retries <= this.maxTransientRetries && !success) {
        try {
          const now = new Date();
          // Delete expired records that are not currently under an active dispatch lease
          const result = await prisma.$executeRawUnsafe(`
            DELETE TOP (${this.batchSize}) FROM OTPVerifications
            WHERE ExpiresAt < '${now.toISOString()}'
              AND (DispatchLockedUntil IS NULL OR DispatchLockedUntil < '${now.toISOString()}');
          `);

          deletedInBatch = typeof result === 'number' ? result : 0;
          success = true;
        } catch (err) {
          retries++;
          this.metrics.totalRetries++;
          const isTransient = this.isTransientSqlError(err);
          console.warn(`[OTP Cleanup Worker] Batch error (attempt ${retries}/${this.maxTransientRetries}, transient=${isTransient}): ${err.message}`);

          if (retries > this.maxTransientRetries || !isTransient) {
            this.metrics.totalFailures++;
            console.error('[OTP Cleanup Worker] Bounded retries exhausted or non-transient error in batch.');
            break;
          }
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries)));
        }
      }

      if (!success) break;

      cycleDeleted += deletedInBatch;
      cycleBatches++;
      this.metrics.totalBatches++;
      this.metrics.totalDeleted += deletedInBatch;

      // If fewer rows than batchSize were deleted, all expired records have been purged
      if (deletedInBatch < this.batchSize) {
        break;
      }

      // Small delay between batches to release row locks and yield CPU
      if (this.batchYieldDelayMs > 0 && !this.isStopping) {
        await new Promise((resolve) => setTimeout(resolve, this.batchYieldDelayMs));
      }
    }

    const duration = Date.now() - startTime;
    this.metrics.lastRunDurationMs = duration;
    this.metrics.lastRunTimestamp = new Date();

    if (cycleDeleted > 0) {
      console.log(`[OTP Cleanup Worker] Purged ${cycleDeleted} expired records across ${cycleBatches} batch(es) in ${duration}ms.`);
    }

    return { cycleDeleted, cycleBatches, duration };
  }

  /**
   * Determine if an error is a retryable transient SQL Server error
   */
  isTransientSqlError(err) {
    if (!err || !err.message) return false;
    const msg = err.message.toLowerCase();
    // 1205: Deadlock victim, 4060: Database unavailable, connection resets / timeouts
    return (
      msg.includes('deadlock') ||
      msg.includes('1205') ||
      msg.includes('timeout') ||
      msg.includes('connection reset') ||
      msg.includes('transport-level error')
    );
  }

  /**
   * Graceful asynchronous shutdown awaiting any in-flight batch completion
   */
  async stop(timeoutMs = 5000) {
    if (!this.isRunning && !this.inFlightPromise) return;

    console.log('[OTP Cleanup Worker] Graceful stop requested...');
    this.isStopping = true;
    this.isRunning = false;

    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }

    if (this.inFlightPromise) {
      console.log('[OTP Cleanup Worker] Awaiting in-flight cleanup batch completion...');
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Cleanup worker shutdown timed out')), timeoutMs)
      );

      try {
        await Promise.race([this.inFlightPromise, timeoutPromise]);
        console.log('[OTP Cleanup Worker] In-flight batch completed cleanly.');
      } catch (err) {
        console.error('[OTP Cleanup Worker] Shutdown warning:', err.message);
      } finally {
        this.inFlightPromise = null;
      }
    }

    console.log('[OTP Cleanup Worker] Stopped successfully.');
  }

  /**
   * Get telemetry metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }
}

// Singleton worker instance
export const otpCleanupWorker = new OtpCleanupWorker();

export default otpCleanupWorker;
