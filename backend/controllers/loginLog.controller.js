import LoginLog from '../models/LoginLog.model.js';

// @desc    Get login logs with pagination and filters
// @route   GET /api/auth/login-logs
// @access  Private (Admin/Manager)
export const getLoginLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: 'i' };
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.userId) {
      filter.user = req.query.userId;
    }
    if (req.query.dateFrom) {
      filter.loginAt = { ...filter.loginAt, $gte: new Date(req.query.dateFrom) };
    }
    if (req.query.dateTo) {
      filter.loginAt = { ...filter.loginAt, $lte: new Date(req.query.dateTo) };
    }

    const logs = await LoginLog.find(filter)
      .populate('user', 'name email role')
      .sort({ loginAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LoginLog.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get login statistics
// @route   GET /api/auth/login-stats
// @access  Private (Admin/Manager)
export const getLoginStats = async (req, res, next) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      totalLogins,
      successfulLogins,
      failedLogins,
      uniqueUsers,
      recentLogins
    ] = await Promise.all([
      LoginLog.countDocuments(),
      LoginLog.countDocuments({ status: 'Success' }),
      LoginLog.countDocuments({ status: 'Failed' }),
      LoginLog.distinct('user', { status: 'Success', user: { $ne: null } }),
      LoginLog.countDocuments({ loginAt: { $gte: last30Days } })
    ]);

    // Get top failed login attempts
    const topFailedEmails = await LoginLog.aggregate([
      { $match: { status: 'Failed' } },
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        totalLogins,
        successfulLogins,
        failedLogins,
        uniqueUsers: uniqueUsers.length,
        recentLogins,
        successRate: totalLogins > 0 ? ((successfulLogins / totalLogins) * 100).toFixed(2) + '%' : '0%',
        topFailedEmails: topFailedEmails.map(item => ({
          email: item._id,
          attempts: item.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user login history
// @route   GET /api/auth/login-logs/user/:userId
// @access  Private
export const getUserLoginHistory = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Users can only see their own history unless they're admin/manager
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager' && req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const logs = await LoginLog.find({ user: userId })
      .sort({ loginAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LoginLog.countDocuments({ user: userId });

    res.json({
      success: true,
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

