import express from 'express';
import { getRegistrationLogs, getRegistrationLog } from '../controllers/registrationLog.controller.js';
import { protect, isAdminOrManager } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin/manager role
router.use(protect);
router.use(isAdminOrManager);

// @route   GET /api/registration-logs
// @desc    Get all registration logs
// @access  Private (Admin/Manager)
router.get('/', getRegistrationLogs);

// @route   GET /api/registration-logs/:id
// @desc    Get single registration log
// @access  Private (Admin/Manager)
router.get('/:id', getRegistrationLog);

export default router;

