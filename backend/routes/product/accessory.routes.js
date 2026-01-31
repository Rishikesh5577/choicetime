import express from 'express';
import {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory,
} from '../../controllers/product/accessory.controller.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAccessories);
router.get('/:id', getAccessoryById);

// Protected/Admin routes
router.post('/', protect, createAccessory);
router.put('/:id', protect, updateAccessory);
router.delete('/:id', protect, deleteAccessory);

export default router;

