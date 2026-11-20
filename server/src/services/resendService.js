// Resend Production Email Integration Service for WatchHub Atelier
// Luxury Haute Horlogerie Transactional Email Templates
import { Resend } from 'resend';
import {
  generateLuxuryEmailHtml,
  generateLuxuryEmailText,
  getEmailPurposeConfig,
} from './emailTemplates.js';

/**
 * RFC 2606 / RFC 6761 reserved test domain check
 */
const isReservedTestDomain = (email) => {
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

export const sendResendEmailOtp = async ({
  email,
  otp,
  purpose = 'registration',
  userName = 'Valued Collector',
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'WatchHub Atelier <onboarding@resend.dev>';
  const cleanRecipient = (email || '').toLowerCase().trim();

  // Controlled test domain isolation
  if (isReservedTestDomain(cleanRecipient)) {
    console.log(`[Resend Test Sandbox] Intercepted test domain (${cleanRecipient}). Simulated delivery SUCCESS.`);
    return {
      success: true,
      messageId: `resend-test-${Date.now()}`,
      provider: 'Resend_Sandbox',
      simulated: true,
    };
  }

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured in backend environment.');
  }

  const config = getEmailPurposeConfig(purpose);
  const htmlContent = generateLuxuryEmailHtml({ otp, purpose, userName });
  const textContent = generateLuxuryEmailText({ otp, purpose, userName });

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [cleanRecipient],
      subject: config.subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('[Resend Service Error]', error.message);
      return { success: false, error: error.message };
    }

    console.log(`[Resend Service] Dispatched luxury email to [${cleanRecipient}] successfully with message ID: ${data?.id}`);
    return { success: true, messageId: data?.id, provider: 'Resend' };
  } catch (err) {
    console.error('[Resend Service Exception]', err.message);
    return { success: false, error: err.message };
  }
};

export default sendResendEmailOtp;
