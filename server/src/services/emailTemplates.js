// WatchHub Atelier — Haute Horlogerie Luxury Email Templates
// Inspired by elite Swiss watch maisons: Patek Philippe, Vacheron Constantin, Audemars Piguet
// Table-based responsive email layout with inline CSS for universal Gmail & Outlook rendering.

/**
 * HTML Entity Escaper for dynamic user-controlled strings
 */
export const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Purpose-specific copy configuration for WatchHub communications
 */
export const getEmailPurposeConfig = (purpose = 'password_reset', expiryMinutes = 5) => {
  const expiryText = `This verification code expires in ${expiryMinutes} minutes.`;
  const configs = {
    password_reset: {
      subject: 'WatchHub Atelier — Password Reset Verification Code',
      eyebrow: 'ACCOUNT SECURITY',
      heading: 'Reset Your Password',
      salutationDefault: 'Valued Collector',
      introMessage:
        'We received a request to reset the password associated with your WatchHub account.<br>To securely continue, use the verification code below.',
      expiryText,
      securityHeading: 'SECURITY NOTICE',
      securityBody:
        'If you did not request a password reset, please ignore this email. Your account password will remain unchanged.<br><br>Never share this verification code with anyone, including people claiming to represent WatchHub.',
    },
    registration: {
      subject: 'WatchHub Atelier — Welcome & Email Verification',
      eyebrow: 'COLLECTOR MEMBERSHIP',
      heading: 'Verify Your Email Address',
      salutationDefault: 'Valued Collector',
      introMessage:
        'Thank you for joining the WatchHub Atelier. To activate your horological collector portfolio and secure your account, please verify your email address using the code below.',
      expiryText,
      securityHeading: 'SECURITY NOTICE',
      securityBody:
        'If you did not create an account with WatchHub Atelier, please disregard this email.<br><br>Never share this verification code with anyone.',
    },
    login: {
      subject: 'WatchHub Atelier — Sign-In Authentication Code',
      eyebrow: 'SIGN-IN SECURITY',
      heading: 'Authentication Request',
      salutationDefault: 'Valued Collector',
      introMessage:
        'A sign-in request was initiated for your WatchHub Atelier account.<br>Use the single-use verification code below to authenticate your session.',
      expiryText,
      securityHeading: 'SECURITY NOTICE',
      securityBody:
        'If you did not initiate this authentication request, someone may be attempting to access your account. Please change your password immediately.<br><br>WatchHub Atelier ambassadors will never ask for your code.',
    },
    sensitive_action: {
      subject: 'WatchHub Atelier — High-Security Authorization Code',
      eyebrow: 'AUTHORIZATION REQUIRED',
      heading: 'Security Authorization',
      salutationDefault: 'Valued Collector',
      introMessage:
        'A high-security action has been requested on your WatchHub account.<br>Please enter the verification code below to confirm this action.',
      expiryText,
      securityHeading: 'SECURITY NOTICE',
      securityBody:
        'If you did not perform this action, please secure your account credentials immediately.<br><br>Do not disclose this code under any circumstances.',
    },
  };

  return configs[purpose] || configs.password_reset;
};

/**
 * Generates the premium luxury HTML email template
 */
