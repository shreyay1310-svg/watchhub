import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkProductsAction,
} from '../controllers/productController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

import { prisma } from '../config/prisma.js';

const router = Router();

// Public Read Endpoints
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return res.status(200).json({ status: 'success', count: categories.length, data: categories });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/brands', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return res.status(200).json({ status: 'success', count: brands.length, data: brands });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Store Admin / Super Admin Mutation Endpoints
router.post('/bulk', authenticate, authorizeRoles('Store Admin', 'Super Admin'), bulkProductsAction);
router.post('/', authenticate, authorizeRoles('Store Admin', 'Super Admin'), createProduct);
router.put('/:id', authenticate, authorizeRoles('Store Admin', 'Super Admin'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('Store Admin', 'Super Admin'), deleteProduct);

export default router;
