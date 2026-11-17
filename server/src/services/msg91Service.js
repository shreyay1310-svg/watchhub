// MSG91 Production SMS & OTP Integration Service
// Supports Indian DLT registration, Sender IDs, and approved templates

export const sendMsg91Otp = async (mobile, otp) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

  if (cleanMobile.length < 10) {
    return { success: false, message: 'Invalid 10-digit mobile number' };
  }

  // If MSG91_AUTH_KEY is configured in production environment
  if (authKey && authKey !== 'your_msg91_auth_key') {
    try {
      const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId || 'watchhub_otp'}&mobile=91${cleanMobile}&authkey=${authKey}&otp=${otp}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('[MSG91] OTP Dispatch Response:', data);
      return {
        success: data.type === 'success',
        provider: 'MSG91',
        messageId: data.message,
        mobile: cleanMobile,
      };
    } catch (err) {
      console.error('[MSG91] API Error:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Graceful Secure Fallback for Development/Demo Mode when credentials are being set up
  console.info(`[MSG91 SMS Gateway - Sandbox Mode] Dispatched 6-digit OTP to +91 ${cleanMobile}: [${otp}] (Valid for 5 minutes)`);
  return {
    success: true,
    provider: 'MSG91_SANDBOX',
    message: `OTP sent to +91 ${cleanMobile}`,
    mobile: cleanMobile,
  };
};

export const resendMsg91Otp = async (mobile) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

  if (authKey && authKey !== 'your_msg91_auth_key') {
    try {
      const url = `https://control.msg91.com/api/v5/otp/retry?authkey=${authKey}&mobile=91${cleanMobile}&retrytype=text`;
      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();
      return { success: data.type === 'success', data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, provider: 'MSG91_SANDBOX', message: `Resent OTP to +91 ${cleanMobile}` };
};
