# WATCHHUB ATELIER — MOBILE OTP & DLT TELECOM REGISTRATION ARCHITECTURE
**Phase 9 Final Report — Authentication, Mobile OTP & Razorpay Setup**  
**Mode:** 100% LOCAL DEVELOPMENT ONLY | **Budget:** ₹0 FOR LOCAL TESTING  
**Status:** LOCAL TESTED (Mock Provider) | PRODUCTION BLOCKED (Pending TRAI DLT Registration)

---

## 1. Executive Summary & Status Classification

| Component | Class / Service | Status | Description |
| :--- | :--- | :--- | :--- |
| **SMSProvider Interface** | `SMSProvider` base class | **LOCAL TESTED** | Extensible contract for zero-cost mock and production providers |
| **Development Mock SMS** | `DevelopmentMockSMSProvider` | **LOCAL TESTED** | ₹0 local testing; isolated store; safe test fixtures; throws in production |
| **Production SMS Adapter** | `ProductionSMSProvider` | **BLOCKED (GATED)** | Disabled by default (`ENABLE_PRODUCTION_SMS=false`); requires TRAI DLT |
| **Dynamic Provider Factory** | `getSmsProvider()` | **LOCAL TESTED** | Selects mock provider in development/test, production provider in prod |
| **Cross-Process Test Fixture**| `getLastMockOtp(phone)` | **LOCAL TESTED** | Secure development fixture for end-to-end automated testing |

---

## 2. SMS Provider Architecture

```
                       [Incoming Mobile OTP Request]
                                    │
                                    ▼
                          [getSmsProvider()]
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        [Development / Test]                    [Production]
                  │                                   │
                  ▼                                   ▼
    [DevelopmentMockSMSProvider]             [ProductionSMSProvider]
                  │                                   │
      ┌───────────┴───────────┐                       ▼
      ▼                       ▼             Is ENABLE_PRODUCTION_SMS=true?
[Returns simulated: true] [Persists to               │
[Zero Telecom Cost]       Mock Store]       ┌─────────┴─────────┐
                                            ▼                   ▼
                                          [YES]               [NO]
                                            │                   │
                                            ▼                   ▼
                                     [Fast2SMS / MSG91]  [Rejects with]
                                     [DLT API Dispatch]  [PRODUCTION_SMS_DISABLED]
```

### Safety Guarantees:
1. **Never returns fake success as real delivery:** Responses from `DevelopmentMockSMSProvider` explicitly set `simulated: true` and `provider: 'DevelopmentMockSMSProvider'`.
2. **Zero Plaintext Logging:** Phone numbers are masked in console output (`+91 ******4321`), and OTP values are never written to standard logs.
3. **Production Exception Enforcement:** `DevelopmentMockSMSProvider` throws an uncaught `Security Violation` error if instantiated or executed when `process.env.NODE_ENV === 'production'`.
4. **Disabled by Default in Production:** `ProductionSMSProvider` defaults to `enabled: false`. No telecom fees can be incurred without explicit configuration.

---

## 3. Indian Telecom TRAI DLT Registration Guide

To enable live production SMS delivery in India, commercial senders must comply with the Telecom Regulatory Authority of India (TRAI) Telecom Commercial Communications Customer Preference Regulations (TCCCPR, 2018).

### Step-by-Step DLT Registration Process:

1. **Register as Principal Entity (PE):**
   - Register on any telecom DLT portal (e.g., Jio, Airtel, Vodafone Idea, BSNL, or Tata Tele).
   - Documents required: Company PAN, Certificate of Incorporation / GST Certificate, Authorized Signatory ID, and Board Resolution.
   - One-time registration fee: Approximately ₹5,900 (inclusive of GST).

2. **Register Sender Header (Sender ID):**
   - Header format for transactional/service implicit OTP: Exactly 6 alphabetic characters (e.g., `WCHHUB`, `WTCHUB`).
   - Must match the brand name or registered company trademark.

3. **Register Consent and Content Templates:**
   - Template Type: **Service Implicit** (for authentication OTPs).
   - Template Category: **Authentication / Banking / E-Commerce**.
   - Example DLT-Approved Content Template:
     ```
     Dear Collector, your WatchHub Atelier verification code is {#var#}. Valid for 5 minutes. Do not share this OTP with anyone. - WATCHHUB
     ```
   - Each variable `{#var#}` must be mapped to dynamic parameters.

4. **Obtain Template ID:**
   - Each approved template receives a unique 19-digit numerical `DLT_TE_ID` (Template Entity ID).
   - This `DLT_TE_ID` must be passed with every SMS API dispatch.

5. **Configure Production Gateway:**
   - Update environment variables:
     ```env
     ENABLE_PRODUCTION_SMS=true
     FAST2SMS_API_KEY=your_registered_api_key
     FAST2SMS_SENDER_ID=WCHHUB
     FAST2SMS_DLT_TE_ID=1707xxxxxxxxxxxxxxx
     ```

---

## 4. Key Source Code References
- **SMS Provider Interface & Mock Implementation:** [smsProvider.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/services/smsProvider.js#L1-L240)
- **SMS Dispatch Service:** [smsService.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/services/smsService.js#L1-L70)
- **Phone OTP Endpoints:** [authRoutes.js](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/src/routes/authRoutes.js#L560-L650)
- **Automated Test Scenarios (Tests 6, 7):** [test_phase9_auth_payment_suite.mjs](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/server/scripts/test_phase9_auth_payment_suite.mjs#L260-L320)
