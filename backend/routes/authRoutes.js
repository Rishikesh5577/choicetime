import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { protect } from '../middleware/authMiddleware.js';
import { sendOTP } from '../utils/fast2sms.js';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otpStore.js';

const router = express.Router();

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

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
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

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
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

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    storeOTP(cleanPhone, otp);

    // Send OTP via Fast2SMS
    try {
      await sendOTP(cleanPhone, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your phone number',
      });
    } catch (smsError) {
      console.error('SMS sending error:', smsError);
      // Still return success but log the error
      // In development, you might want to return the OTP for testing
      res.status(200).json({
        success: true,
        message: 'OTP generated successfully',
        // Only include OTP in development for testing
        ...(process.env.NODE_ENV === 'development' && { otp }),
      });
    }
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

