import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Sale from '../models/Sale.model.js';
import LoginLog from '../models/LoginLog.model.js';
import RegistrationLog from '../models/RegistrationLog.model.js';
import { protect, isAdminOrManager } from '../middleware/auth.middleware.js';

const router = express.Router();

// @desc    Verify database connection and show data
// @route   GET /api/verify/database
// @access  Private (Admin/Manager)
router.get('/database', protect, isAdminOrManager, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    // Get collection counts
    const stats = {
      users: await User.countDocuments(),
      products: await Product.countDocuments(),
      orders: await Order.countDocuments(),
      sales: await Sale.countDocuments(),
      loginlogs: await LoginLog.countDocuments(),
      registrationlogs: await RegistrationLog.countDocuments()
    };

    // Get recent documents
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).select('name category createdAt');
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).select('orderId status total createdAt');

    res.json({
      success: true,
      database: {
        name: dbName,
        connection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        host: mongoose.connection.host
      },
      collections: {
        users: {
          count: stats.users,
          collectionName: 'users',
          recent: recentUsers
        },
        products: {
          count: stats.products,
          collectionName: 'products',
          recent: recentProducts
        },
        orders: {
          count: stats.orders,
          collectionName: 'orders',
          recent: recentOrders
        },
        sales: {
          count: stats.sales,
          collectionName: 'sales'
        },
        loginlogs: {
          count: stats.loginlogs,
          collectionName: 'loginlogs'
        },
        registrationlogs: {
          count: stats.registrationlogs,
          collectionName: 'registrationlogs'
        }
      },
      mongodbAtlas: {
        database: 'admin_dashboard',
        collections: ['users', 'products', 'orders', 'sales', 'loginlogs', 'registrationlogs'],
        note: 'Click Refresh button in MongoDB Atlas if data does not appear'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

