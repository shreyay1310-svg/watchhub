# WatchHub — Required Vercel Environment Variables Specification

**Document:** `REQUIRED_VERCEL_ENV_VARIABLES.md`  
**Date:** November 20, 2026  
**Auditor:** Senior Backend Architect & Security Specialist  
**Project:** WatchHub E-Commerce (`watchhub-store`)  
**Target:** Vercel Dashboard Project Settings  

---

## 1. Source-Code-Verified Environment Variables

All variables below were extracted directly from active references in `server/src/app.js`, `server/src/routes/*.js`, `server/src/services/*.js`, and `server/prisma/schema.prisma`.

| Variable Name | Criticality / Functional Tier | Code Origin | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Required for Startup** | `schema.prisma` L12, `prisma.js` L10 | Prisma connection string to cloud Microsoft SQL Server. |
| `NODE_ENV` | **Required for Startup** | `app.js` L33, `authController.js` L101 | Set to `production` (enforces HTTPS cookies, hides stack traces). |
| `CLIENT_URL` | **Optional / Recommended** | `app.js` L19 | Primary domain (`https://watchhub-store-silk.vercel.app`) for CORS and email links. |
| `JWT_ACCESS_SECRET` | **Required for Authentication** | `authRoutes.js` L11, `auth.js` L20 | Signs 1-hour access JWTs for API authentication and RBAC. |
| `JWT_REFRESH_SECRET` | **Required for Authentication** | `authRoutes.js` L12, `authController.js` L15 | Signs 7-day HTTP-only refresh tokens stored in cookies. |
| `OTP_HASH_SECRET_CURRENT`| **Required for Authentication** | `otpService.js` L17 | Dedicated HMAC-SHA256 key for V3 OTP hash persistence (decoupled from JWT). |
| `OTP_HASH_SECRET_PREVIOUS`| **Optional** (Key Rotation) | `otpService.js` L21 | Supports zero-downtime key rotation for in-flight 5-minute OTPs. |
| `GMAIL_USER` | **Required for Email** (Option A) | `googleEmailService.js` L18 | Primary notification Gmail address for outbound SMTP. |
| `GMAIL_APP_PASSWORD` | **Required for Email** (Option A) | `googleEmailService.js` L19 | 16-character Google App Password (not account password). |
| `RESEND_API_KEY` | **Required for Email** (Option B) | `resendService.js` L11 | Resend API key (`re_...`) for fallback email dispatch. |
| `EMAIL_FROM` | **Required for Email** (Option B) | `resendService.js` L12 | Sender header string (`WatchHub Atelier <onboarding@resend.dev>`). |
| `RAZORPAY_KEY_ID` | **Required for Payments Only** | `razorpayService.js` L9 | Razorpay Key ID for checkout and order generation. |
| `RAZORPAY_KEY_SECRET` | **Required for Payments Only** | `razorpayService.js` L10 | Razorpay Key Secret for webhook and payment verification. |

---

## 2. Safe Cryptographic Secret Generation Instructions

To generate high-entropy 256-bit hexadecimal keys for authentication variables, run this in PowerShell or Node:

```powershell
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('OTP_HASH_SECRET_CURRENT=' + require('crypto').randomBytes(32).toString('hex'))"
```

> [!IMPORTANT]
> Never commit generated keys to git. Never echo them into build logs or shared consoles.

---

## 3. Vercel Dashboard Configuration Instructions

Follow these exact steps to input environment variables into Vercel:

1. Open your web browser and navigate to:
   ```text
   https://vercel.com/13shreyayadav/watchhub-store/settings/environment-variables
   ```
2. For each variable in Section 1:
   - Enter the **Key** name exactly as spelled (case-sensitive).
   - Enter your procured or generated **Value**.
   - Check the **Production** and **Preview** environments.
   - Click **Save**.
3. **Important:** Variables added in the dashboard take effect only when a new deployment is triggered.
