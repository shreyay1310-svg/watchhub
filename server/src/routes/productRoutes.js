import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticate, authorizeRoles('Super Admin', 'Store Admin'), createProduct);

export default router;

