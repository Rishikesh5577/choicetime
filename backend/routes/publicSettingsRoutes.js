import express from 'express';
import { getOrderTimeline, getShippingConfig } from '../controllers/admin.controller.js';

const router = express.Router();

// Public: GET order timeline config (for Order Success page)
router.get('/order-timeline', getOrderTimeline);
router.get('/shipping', getShippingConfig);

export default router;
