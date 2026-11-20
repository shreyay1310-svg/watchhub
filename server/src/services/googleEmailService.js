// Google Gmail SMTP Email Integration Service for WatchHub Atelier
// Sends 6-digit cryptographic verification codes via Gmail App Password & Nodemailer
// Uses Swiss haute horlogerie luxury email templates with table-based HTML & plain-text fallback.
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateLuxuryEmailHtml,
  generateLuxuryEmailText,
  getEmailPurposeConfig,
  escapeHtml,
} from './emailTemplates.js';

// Guarantee server/.env is loaded regardless of process launch cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let transporter = null;

/**
 * RFC 2606 and RFC 6761 reserved test domains detection
 * (.test, .example, .invalid, .localhost, and @watchhub.test)
 */
export const isReservedTestDomain = (email) => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.toLowerCase().trim();
  return (
    clean.endsWith('.test') ||
    clean.endsWith('@test') ||
    clean.endsWith('.example') ||
    clean.endsWith('@example') ||
    clean.endsWith('.invalid') ||
    clean.endsWith('@invalid') ||
    clean.endsWith('.localhost') ||
    clean.endsWith('@localhost') ||
    clean.includes('@watchhub.test')
  );
};

/**
 * Standard RFC 5322 compliant email syntax validation
 */
export const isValidEmailFormat = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
};

/**
 * Mask email address for privacy-safe logging (e.g. sh***10@gmail.com)
 */
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return '***@***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `*@${domain}`;
  return `${local.substring(0, 2)}***${local.substring(local.length - 1)}@${domain}`;
};

/**
 * Initialize or reuse the Nodemailer SMTP transporter
 */
export const getGmailTransporter = () => {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, ''), // Strip spaces from Google App Password
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    console.log(
      `[OTP-FLOW] SMTP transporter initialized: host=${host} port=${port} secure=${secure} user=${maskEmail(user.trim())}`
    );
  }

  return transporter;
};

/**
 * Verify SMTP connection and credentials safely
 */
export const verifyGmailSmtp = async () => {
  const transport = getGmailTransporter();
  if (!transport) {
    console.warn('[OTP-FLOW] SMTP transporter ready: FAIL (missing SMTP credentials)');
    return { success: false, error: 'GMAIL_CONFIG_MISSING' };
  }

  try {
    const verified = await new Promise((resolve, reject) => {
      transport.verify((err, success) => {
        if (err) reject(err);
        else resolve(success);
      });
    });
    console.log('[OTP-FLOW] SMTP transporter ready: PASS');
    return { success: true, verified };
  } catch (err) {
    console.error(
      `[OTP-FLOW] SMTP transporter ready: FAIL (Code: ${err.code || 'UNKNOWN'}, ResponseCode: ${err.responseCode || 'N/A'})`
    );
    return { success: false, error: err.code || err.message };
  }
};

/**
 * Dispatches luxury OTP email with recipient validation, sandbox interception, and plain-text fallback
 */
