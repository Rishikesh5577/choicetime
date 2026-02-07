import express from 'express';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Helper: check if user is a new user (0 delivered/completed orders)
const isNewUser = async (userId) => {
  const orderCount = await Order.countDocuments({ user: userId });
  return orderCount === 0;
};

// ============ PUBLIC / USER ROUTES ============

// Get available coupons for the logged-in user
router.get('/available', protect, async (req, res) => {
  try {
    const now = new Date();
    const userIsNew = await isNewUser(req.user._id);

    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: now } },
      ],
    }).select('code description discountType discountValue minOrderAmount maxDiscount forNewUsers forExistingUsers usageLimit usedCount perUserLimit usedBy');

    // Filter coupons the user can actually use
    const available = coupons.filter((c) => {
      // If coupon is for new users only and user is not new, skip
      if (c.forNewUsers && !userIsNew) return false;
      // If coupon is for existing users only and user is new, skip
      if (c.forExistingUsers && userIsNew) return false;
      // Check usage limit
      if (c.usageLimit !== null && c.usedCount >= c.usageLimit) return false;
      // Check per-user limit
      const userUsage = c.usedBy.filter((u) => u.user.toString() === req.user._id.toString()).length;
      if (c.perUserLimit && userUsage >= c.perUserLimit) return false;
      return true;
    });

    res.status(200).json({
      success: true,
      data: {
        coupons: available.map((c) => ({
          code: c.code,
          description: c.description,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderAmount: c.minOrderAmount || 0,
          maxDiscount: c.maxDiscount || null,
          forNewUsers: c.forNewUsers || false,
          forExistingUsers: c.forExistingUsers || false,
        })),
      },
    });
  } catch (error) {
    console.error('Get available coupons error:', error);
    res.status(500).json({ success: false, message: 'Error fetching coupons' });
  }
});

// Validate & apply coupon (user must be logged in)
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    // Check if active
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    // Check if coupon is for new users only
    if (coupon.forNewUsers) {
      const userIsNew = await isNewUser(req.user._id);
      if (!userIsNew) {
        return res.status(400).json({ success: false, message: 'This coupon is only for new users' });
      }
    }

    // Check if coupon is for existing users only
    if (coupon.forExistingUsers) {
      const userIsNew = await isNewUser(req.user._id);
      if (userIsNew) {
        return res.status(400).json({ success: false, message: 'This coupon is only for existing users' });
      }
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
    }

    // Check per-user limit
    const userUsageCount = coupon.usedBy.filter(
      (u) => u.user.toString() === req.user._id.toString()
    ).length;
    if (coupon.perUserLimit && userUsageCount >= coupon.perUserLimit) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon' });
    }

    // Check minimum order amount
    if (cartTotal && cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Discount should not exceed cart total
    if (discount > cartTotal) {
      discount = cartTotal;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.round(discount),
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ success: false, message: 'Error validating coupon' });
  }
});

// ============ ADMIN ROUTES ============

// Get all coupons (admin)
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { coupons } });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ success: false, message: 'Error fetching coupons' });
  }
});

// Create coupon (admin)
router.post('/admin', protect, adminOnly, async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      perUserLimit,
      expiryDate,
      isActive,
      forNewUsers,
      forExistingUsers,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount type, and discount value are required',
      });
    }

    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description: description || '',
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perUserLimit: perUserLimit ? Number(perUserLimit) : 1,
      expiryDate: expiryDate || null,
      isActive: isActive !== false,
      forNewUsers: forNewUsers || false,
      forExistingUsers: forExistingUsers || false,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon },
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }
    res.status(500).json({ success: false, message: 'Error creating coupon' });
  }
});

// Update coupon (admin)
router.put('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { ...req.body, code: req.body.code ? req.body.code.toUpperCase().trim() : undefined },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon },
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ success: false, message: 'Error updating coupon' });
  }
});

// Delete coupon (admin)
router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ success: false, message: 'Error deleting coupon' });
  }
});

// Toggle coupon active status (admin)
router.patch('/admin/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { coupon },
    });
  } catch (error) {
    console.error('Toggle coupon error:', error);
    res.status(500).json({ success: false, message: 'Error toggling coupon status' });
  }
});

export default router;
