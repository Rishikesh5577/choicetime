import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
});

// Get single order
router.get('/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
});

// Create order from cart
router.post('/create', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'COD', couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate total amount (product price + box price)
    const subtotal = cart.items.reduce((total, item) => {
      const boxPrice = Number(item.boxPrice) || 0;
      return total + (item.product.price + boxPrice) * item.quantity;
    }, 0);

    // Apply coupon if provided
    let couponDiscount = 0;
    let appliedCouponCode = '';
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon) {
        // Verify coupon is still valid
        const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
        const isOverLimit = coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit;
        const userUsageCount = coupon.usedBy.filter(
          (u) => u.user.toString() === req.user._id.toString()
        ).length;
        const isOverUserLimit = coupon.perUserLimit && userUsageCount >= coupon.perUserLimit;

        if (!isExpired && !isOverLimit && !isOverUserLimit && subtotal >= coupon.minOrderAmount) {
          if (coupon.discountType === 'percentage') {
            couponDiscount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
              couponDiscount = coupon.maxDiscount;
            }
          } else {
            couponDiscount = coupon.discountValue;
          }
          if (couponDiscount > subtotal) couponDiscount = subtotal;
          couponDiscount = Math.round(couponDiscount);
          appliedCouponCode = coupon.code;

          // Record usage
          coupon.usedCount += 1;
          coupon.usedBy.push({ user: req.user._id });
          await coupon.save();
        }
      }
    }

    const totalAmount = subtotal - couponDiscount;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        boxType: item.boxType || '',
        boxPrice: Number(item.boxPrice) || 0,
        price: item.product.price + (Number(item.boxPrice) || 0),
      })),
      totalAmount,
      coupon: appliedCouponCode ? { code: appliedCouponCode, discount: couponDiscount } : { code: '', discount: 0 },
      shippingAddress: shippingAddress || req.user.address || {},
      paymentMethod,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
});

export default router;

