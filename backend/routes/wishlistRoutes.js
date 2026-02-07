import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wishlist - Get user's wishlist
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { wishlist: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        wishlist: wishlist.items.map((item) => ({
          productId: item.productId.toString(),
          addedAt: item.addedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error fetching wishlist' });
  }
});

// POST /api/wishlist/add - Add product to wishlist
router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [{ productId }],
      });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.items.some(
        (item) => item.productId.toString() === productId.toString()
      );

      if (exists) {
        return res.status(200).json({
          success: true,
          message: 'Product already in wishlist',
        });
      }

      wishlist.items.push({ productId });
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error adding to wishlist' });
  }
});

// DELETE /api/wishlist/remove/:productId - Remove product from wishlist
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(200).json({ success: true, message: 'Wishlist is empty' });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error removing from wishlist' });
  }
});

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/check/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(200).json({ success: true, data: { inWishlist: false } });
    }

    const inWishlist = wishlist.items.some(
      (item) => item.productId.toString() === productId.toString()
    );

    res.status(200).json({
      success: true,
      data: { inWishlist },
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ success: false, message: 'Error checking wishlist' });
  }
});

export default router;
