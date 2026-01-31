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
} from '../controllers/admin.controller.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
} from '../controllers/category.controller.js';

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

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.post('/categories/:id/subcategories', addSubcategory);
router.delete('/categories/:id/subcategories/:subId', removeSubcategory);

export default router;