export const sendGmailOtp = async ({
  email,
  otp,
  purpose = 'registration',
  userName = 'Valued Collector',
}) => {
  if (!email || !otp) {
    return {
      success: false,
      error: 'INVALID_PARAMETERS',
      message: 'Both email recipient and verification code are required.',
    };
  }

  const cleanRecipient = email.toLowerCase().trim();
  const config = getEmailPurposeConfig(purpose);

  console.log(`[OTP-FLOW] Dispatch started for recipient: ${maskEmail(cleanRecipient)} (purpose: ${purpose})`);

  // Generate both the responsive luxury HTML and the structured plain-text fallback
  const htmlContent = generateLuxuryEmailHtml({
    otp,
    purpose,
    userName,
  });

  const textContent = generateLuxuryEmailText({
    otp,
    purpose,
    userName,
  });

  // =========================================================================
  // 1. Controlled Test Domain Isolation (RFC 2606 / RFC 6761)
  // Prevents external Gmail SMTP bounces to fake domains like @watchhub.test
  // =========================================================================
  if (isReservedTestDomain(cleanRecipient)) {
    const isDevEnv = process.env.NODE_ENV !== 'production';
    const devInbox = (process.env.DEV_TEST_EMAIL_RECIPIENT || process.env.TEST_EMAIL_INBOX || '').trim();

    // DEV_TEST_EMAIL_RECIPIENT operates exclusively in explicitly enabled development environments
    if (isDevEnv && devInbox && isValidEmailFormat(devInbox) && !isReservedTestDomain(devInbox)) {
      console.log(
        `[OTP-FLOW] Rerouting test domain (${maskEmail(cleanRecipient)}) to authorized test inbox: ${maskEmail(devInbox)}`
      );
      return sendGmailOtp({
        email: devInbox,
        otp,
        purpose,
        userName: `${userName} [Test Reroute: ${cleanRecipient}]`,
      });
    }

    // Default Local Sandbox: Simulate delivery, verify template compilation, avoid Gmail bounce
    console.log(
      `[Local SMTP Test Sandbox] Intercepted reserved test domain (${maskEmail(cleanRecipient)}). Simulated delivery SUCCESS without external SMTP bounce.`
    );
    return {
      success: true,
      messageId: `<test-sandbox-${Date.now()}@watchhub.local>`,
      provider: 'local_smtp_sandbox',
      simulated: true,
      recipient: cleanRecipient,
      purpose,
    };
  }

  // =========================================================================
  // 2. Real Customer Recipient Validation
  // =========================================================================
  if (!isValidEmailFormat(cleanRecipient)) {
    console.warn(`[OTP-FLOW] Rejected invalid recipient format: ${maskEmail(cleanRecipient)}`);
    return {
      success: false,
      error: 'INVALID_RECIPIENT_EMAIL',
      message: 'The recipient email address is not in a valid format.',
    };
  }

  const gmailUser = process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER;
  const appPassword = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD;

  if (!gmailUser || !appPassword) {
    console.warn('[OTP-FLOW] SMTP transporter ready: FAIL (missing SMTP credentials)');
    return {
      success: false,
      error: 'GMAIL_CONFIG_MISSING',
      message: 'Gmail credentials not configured in server/.env',
    };
  }

  const transport = getGmailTransporter();
  if (!transport) {
    console.warn('[OTP-FLOW] SMTP transporter ready: FAIL (initialization failed)');
    return {
      success: false,
      error: 'TRANSPORTER_INIT_FAILED',
      message: 'Failed to initialize Gmail SMTP transporter',
    };
  }

  console.log('[OTP-FLOW] SMTP transporter ready: PASS');

  try {
    // Strictly use the verified Gmail identity as sender to prevent 553 domain mismatch
    const fromAddress = process.env.EMAIL_FROM || `"WatchHub Atelier" <${gmailUser.trim()}>`;

    console.log(`[OTP-FLOW] Sending SMTP message to ${maskEmail(cleanRecipient)} from ${fromAddress}`);

    const info = await transport.sendMail({
      from: fromAddress,
      to: cleanRecipient,
      subject: config.subject,
      html: htmlContent,
      text: textContent,
    });

    console.log(`[OTP-FLOW] SMTP accepted recipient: PASS (Accepted: ${JSON.stringify(info.accepted?.map(maskEmail))})`);
    console.log(`[OTP-FLOW] Message ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      provider: 'google_gmail_smtp',
    };
  } catch (err) {
    console.error(
      `[OTP-FLOW] SMTP accepted recipient: FAIL (Error: ${err.message}, Code: ${err.code || 'UNKNOWN'}, ResponseCode: ${err.responseCode || 'N/A'})`
    );
    return {
      success: false,
      error: err.code || 'EMAIL_DISPATCH_FAILED',
      message: `Failed to deliver email via Gmail SMTP: ${err.message}`,
    };
  }
};

export default {
  sendGmailOtp,
  verifyGmailSmtp,
  getGmailTransporter,
  isReservedTestDomain,
  isValidEmailFormat,
  maskEmail,
};
