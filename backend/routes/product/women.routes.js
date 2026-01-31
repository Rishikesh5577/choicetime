import express from 'express';
import { getWomenItems, getWomenItemById } from '../../controllers/product/women.controller.js';

const router = express.Router();

// Public routes
router.get('/', getWomenItems);
router.get('/:id', getWomenItemById);

export default router;


