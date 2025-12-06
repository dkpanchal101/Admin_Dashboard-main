import express from 'express';
import {
  getSales,
  getSale,
  getSalesStats
} from '../controllers/sale.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/stats', getSalesStats);
router.get('/', getSales);
router.get('/:id', getSale);

export default router;

