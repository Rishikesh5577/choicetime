import express from 'express';
import { getOrderTimeline } from '../controllers/admin.controller.js';

const router = express.Router();

// Public: GET order timeline config (for Order Success page)
router.get('/order-timeline', getOrderTimeline);

export default router;
