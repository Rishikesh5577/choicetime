import express from 'express';
import { getShippingReturnPolicies } from '../controllers/admin.controller.js';

const router = express.Router();

// Public: get all policies for product page
router.get('/', getShippingReturnPolicies);

export default router;
