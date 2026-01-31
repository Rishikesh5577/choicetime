import express from 'express';
import { getMenItems, getMenItemById } from '../../controllers/product/men.controller.js';

const router = express.Router();

// Public routes
router.get('/', getMenItems);
router.get('/:id', getMenItemById);

export default router;


