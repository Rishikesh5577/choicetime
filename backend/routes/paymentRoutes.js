import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Test route to verify payment routes are working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Payment routes are working',
  });
});

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  Razorpay keys not found in environment variables. Payment gateway will not work.');
}

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Payment gateway is not configured. Please contact administrator.',
      });
    }

    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate total amount (in paise for Razorpay)
    const totalAmount = cart.items.reduce((total, item) => {
      const itemPrice = item.product?.price || item.product?.finalPrice || item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0);

    const amountInPaise = Math.round(totalAmount * 100); // Convert to paise

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        cartId: cart._id.toString(),
      },
    });

    // Create order in database (pending payment)
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map((item) => {
        const itemPrice = item.product?.price || item.product?.finalPrice || item.price || 0;
        return {
          product: item.product,
          quantity: item.quantity,
          size: item.size || '',
          color: item.color || '',
          price: itemPrice,
        };
      }),
      totalAmount,
      shippingAddress: shippingAddress || req.user.address || {},
      paymentMethod: 'razorpay',
      status: 'pending',
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
        order: order,
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message,
    });
  }
});

// Verify payment and update order
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Find order by Razorpay order ID
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order with payment details
    order.paymentId = razorpay_payment_id;
    order.paymentSignature = razorpay_signature;
    order.status = 'processing';
    order.paymentStatus = 'paid';
    await order.save();

    // Clear cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message,
    });
  }
});

export default router;

