import express from 'express';
import { getAllReels, getAdminReels, createReel, updateReel, deleteReel, toggleReelStatus } from '../controllers/reel.controller.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get active reels for home page
router.get('/', getAllReels);

// Admin routes - require authentication and admin privileges
router.get('/admin', protect, adminOnly, getAdminReels);
router.post('/', protect, adminOnly, createReel);
router.put('/:id', protect, adminOnly, updateReel);
router.delete('/:id', protect, adminOnly, deleteReel);
router.patch('/:id/toggle', protect, adminOnly, toggleReelStatus);

export default router;
