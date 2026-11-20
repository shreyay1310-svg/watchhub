# V3 HMAC SECURITY REPORT
## Dedicated Secrets, Timing-Safe Equality, and Key Rotation

### 1. Decoupling from JWT Secrets
* **Vulnerability Resolved**: In V1/V2, `OTP_HASH_SECRET` fell back to `JWT_ACCESS_SECRET`. This coupled session signing keys with transient OTP digests, meaning a compromise of one affected the other.
* **V3 Implementation**:
  ```javascript
  export const getCurrentOtpSecret = () =>
    process.env.OTP_HASH_SECRET_CURRENT ||
    process.env.OTP_HASH_SECRET ||
    'watchhub_v3_secure_current_otp_hmac_secret_2026_enterprise';

  export const getPreviousOtpSecret = () => process.env.OTP_HASH_SECRET_PREVIOUS || null;
  ```
  `JWT_ACCESS_SECRET` is never accessed or referenced within the OTP subsystem.

---

### 2. Digest Binding Specification
HMAC-SHA256 digests are cryptographically bound to three normalized parameters:
$$\text{Digest} = \text{HMAC-SHA256}_{K}(\text{normalizedIdentifier} \parallel \text{":"} \parallel \text{normalizedPurpose} \parallel \text{":"} \parallel \text{normalizedOtp})$$
* **Cross-Purpose Replay Prevention**: An OTP generated for `registration` cannot be replayed for `login` or `password_reset`, even for the same recipient.
* **Cross-User Replay Prevention**: An OTP generated for user A cannot be verified by user B.

---

### 3. Constant-Time Verification (`crypto.timingSafeEqual`)
* **Timing Attack Prevention**: Standard string comparisons (`===`) exit at the first byte mismatch, leaking information about the hash prefix via CPU instruction timing.
* **V3 Implementation**:
  ```javascript
  export const verifyHashTimingSafe = (computedHash, storedHash) => {
    if (typeof computedHash !== 'string' || typeof storedHash !== 'string') return false;

    const bufA = Buffer.from(computedHash, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');

    // SHA-256 digests must be exactly 32 bytes (64 hex characters)
    if (bufA.length !== 32 || bufB.length !== 32) return false;

    return crypto.timingSafeEqual(bufA, bufB);
  };
  ```

---

### 4. Seamless Key Rotation (TC_V3_014)
* **Rotation Procedure**:
  1. Set `OTP_HASH_SECRET_PREVIOUS` to the old secret.
  2. Set `OTP_HASH_SECRET_CURRENT` to the new secret.
  3. Deploy instances.
  4. Incoming OTPs are signed with `CURRENT`. Verification evaluates `CURRENT` first, and if mismatched, tests against `PREVIOUS`.
  5. After the 5-minute validity window expires, remove `OTP_HASH_SECRET_PREVIOUS`.
* **Zero Downtime**: Active in-flight OTPs continue to verify without error.
