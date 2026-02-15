import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otpStore.js';

const router = express.Router();

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  return new OAuth2Client(clientId);
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Normalize phone to 10 digits for consistent login-by-phone
    let phoneNormalized = '';
    if (phone && typeof phone === 'string') {
      const digits = phone.replace(/\D/g, '');
      phoneNormalized = digits.length === 12 && digits.startsWith('91')
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith('0')
          ? digits.slice(1)
          : digits.length === 10
            ? digits
            : phone.trim();
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phoneNormalized,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
});

// @route   POST /api/auth/google
// @desc    Login or signup with Google OAuth
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required',
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({
        success: false,
        message: 'Google Sign-In is not configured. Add GOOGLE_CLIENT_ID to backend .env',
      });
    }

    const googleClient = getGoogleClient();
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google account must have an email',
      });
    }

    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { googleId }],
    });

    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase(),
        googleId,
        phone: '',
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: user.googleId ? 'Signed in with Google' : 'Account linked with Google',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    const isServerError = !error.message?.includes('Token') && !error.message?.includes('credential');
    res.status(isServerError ? 500 : 401).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Invalid Google credential. Please try again.',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (by email or phone + password)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailOrPhone = (email || '').toString().trim();

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password',
      });
    }

    let user = null;
    if (emailOrPhone.includes('@')) {
      user = await User.findOne({ email: emailOrPhone.toLowerCase() }).select('+password');
    } else {
      const cleanPhone = emailOrPhone.replace(/\D/g, '');
      const phone10 = cleanPhone.length === 12 && cleanPhone.startsWith('91')
        ? cleanPhone.slice(2)
        : cleanPhone.length === 11 && cleanPhone.startsWith('0')
          ? cleanPhone.slice(1)
          : cleanPhone.length === 10
            ? cleanPhone
            : null;
      if (phone10 && phone10.length === 10) {
        user = await User.findOne({
          $or: [
            { phone: phone10 },
            { phone: '0' + phone10 },
            { phone: '91' + phone10 },
          ],
        }).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/phone or password',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validation
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a phone number',
      });
    }

    // Clean phone number (remove non-digits)
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Validate phone number (should be 10 digits for India)
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number',
      });
    }

    // Generate OTP and store (no SMS sent)
    const otp = generateOTP();
    storeOTP(cleanPhone, otp);

    res.status(200).json({
      success: true,
      message: 'OTP generated successfully',
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending OTP',
      error: error.message,
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name, email } = req.body;

    // Validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and OTP',
      });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Verify OTP
    const verification = verifyOTP(cleanPhone, otp);
    
    if (!verification.valid) {
      console.log('OTP verification failed:', verification.message);
      return res.status(400).json({
        success: false,
        message: verification.message,
      });
    }
    
    console.log('OTP verified successfully for phone:', cleanPhone);

    // OTP is valid, now check if user exists
    let user = await User.findOne({ phone: cleanPhone });
    
    console.log('User lookup result:', user ? 'User exists' : 'User not found');

    // If user doesn't exist, require name and email for registration
    if (!user) {
      console.log('User not found, checking for name/email:', { hasName: !!name, hasEmail: !!email });
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'New user registration requires name and email',
          requiresRegistration: true, // Flag to indicate registration needed
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email. Please login with email/password.',
        });
      }

      // Generate a secure random password for OTP users (they can reset it later if needed)
      // Password must be at least 6 characters as per schema
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + '1A@';
      
      // Create new user
      try {
        user = await User.create({
          name,
          email: email.toLowerCase(),
          phone: cleanPhone,
          password: randomPassword, // Random password for OTP users
        });
      } catch (createError) {
        console.error('User creation error:', createError);
        return res.status(400).json({
          success: false,
          message: 'Error creating user account. Please try again.',
          error: createError.message,
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
          isAdmin: req.user.isAdmin,
        },
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
});

export default router;

