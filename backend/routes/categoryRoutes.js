import express from 'express';
import { getCategories } from '../controllers/category.controller.js';

const router = express.Router();

// Public route - no auth required for users to see categories in navbar
router.get('/', getCategories);

export default router;