export const generateLuxuryEmailHtml = ({
  otp,
  purpose = 'password_reset',
  userName = 'Valued Collector',
  expiryMinutes = 5,
}) => {
  const config = getEmailPurposeConfig(purpose, expiryMinutes);
  const currentYear = new Date().getFullYear();
  const safeName = escapeHtml(userName && userName.trim() ? userName.trim() : config.salutationDefault);
  const safeOtp = escapeHtml(otp ? String(otp).trim() : '000000');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${escapeHtml(config.subject)}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Georgia, 'Times New Roman', serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #111111;
      color: #202020;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      -ms-interpolation-mode: bicubic;
    }
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        width: 100% !important;
        padding: 20px 12px !important;
      }
      .card-table {
        width: 100% !important;
      }
      .card-cell {
        padding: 36px 24px !important;
      }
      .heading-title {
        font-size: 22px !important;
        line-height: 28px !important;
      }
      .otp-code {
        font-size: 32px !important;
        letter-spacing: 8px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #111111; -webkit-font-smoothing: antialiased;">
  <!-- Outer Background Container -->
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#111111" class="email-wrapper" style="background-color: #111111; width: 100%; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <!-- Preheader preview text (hidden) -->
        <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #111111; mso-hide: all;">
          WatchHub Atelier account security: Your password reset verification code is ${safeOtp}. Valid for ${expiryMinutes} minutes.
        </div>

        <!-- Main Ivory Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="580" class="card-table" style="max-width: 580px; width: 100%; background-color: #FAF8F3; border-radius: 4px; border: 1px solid #DED8CC; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);">
          <tr>
            <td class="card-cell" style="padding: 48px 44px; background-color: #FAF8F3; border-radius: 4px;">

              <!-- 1. Centered Luxury Brand Header -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; letter-spacing: 4px; color: #202020; text-transform: uppercase; line-height: 1.2;">
                      WATCHHUB
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 6px; color: #B99A5B; text-transform: uppercase; margin-top: 4px;">
                      ATELIER
                    </div>
                    <!-- Champagne Gold Divider -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin-top: 14px;">
                      <tr>
                        <td width="48" height="1" bgcolor="#B99A5B" style="width: 48px; height: 1px; background-color: #B99A5B; font-size: 1px; line-height: 1px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- 2. Eyebrow & Main Heading -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 6px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2.5px; color: #B99A5B; text-transform: uppercase;">
                      ${escapeHtml(config.eyebrow)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <h1 class="heading-title" style="margin: 0; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; letter-spacing: 0.5px; color: #202020; line-height: 32px;">
                      ${escapeHtml(config.heading)}
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- 3. Salutation & Body Copy -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #202020; padding-bottom: 8px;">
                    Dear ${safeName},
                  </td>
                </tr>
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px; color: #55524B; padding-bottom: 28px;">
                    ${config.introMessage}
                  </td>
                </tr>
              </table>

              <!-- 4. Large Centered OTP Verification Component -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F4EFE6; border: 1px solid #B99A5B; border-radius: 4px; margin-bottom: 28px;">
                <tr>
                  <td align="center" style="padding: 26px 20px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #77736B; text-transform: uppercase; margin-bottom: 10px;">
                      VERIFICATION CODE
                    </div>
                    <!-- Monospace Large OTP Digits -->
                    <div class="otp-code" style="font-family: 'Courier New', Courier, Consolas, monospace; font-size: 38px; font-weight: 700; letter-spacing: 12px; color: #202020; padding-left: 12px; line-height: 1.2; margin: 4px 0;">
                      ${safeOtp}
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; color: #77736B; margin-top: 10px;">
                      ${escapeHtml(config.expiryText)}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- 5. Bordered Security Notice -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; border: 1px solid #DED8CC; border-left: 3px solid #B99A5B; border-radius: 2px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #202020; text-transform: uppercase; margin-bottom: 8px;">
                      ${escapeHtml(config.securityHeading)}
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 19px; color: #77736B;">
                      ${config.securityBody}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- 6. Footer Divider & Brand Sign-off -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid #DED8CC; padding-top: 28px;" align="center">
                    <div style="font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #202020; text-transform: uppercase; margin-bottom: 4px;">
                      WATCHHUB ATELIER
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 2px; color: #B99A5B; text-transform: uppercase; margin-bottom: 16px;">
                      TIMELESS ELEGANCE. TRUSTED CRAFTSMANSHIP.
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 17px; color: #77736B; margin-bottom: 8px;">
                      This is an automated account security email. Please do not reply directly.
                    </div>
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 17px; color: #77736B;">
                      &copy; ${currentYear} WatchHub Atelier. All rights reserved.
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!-- End Main Ivory Card -->

      </td>
    </tr>
  </table>
  <!-- End Outer Background Container -->
</body>
</html>`;
};

/**
 * Generates the clean plain-text luxury email alternative
 */
export const generateLuxuryEmailText = ({
  otp,
  purpose = 'password_reset',
  userName = 'Valued Collector',
  expiryMinutes = 5,
}) => {
  const config = getEmailPurposeConfig(purpose, expiryMinutes);
  const currentYear = new Date().getFullYear();
  const safeName = userName && userName.trim() ? userName.trim() : config.salutationDefault;
  const safeOtp = otp ? String(otp).trim() : '000000';

  // Plain-text version of security message without HTML tags
  const plainIntro = config.introMessage.replace(/<br\s*\/?>/gi, '\n');
  const plainSecurity = config.securityBody.replace(/<br\s*\/?>/gi, '\n');

  return `============================================================
WATCHHUB ATELIER
TIMELESS ELEGANCE. TRUSTED CRAFTSMANSHIP.
============================================================

${config.eyebrow}
${config.heading}

Dear ${safeName},

${plainIntro}

------------------------------------------------------------
VERIFICATION CODE: ${safeOtp}
------------------------------------------------------------
${config.expiryText}

${config.securityHeading}
${plainSecurity}

------------------------------------------------------------
WATCHHUB ATELIER
TIMELESS ELEGANCE. TRUSTED CRAFTSMANSHIP.
This is an automated account security email. Please do not reply directly.
(c) ${currentYear} WatchHub Atelier. All rights reserved.
============================================================
`;
};
