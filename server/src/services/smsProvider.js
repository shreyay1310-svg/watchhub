// WatchHub Enterprise SMS Provider Architecture
// Implements:
// 1. SMSProvider base interface
// 2. DevelopmentMockSMSProvider for ₹0 local development and automated testing
// 3. ProductionSMSProvider adapter (disabled by default to prevent unexpected charges)
// 4. Safe test-only OTP retrieval fixture

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOCK_STORE_FILE = path.resolve(__dirname, '../../.mock_sms_dispatches.json');

// Isolated in-memory store for development/test OTP inspection
const MOCK_DISPATCH_STORE = new Map();

/**
 * Base SMSProvider Interface
 */
export class SMSProvider {
  /**
   * Send an OTP to a mobile recipient
   * @param {Object} params - { mobile, otp, purpose }
   * @returns {Promise<{ success: boolean, provider: string, simulated?: boolean, error?: string, message?: string }>}
   */
  async sendOtp(_params) {
    throw new Error('Method sendOtp() must be implemented by subclass.');
  }

  getName() {
    return 'BaseSMSProvider';
  }

  isProductionReady() {
    return false;
  }
}

/**
 * Development & Testing Mock SMS Provider
 * - Zero cost: No external telecom APIs invoked
 * - Never returns fake success as real delivery: explicitly sets simulated: true
 * - Throws immediately if instantiated or invoked in production
 * - Provides isolated test-only fixture for automated verification
 */
export class DevelopmentMockSMSProvider extends SMSProvider {
  constructor() {
    super();
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[Security Violation] DevelopmentMockSMSProvider cannot be loaded or used in a production environment.'
      );
    }
  }

  getName() {
    return 'DevelopmentMockSMSProvider';
  }

  isProductionReady() {
    return false;
  }

  async sendOtp({ mobile, otp, purpose = 'registration' }) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        '[Security Violation] DevelopmentMockSMSProvider cannot be executed in production.'
      );
    }

    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanMobile || cleanMobile.length < 10) {
      return {
        success: false,
        error: 'INVALID_PHONE_NUMBER',
        message: 'A valid 10-digit mobile number is required.',
      };
    }

    // Record in isolated development test store
    const record = {
      mobile: cleanMobile,
      otp: otp.toString(),
      purpose: purpose.toLowerCase(),
      dispatchedAt: new Date(),
    };
    MOCK_DISPATCH_STORE.set(cleanMobile, record);
    try {
      let fileData = {};
      if (fs.existsSync(MOCK_STORE_FILE)) {
        fileData = JSON.parse(fs.readFileSync(MOCK_STORE_FILE, 'utf8'));
      }
      fileData[cleanMobile] = record;
      fs.writeFileSync(MOCK_STORE_FILE, JSON.stringify(fileData, null, 2), 'utf8');
    } catch {}

    // Safe audit logging: Masked phone number, zero plaintext OTP in output
    const maskedMobile = `+91 ******${cleanMobile.slice(-4)}`;
    console.info(`[SMS-MOCK] Simulated OTP dispatch to ${maskedMobile} for purpose: ${purpose}`);

    return {
      success: true,
      simulated: true,
      provider: 'DevelopmentMockSMSProvider',
      mobile: cleanMobile,
      message: 'Simulated local SMS dispatch. No telecom fee incurred.',
    };
  }

  /**
   * Test fixture: Retrieve the last mock OTP for automated test verification
   * Never exposed via public API endpoints
   */
  static getLastMockOtp(mobile) {
    const clean = (mobile || '').replace(/[^0-9]/g, '').slice(-10);
    const rec = MOCK_DISPATCH_STORE.get(clean);
    if (rec && rec.otp) return rec.otp;
    try {
      if (fs.existsSync(MOCK_STORE_FILE)) {
        const fileData = JSON.parse(fs.readFileSync(MOCK_STORE_FILE, 'utf8'));
        if (fileData && fileData[clean]) return fileData[clean].otp;
      }
    } catch {}
    return null;
  }

  /**
   * Test fixture: Clear the mock store
   */
  static clearMockStore() {
    MOCK_DISPATCH_STORE.clear();
    try {
      if (fs.existsSync(MOCK_STORE_FILE)) {
        fs.unlinkSync(MOCK_STORE_FILE);
      }
    } catch {}
  }
}

/**
 * Production SMS Provider Adapter (Disabled by Default)
 * - Requires explicit ENABLE_PRODUCTION_SMS=true
 * - Requires TRAI DLT approved Principal Entity ID, Header, and Content Template ID
 * - Protects against accidental telecom charges
 */
export class ProductionSMSProvider extends SMSProvider {
  constructor() {
    super();
    this.enabled = process.env.ENABLE_PRODUCTION_SMS === 'true';
    this.apiKey = process.env.FAST2SMS_API_KEY || process.env.MSG91_AUTH_KEY || null;
  }

  getName() {
    return 'ProductionSMSProvider';
  }

  isProductionReady() {
    return true;
  }

  async sendOtp({ mobile, otp, purpose = 'registration' }) {
    if (!this.enabled) {
      return {
        success: false,
        error: 'PRODUCTION_SMS_DISABLED',
        message:
          'Production SMS provider is disabled by default to prevent unexpected telecom charges. Complete TRAI DLT registration and set ENABLE_PRODUCTION_SMS=true to enable.',
      };
    }

    if (!this.apiKey) {
      return {
        success: false,
        error: 'MISSING_SMS_CREDENTIALS',
        message: 'No SMS API credentials (FAST2SMS_API_KEY / MSG91_AUTH_KEY) configured in environment.',
      };
    }

    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);
    try {
      // Fast2SMS DLT-compliant payload
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp.toString(),
          numbers: cleanMobile,
        }),
      });

      const data = await response.json();
      if (data.return) {
        return {
          success: true,
          provider: 'Fast2SMS_DLT',
          messageId: data.request_id || null,
        };
      }

      return {
        success: false,
        error: 'SMS_GATEWAY_ERROR',
        message: data.message || 'SMS Gateway rejected dispatch.',
      };
    } catch (err) {
      return {
        success: false,
        error: 'SMS_NETWORK_ERROR',
        message: err.message || 'Network error reaching SMS gateway.',
      };
    }
  }
}

/**
 * Factory resolver: Returns the appropriate SMS provider
 * Defaults to DevelopmentMockSMSProvider in non-production environments
 */
export const getSmsProvider = () => {
  if (process.env.NODE_ENV === 'production') {
    return new ProductionSMSProvider();
  }
  return new DevelopmentMockSMSProvider();
};

export default {
  SMSProvider,
  DevelopmentMockSMSProvider,
  ProductionSMSProvider,
  getSmsProvider,
};
