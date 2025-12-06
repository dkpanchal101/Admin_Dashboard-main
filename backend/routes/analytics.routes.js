import express from 'express';
import {
  getRevenueAnalytics,
  getTopProducts,
  getUserGrowth,
  getSalesByCategory,
  getChannelPerformance,
  getDashboardOverview
} from '../controllers/analytics.controller.js';
import { protect, isAdminOrManager } from '../middleware/auth.middleware.js';

const router = express.Router();

// All analytics routes require authentication
router.use(protect);

// Routes
router.get('/overview', getDashboardOverview);
router.get('/revenue', getRevenueAnalytics);
router.get('/top-products', getTopProducts);
router.get('/user-growth', isAdminOrManager, getUserGrowth);
router.get('/sales-by-category', getSalesByCategory);
router.get('/channel-performance', getChannelPerformance);

export default router;


