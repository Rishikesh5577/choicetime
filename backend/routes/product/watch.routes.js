import express from 'express';
import {
  getWatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
} from '../../controllers/product/watch.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getWatches);
router.get('/:id', getWatchById);

// Protected/Admin routes
router.post('/', protect, createWatch);
router.put('/:id', protect, updateWatch);
router.delete('/:id', protect, deleteWatch);

export default router;

