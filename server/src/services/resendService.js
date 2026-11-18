// Resend Production Email Integration Service for WatchHub
// Luxury Dark Navy & Gold Transactional Email Templates
import { Resend } from 'resend';

export const sendResendEmailOtp = async ({
  email,
  otp,
  purpose = 'registration',
  userName = 'Valued Collector',
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'WatchHub <onboarding@resend.dev>';

  const purposeConfig = {
    registration: {
      subject: 'Verify Your Email — WatchHub Registration Code',
      badge: 'Account Activation',
      headline: 'Welcome to the WatchHub Atelier',
      message: 'Thank you for choosing WatchHub. To complete your registration and activate your luxury timepiece collector account, please verify your email address using the one-time code below.',
    },
    login: {
      subject: 'Your WatchHub Sign-in Verification Code',
      badge: 'Sign-in Security',
      headline: 'Authentication Request',
      message: 'A sign-in request was initiated for your WatchHub account. Use the one-time password below to authenticate your session.',
    },
    password_reset: {
      subject: 'WatchHub Account Recovery — Password Reset Code',
      badge: 'Password Reset',
      headline: 'Account Recovery Request',
      message: 'We received a request to reset the password for your WatchHub account. Use the verification code below to set a new password.',
    },
    sensitive_action: {
      subject: 'WatchHub High-Security Verification Code',
      badge: 'Security Authorization',
      headline: 'Authorization Required',
      message: 'Please enter the verification code below to confirm your recent security authorization request.',
    },
  };

  const config = purposeConfig[purpose] || purposeConfig.registration;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #070918;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: separate; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #070918; padding: 40px 10px; }
    .main-card {
      max-width: 580px;
      margin: 0 auto;
      background-color: #091426;
      border: 1px solid #252D42;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
    }
    .header-bar {
      padding: 36px 30px;
      text-align: center;
      background: linear-gradient(180deg, #111729 0%, #091426 100%);
      border-bottom: 1px solid #252D42;
    }
    .crown { font-size: 32px; line-height: 1; margin-bottom: 8px; }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #FFFFFF;
      text-transform: uppercase;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #00D9E8;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .content-area {
      padding: 36px 32px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 9999px;
      background-color: rgba(0, 217, 232, 0.12);
      border: 1px solid rgba(0, 217, 232, 0.35);
      color: #00D9E8;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .greeting {
      font-size: 15px;
      color: #A7B1C2;
      margin-bottom: 8px;
    }
    .headline {
      font-size: 22px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0 0 16px 0;
      letter-spacing: 0.5px;
    }
    .description {
      font-size: 14px;
      line-height: 1.6;
      color: #CBD5E1;
      margin: 0 0 28px 0;
      text-align: left;
    }
    .otp-wrapper {
      background: linear-gradient(135deg, #111729 0%, #070918 100%);
      border: 2px solid #E7B43F;
      border-radius: 18px;
      padding: 24px 20px;
      margin: 20px 0 28px 0;
      box-shadow: 0 10px 30px rgba(231, 180, 63, 0.15);
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      color: #A7B1C2;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 12px;
      color: #E7B43F;
      font-family: 'Courier New', Courier, monospace;
      padding-left: 12px; /* balance letter-spacing */
      margin: 0;
    }
    .otp-expiry {
      font-size: 12px;
      color: #00D9E8;
      font-weight: 600;
      margin-top: 12px;
    }
    .security-notice {
      background-color: rgba(37, 45, 66, 0.4);
      border-left: 4px solid #E7B43F;
      border-radius: 8px;
      padding: 16px 18px;
      text-align: left;
      font-size: 12px;
      line-height: 1.6;
      color: #94A3B8;
      margin-top: 24px;
    }
    .security-notice strong {
      color: #FFFFFF;
    }
    .footer-area {
      padding: 28px 30px;
      text-align: center;
      background-color: #070918;
      border-top: 1px solid #252D42;
      font-size: 11px;
      color: #64748B;
      line-height: 1.7;
    }
    .footer-area a {
      color: #00D9E8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <!-- Brand Header -->
      <div class="header-bar">
        <div class="crown">👑</div>
        <h1 class="brand-title">WATCHHUB</h1>
        <div class="brand-subtitle">Geneva Horology &bull; Luxury Timepieces</div>
      </div>

      <!-- Main Body -->
      <div class="content-area">
        <div class="badge">${config.badge}</div>
        <div class="greeting">Dear ${userName || 'Collector'},</div>
        <h2 class="headline">${config.headline}</h2>
        <p class="description">${config.message}</p>

        <!-- Prominent OTP Container -->
        <div class="otp-wrapper">
          <div class="otp-label">One-Time Verification Code</div>
          <div class="otp-code">${otp}</div>
          <div class="otp-expiry">&#9200; Valid for 5 minutes &bull; Single-use authorization</div>
        </div>

        <!-- Security Warning Advisory -->
        <div class="security-notice">
          <strong>Security Advisory:</strong> WatchHub concierge staff will never request your one-time verification password via telephone, email, or chat. If you did not initiate this request, please change your password and notify our security desk immediately.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-area">
        &copy; 2026 WatchHub Luxury Horology International.<br>
        Geneva &bull; Zurich &bull; London &bull; Dubai &bull; New Delhi &bull; Singapore<br>
        <a href="https://watchhub-store-silk.vercel.app">Official Concierge Portal</a> &bull;
        <a href="https://watchhub-store-silk.vercel.app/support">Client Security</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured in backend environment.');
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: config.subject,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Service Error]', error.message);
      return { success: false, error: error.message };
    }

    // Do NOT log the OTP for security compliance
    console.log(`[Resend Service] Dispatched email OTP to [${email}] successfully with message ID: ${data?.id}`);
    return { success: true, messageId: data?.id, provider: 'Resend' };
  } catch (err) {
    console.error('[Resend Service Exception]', err.message);
    return { success: false, error: err.message };
  }
};

export default sendResendEmailOtp;
