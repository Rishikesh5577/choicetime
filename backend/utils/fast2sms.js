import axios from 'axios';

const FAST2SMS_API_KEY = '1wFebuyq627952JQjs2c1Q4hafm8Ss5yGkxY44jX9uJbHXVGkimYiLoEmy2q';
const FAST2SMS_URL = 'https://www.fast2sms.com/dev/bulkV2';

/**
 * Send OTP via Fast2SMS
 * @param {string} phoneNumber - Phone number (10 digits, without country code)
 * @param {string} otp - 6 digit OTP
 * @returns {Promise<Object>} - Response from Fast2SMS
 */
export const sendOTP = async (phoneNumber, otp) => {
  try {
    // Ensure phone number is 10 digits
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10) {
      throw new Error('Phone number must be 10 digits');
    }

    // Fast2SMS API v2 format
    const response = await axios.get(FAST2SMS_URL, {
      params: {
        authorization: FAST2SMS_API_KEY,
        route: 'otp',
        variables_values: otp,
        numbers: cleanPhone,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Fast2SMS returns success in return field
    if (response.data.return === true) {
      return {
        success: true,
        message: 'OTP sent successfully',
        requestId: response.data.request_id,
      };
    } else {
      throw new Error(response.data.message || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Fast2SMS Error:', error.response?.data || error.message);
    
    // If API call fails, still allow development to continue
    // In production, you might want to throw the error
    if (process.env.NODE_ENV === 'development') {
      console.log('Fast2SMS failed, but continuing in development mode');
      return {
        success: true,
        message: 'OTP would be sent (development mode)',
        devOtp: otp, // Include OTP for testing
      };
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to send OTP');
  }
};

