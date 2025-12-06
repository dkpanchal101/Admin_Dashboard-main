import express from 'express';
import { body } from 'express-validator';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
} from '../controllers/order.controller.js';
import { protect, isAdminOrManager, authorize } from '../middleware/auth.middleware.js';
import { checkDbConnection } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// Validation rules
const orderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must have at least one item')
    .custom((items) => {
      for (const item of items) {
        if (!item.product || !item.quantity) {
          throw new Error('Each item must have product and quantity');
        }
        if (item.quantity < 1) {
          throw new Error('Quantity must be at least 1');
        }
      }
      return true;
    }),
  body('paymentMethod')
    .optional()
    .isIn(['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'])
    .withMessage('Invalid payment method'),
  body('status')
    .optional()
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status')
];

// Routes
router.get('/stats', protect, getOrderStats);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);
router.post('/', protect, checkDbConnection, orderValidation, createOrder);
router.put('/:id', protect, isAdminOrManager, checkDbConnection, orderValidation, updateOrder);
router.delete('/:id', protect, authorize('Admin'), deleteOrder);

export default router;


