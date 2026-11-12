export const sendFast2SMS = async (mobile, otp) => {
  const apiKey =
    process.env.FAST2SMS_API_KEY ||
    'HpE4ERBuWpLTrc13ds5eRojQqrtgVmazwVK1OAUQnbNgsU0Lnw5CfzRhIxJ7MjyHs6NAxpLMr7wrpy6q';
  const cleanMobile = (mobile || '').replace(/[^0-9]/g, '').slice(-10);

  if (cleanMobile.length < 10) {
    return { success: false, message: 'Invalid 10-digit mobile number' };
  }

  // 1. Try Fast2SMS 'otp' route
  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables_values: otp.toString(),
        route: 'otp',
        numbers: cleanMobile,
      }),
    });
    const data = await res.json();
    if (data.return) {
      return { success: true, route: 'otp', data };
    }
    console.warn('[Fast2SMS] OTP route response:', data);
  } catch (err) {
    console.warn('[Fast2SMS] OTP route error:', err.message);
  }

  // 2. Try Fast2SMS 'q' (Quick SMS) route
  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message: `Your WatchHub verification OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
        numbers: cleanMobile,
      }),
    });
    const data = await res.json();
    return { success: !!data.return, route: 'q', data, message: data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
