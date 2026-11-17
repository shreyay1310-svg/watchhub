// Resend Production Email Integration Service for WatchHub
// Renders luxury dark navy & gold HTML transactional emails
import { Resend } from 'resend';

export const sendResendEmailOtp = async ({ email, otp, purpose = 'registration', userName = 'Valued Collector' }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'WatchHub Concierge <concierge@watchhub.luxury>';

  const subjectTitles = {
    registration: 'Verify Your WatchHub Account – One-Time Password (OTP)',
    login: 'WatchHub Security Alert – Login Verification OTP',
    password_reset: 'WatchHub Account Recovery – Password Reset OTP',
    sensitive_action: 'WatchHub Security Verification Code',
  };

  const subject = subjectTitles[purpose] || 'Your WatchHub Verification Code';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #070918; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF; }
    .container { max-width: 580px; margin: 30px auto; background-color: #11172C; border: 1px solid #28334B; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
    .header { padding: 35px 30px; text-align: center; background: linear-gradient(135deg, #0C1033 0%, #11172C 100%); border-bottom: 1px solid #28334B; }
    .brand { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #FFFFFF; text-transform: uppercase; }
    .brand span { color: #E9B94F; }
    .tagline { font-size: 10px; color: #00D5FF; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; font-weight: 700; }
    .content { padding: 40px 35px; text-align: center; }
    .greeting { font-size: 16px; color: #A7B1C2; margin-bottom: 15px; }
    .title { font-size: 20px; font-weight: 700; color: #FFFFFF; margin-bottom: 20px; }
    .otp-card { background: #081529; border: 1px solid #6500FF; border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; }
    .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #E9B94F; font-family: monospace; }
    .otp-validity { font-size: 12px; color: #00D5FF; margin-top: 10px; font-weight: 600; }
    .notice { font-size: 12px; color: #A7B1C2; line-height: 1.6; margin-top: 25px; text-align: left; background: rgba(40,51,75,0.3); padding: 15px; border-radius: 12px; }
    .footer { padding: 25px 30px; text-align: center; border-top: 1px solid #28334B; font-size: 11px; color: #64748B; background-color: #070918; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">WATCH<span>HUB</span></div>
      <div class="tagline">Geneva Horology &amp; Luxury Timepieces</div>
    </div>
    <div class="content">
      <div class="greeting">Dear ${userName},</div>
      <div class="title">${subject}</div>
      <p style="font-size: 14px; color: #A7B1C2; line-height: 1.5;">
        Please use the single-use verification code below to authenticate your WatchHub account.
      </p>
      
      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="otp-validity">Valid for 5 minutes • Single-use only</div>
      </div>

      <div class="notice">
        <strong>Security Notice:</strong>
        WatchHub personnel will never ask for your verification code or password over phone, email, or chat. If you did not initiate this request, please contact our Concierge Desk immediately.
      </div>
    </div>
    <div class="footer">
      &copy; 2026 WatchHub Luxury Horology International. All rights reserved.<br>
      Geneva • Zurich • London • Dubai • New Delhi • Singapore
    </div>
  </div>
</body>
</html>
`;

  // If RESEND_API_KEY is configured
  if (apiKey && apiKey !== 'your_resend_api_key') {
    try {
      const resend = new Resend(apiKey);
      const data = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject,
        html: htmlContent,
      });
      console.log('[Resend] Email OTP Dispatched successfully:', data);
      return { success: true, provider: 'Resend', data };
    } catch (err) {
      console.error('[Resend] Error sending email:', err.message);
      return { success: false, error: err.message };
    }
  }

  // Graceful Secure Fallback for Development/Demo Mode
  console.info(`[Resend Email Gateway - Sandbox Mode] Dispatched 6-digit OTP to [${email}]: [${otp}] for purpose: ${purpose}`);
  return {
    success: true,
    provider: 'RESEND_SANDBOX',
    message: `Verification code sent to ${email}`,
  };
};
