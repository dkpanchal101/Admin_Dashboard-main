import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [];

    for (let i = 0; i < 12; i++) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (11 - i));
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const monthOrders = await Order.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lt: endDate },
            status: { $ne: 'Cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total' },
            orders: { $sum: 1 }
          }
        }
      ]);

      revenueData.push({
        month: months[startDate.getMonth()],
        revenue: monthOrders[0]?.revenue || 0,
        orders: monthOrders[0]?.orders || 0
      });
    }

    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top products
// @route   GET /api/analytics/top-products
// @access  Private
export const getTopProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const topProducts = await Product.find()
      .sort({ sales: -1 })
      .limit(limit)
      .select('name sales price');

    const products = topProducts.map(product => ({
      name: product.name,
      sales: product.sales,
      revenue: product.price * product.sales
    }));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user growth analytics
// @route   GET /api/analytics/user-growth
// @access  Private (Admin/Manager)
export const getUserGrowth = async (req, res, next) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const growthData = [];

    for (let i = 0; i < 12; i++) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (11 - i));
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const users = await User.countDocuments({
        registeredAt: { $gte: startDate, $lt: endDate }
      });

      growthData.push({
        month: months[startDate.getMonth()],
        users
      });
    }

    res.json({
      success: true,
      data: growthData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales by category
// @route   GET /api/analytics/sales-by-category
// @access  Private
export const getSalesByCategory = async (req, res, next) => {
  try {
    const categoryData = await Order.aggregate([
      {
        $unwind: '$items'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$total',
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get channel performance
// @route   GET /api/analytics/channel-performance
// @access  Private
export const getChannelPerformance = async (req, res, next) => {
  try {
    // This is a mock implementation - in real app, you'd track order sources
    const channels = ['Organic Search', 'Paid Search', 'Direct', 'Social Media', 'Referral', 'Email'];
    const channelData = [];

    for (const channel of channels) {
      // Mock data - replace with actual tracking
      const value = Math.floor(Math.random() * 5000) + 1000;
      channelData.push({ name: channel, value });
    }

    res.json({
      success: true,
      data: channelData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard overview
// @route   GET /api/analytics/overview
// @access  Private
export const getDashboardOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ status: { $ne: 'Cancelled' } }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};


