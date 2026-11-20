# WatchHub Atelier — Email Delivery & Test Domain Bounce Fix

**Document:** `WATCHHUB_PHASE_6_FINAL_REPORT/EMAIL_TEMPLATE_REDESIGN/02_EMAIL_DELIVERY_AND_TEST_DOMAIN_FIX.md`  
**Date:** November 20, 2026  
**Issue Investigated:** Gmail SMTP Delivery Failure (`Address not found: collector_test_1795156928772@watchhub.test`)  
**Resolution Status:** **`RESOLVED & TESTED`**

---

## 1. Root Cause Analysis

### The Failure Event
During automated testing, test suites generated synthetic test recipients such as:
`collector_test_1795156928772@watchhub.test`

Because `GMAIL_USER` and `GMAIL_APP_PASSWORD` were configured in `server/.env`, Nodemailer authenticated with `smtp.gmail.com` and submitted the message. Google Mail accepted the authenticated relay request, attempted to resolve the MX records for `watchhub.test`, and encountered an NXDOMAIN failure (the domain does not exist in public DNS). 

Google Mail then generated an asynchronous Delivery Status Notification (Failure) bounce notice:
> **"Address not found: Your message wasn't delivered to collector_test_1795156928772@watchhub.test because the domain watchhub.test couldn't be found."**

### RFC Standards Violation
Under **RFC 2606** (*Reserved Top Level DNS Names*) and **RFC 6761** (*Special-Use Domain Names*), `.test`, `.example`, `.invalid`, and `.localhost` are reserved for local testing and documentation. Public mail servers cannot route messages to these domains.

---

## 2. Infrastructure Architecture & Separation

To eliminate bounce notifications while maintaining genuine delivery for actual customers, the delivery pipeline was refactored into two distinct execution pathways:

```
                  Incoming Verification Request
                   [Email, OTP, Purpose, Name]
                               |
                               v
               +-------------------------------+
               |   RFC 2606 / 6761 Check       |
               |   isReservedTestDomain(email) |
               +---------------+---------------+
                               |
            +------------------+------------------+
            |                                     |
         YES (Test Domain)                     NO (Real Domain)
            |                                     |
            v                                     v
+-----------------------+              +-----------------------+
|  DEV_TEST_EMAIL_      |              | Valid Email Format?   |
|  RECIPIENT Set?       |              | isValidEmailFormat()  |
+-----------+-----------+              +-----------+-----------+
            |                                      |
     +------+------+                               v
     |             |                   +-----------------------+
    YES           NO                   | Live Gmail SMTP       |
     |             |                   | smtp.gmail.com:465    |
     v             v                   | Auth: App Password    |
+----------+ +-------------------+     | From: "WatchHub       |
| Deliver  | | Local SMTP        |     | Atelier" <user>       |
| to Real  | | Test Sandbox      |     +-----------+-----------+
| Dev      | | (Render template, |                 |
| Inbox    | | log compilation,  |                 v
+----------+ | return simulated  |     +-----------------------+
             | messageId, ZERO   |     | Actual Customer Inbox |
             | bounce)           |     +-----------------------+
             +-------------------+
```

---

## 3. Code Implementation Details

### 3.1. Test Domain Detection (`isReservedTestDomain`)
```javascript
export const isReservedTestDomain = (email) => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.toLowerCase().trim();
  return (
    clean.endsWith('.test') ||
    clean.endsWith('.example') ||
    clean.endsWith('.invalid') ||
    clean.endsWith('.localhost') ||
    clean.includes('@watchhub.test')
  );
};
```

### 3.2. Local SMTP Test Sandbox
When a reserved test domain is detected and no developer test inbox override is set:
1. Both the luxury HTML and plain-text templates are fully compiled and validated with the dynamic OTP.
2. The dispatch is safely captured in the local sandbox without making an external socket connection to Google MX servers.
3. A diagnostic log is emitted:  
   `[Local SMTP Test Sandbox] Intercepted reserved test domain (co***2@watchhub.test). Simulated delivery SUCCESS without external SMTP bounce.`
4. The service returns `{ success: true, messageId: '<test-sandbox-...@watchhub.local>', provider: 'local_smtp_sandbox' }`.

### 3.3. Optional Developer Test Inbox Rerouting
Developers who wish to physically inspect rendered emails in their personal inbox during local testing can specify:
```env
DEV_TEST_EMAIL_RECIPIENT=developer@gmail.com
```
When configured, all test-domain dispatches will automatically reroute to this verified address with a clear header annotation (`[Test Reroute: ...]`), allowing live inbox inspection without sending to non-existent domains.

### 3.4. Real Customer Email Delivery
When an actual customer submits their email (e.g., `collector@gmail.com`):
1. Format is checked with RFC-compliant email regex.
2. The message is securely delivered through `smtp.gmail.com:465` with TLS and sender `"WatchHub Atelier" <${gmailUser}>`.
3. Privacy-safe masked logs protect customer identities.

---

## 4. Verification Results

| Scenario | Recipient Address | Target Behavior | Observed Result |
| :--- | :--- | :--- | :--- |
| **Synthetic Test Email** | `collector_test_1795156928772@watchhub.test` | Captured in local test sandbox | **Simulated SUCCESS (Zero Bounce)** |
| **Reserved TLD** | `user@example.test` | Captured in local test sandbox | **Simulated SUCCESS (Zero Bounce)** |
| **Invalid Email Syntax** | `not-an-email-address` | Rejected with `INVALID_RECIPIENT_EMAIL` | **Rejected (400 / Service Error)** |
| **Real Registered Customer** | Valid public email address | Delivered via authenticated Gmail SMTP | **Delivered with MessageId** |
