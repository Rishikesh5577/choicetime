import express from 'express';
import {
  getWatchesNew,
  getWatchByIdNew,
  createWatchNew,
  updateWatchNew,
  deleteWatchNew,
} from '../../controllers/product/watchNew.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getWatchesNew);
router.get('/:id', getWatchByIdNew);

// Protected/Admin routes
router.post('/', protect, createWatchNew);
router.put('/:id', protect, updateWatchNew);
router.delete('/:id', protect, deleteWatchNew);

export default router;

