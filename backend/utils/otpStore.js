// In-memory OTP storage
// In production, consider using Redis for better scalability

const otpStore = new Map();

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6 digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP with expiration (10 minutes)
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP code
 */
export const storeOTP = (phoneNumber, otp) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  otpStore.set(cleanPhone, {
    otp,
    expiresAt,
    attempts: 0,
  });

  // Clean up expired OTPs periodically
  setTimeout(() => {
    otpStore.delete(cleanPhone);
  }, 10 * 60 * 1000);
};

/**
 * Verify OTP
 * @param {string} phoneNumber - Phone number
 * @param {string} otp - OTP code to verify
 * @returns {boolean} - True if OTP is valid
 */
export const verifyOTP = (phoneNumber, otp) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const stored = otpStore.get(cleanPhone);

  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(cleanPhone);
    return { valid: false, message: 'OTP has expired' };
  }

  if (stored.attempts >= 5) {
    otpStore.delete(cleanPhone);
    return { valid: false, message: 'Too many failed attempts. Please request a new OTP' };
  }

  if (stored.otp !== otp) {
    stored.attempts += 1;
    return { valid: false, message: 'Invalid OTP' };
  }

  // OTP is valid, remove it
  otpStore.delete(cleanPhone);
  return { valid: true, message: 'OTP verified successfully' };
};

/**
 * Get stored OTP (for debugging)
 * @param {string} phoneNumber - Phone number
 * @returns {Object|null} - Stored OTP data or null
 */
export const getStoredOTP = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return otpStore.get(cleanPhone) || null;
};

