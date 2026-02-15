import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getDashboardSummary,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  deleteUser,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getShippingReturnPolicies,
  createShippingReturnPolicy,
  updateShippingReturnPolicy,
  deleteShippingReturnPolicy,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/summary', getDashboardSummary);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

router.get('/products', getAdminProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/categories', getAdminCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/shipping-returns', getShippingReturnPolicies);
router.post('/shipping-returns', createShippingReturnPolicy);
router.put('/shipping-returns/:id', updateShippingReturnPolicy);
router.delete('/shipping-returns/:id', deleteShippingReturnPolicy);

export default router;


