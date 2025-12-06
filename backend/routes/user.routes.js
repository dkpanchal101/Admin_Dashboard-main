import express from 'express';
import { body } from 'express-validator';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/user.controller.js';
import { protect, isAdminOrManager, authorize } from '../middleware/auth.middleware.js';
import { checkDbConnection } from '../middleware/dbConnection.middleware.js';

const router = express.Router();

// Validation rules
const userValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['Admin', 'Manager', 'Customer', 'Support', 'Sales'])
    .withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Pending', 'Suspended'])
    .withMessage('Invalid status')
];

// Routes
router.get('/stats', protect, isAdminOrManager, getUserStats);
router.get('/', protect, isAdminOrManager, getUsers);
router.get('/:id', protect, isAdminOrManager, getUser);
router.post('/', protect, isAdminOrManager, checkDbConnection, userValidation, createUser);
router.put('/:id', protect, isAdminOrManager, checkDbConnection, userValidation, updateUser);
router.delete('/:id', protect, authorize('Admin'), deleteUser);

export default router;


