import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import ReturnRequest from '../models/ReturnRequest.js';
import Order from '../models/Order.js';

const router = express.Router();
const RETURN_DAYS = 30; // return allowed within 30 days of delivery/order

function getReturnWindowEnd(order) {
  const base = order.deliveredDate ? new Date(order.deliveredDate) : new Date(order.orderDate);
  const end = new Date(base);
  end.setDate(end.getDate() + RETURN_DAYS);
  return end;
}

function canReturnOrder(order) {
  if (!order) return false;
  const status = (order.status || '').toLowerCase();
  if (status !== 'delivered' && status !== 'shipped') return false;
  const windowEnd = getReturnWindowEnd(order);
  return new Date() <= windowEnd;
}

// GET /api/returns - my return requests
router.get('/', protect, async (req, res) => {
  try {
    const list = await ReturnRequest.find({ user: req.user._id })
      .populate('order', 'orderDate status totalAmount')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { returns: list } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/returns - create return request
router.post('/', protect, async (req, res) => {
  try {
    const { orderId, reason, photoUrls, videoUrl } = req.body;

    if (!orderId || !reason || typeof reason !== 'string' || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and reason (description) are required',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your order' });
    }

    if (!canReturnOrder(order)) {
      return res.status(400).json({
        success: false,
        message: 'Return window has expired or order is not eligible for return',
      });
    }

    const existing = await ReturnRequest.findOne({ order: orderId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Return request already submitted for this order',
      });
    }

    const doc = await ReturnRequest.create({
      order: orderId,
      user: req.user._id,
      reason: reason.trim(),
      photoUrls: Array.isArray(photoUrls) ? photoUrls.filter(Boolean) : [],
      videoUrl: typeof videoUrl === 'string' ? videoUrl.trim() : '',
    });

    const populated = await ReturnRequest.findById(doc._id).populate('order', 'orderDate status totalAmount');
    res.status(201).json({ success: true, data: { return: populated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/returns/check/:orderId - check if order can be returned (for UI)
router.get('/check/:orderId', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, data: { canReturn: false } });
    }
    const existing = await ReturnRequest.findOne({ order: order._id });
    const canReturn = !existing && canReturnOrder(order);
    const returnWindowEnd = getReturnWindowEnd(order);
    res.status(200).json({
      success: true,
      data: {
        canReturn,
        alreadyRequested: !!existing,
        returnWindowEnd: returnWindowEnd.toISOString(),
        status: order.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
export { canReturnOrder, getReturnWindowEnd, RETURN_DAYS };
