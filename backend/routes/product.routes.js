import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} from '../controllers/product.controller.js';
import { protect, isAdminOrManager } from '../middleware/auth.middleware.js';
import { checkDbConnection } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive'])
    .withMessage('Invalid category'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('sales')
    .optional()
    .isInt({ min: 0 }).withMessage('Sales must be a non-negative integer'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
];

// Routes
router.get('/stats', protect, getProductStats);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, isAdminOrManager, checkDbConnection, productValidation, createProduct);
router.put('/:id', protect, isAdminOrManager, checkDbConnection, productValidation, updateProduct);
router.delete('/:id', protect, isAdminOrManager, deleteProduct);

export default router;


