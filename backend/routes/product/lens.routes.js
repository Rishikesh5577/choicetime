import express from 'express';
import {
  getLenses,
  getLensById,
  createLens,
  updateLens,
  deleteLens,
} from '../../controllers/product/lens.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getLenses);
router.get('/:id', getLensById);

// Protected/Admin routes
router.post('/', protect, createLens);
router.put('/:id', protect, updateLens);
router.delete('/:id', protect, deleteLens);

export default router;

