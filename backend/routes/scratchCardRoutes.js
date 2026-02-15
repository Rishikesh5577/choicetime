import express from 'express';
import ScratchCard from '../models/ScratchCard.js';
import Coupon from '../models/Coupon.js';
import Setting from '../models/Setting.js';

const router = express.Router();

const SCRATCH_POPUP_KEY = 'scratchCardPopupActive';

// GET /api/scratch-card/popup-active — public, whether to show scratch & win popup on site
router.get('/popup-active', async (req, res) => {
  try {
    const doc = await Setting.findOne({ key: SCRATCH_POPUP_KEY });
    const active = doc != null && doc.value === false ? false : true;
    res.status(200).json({ success: true, data: { active } });
  } catch (err) {
    res.status(500).json({ success: false, data: { active: true } });
  }
});

// POST /api/scratch-card/scratch
// Public route - no auth needed, just phone number
router.post('/scratch', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number',
      });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');

    // Check if this phone has already scratched
    const existing = await ScratchCard.findOne({ phone: cleanPhone });
    if (existing) {
      return res.status(400).json({
        success: false,
        alreadyScratched: true,
        message: 'You have already scratched the card!',
      });
    }

    // Get all active, non-expired coupons
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } },
      ],
    }).select('code description discountType discountValue minOrderAmount maxDiscount forNewUsers forExistingUsers');

    const couponCodes = coupons.map((c) => ({
      code: c.code,
      description: c.description,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || 0,
      maxDiscount: c.maxDiscount || null,
      forNewUsers: c.forNewUsers || false,
      forExistingUsers: c.forExistingUsers || false,
    }));

    // Record this scratch
    await ScratchCard.create({
      phone: cleanPhone,
      couponsRevealed: couponCodes.map((c) => c.code),
    });

    res.status(200).json({
      success: true,
      message: 'Card scratched successfully!',
      data: { coupons: couponCodes },
    });
  } catch (error) {
    console.error('Scratch card error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        alreadyScratched: true,
        message: 'You have already scratched the card!',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
});

export default router;
