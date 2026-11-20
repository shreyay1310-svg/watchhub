// WatchHub SMS Service Wrapper
// Delegates to provider-based SMS architecture (DevelopmentMockSMSProvider / ProductionSMSProvider)
import { getSmsProvider } from './smsProvider.js';

export const sendFast2SMS = async (mobile, otp, purpose = 'registration') => {
  const provider = getSmsProvider();
  return provider.sendOtp({ mobile, otp, purpose });
};

export default {
  sendFast2SMS,
};
