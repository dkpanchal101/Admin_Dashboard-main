import User from '../models/User.model.js';
import { validationResult } from 'express-validator';

// @desc    Get all users with pagination and filters
// @route   GET /api/users
// @access  Private (Admin/Manager)
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin/Manager)
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin/Manager)
export const createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let user;
    try {
      user = await User.create(req.body);
      console.log(`💾 User creation initiated: ${user.email} (ID: ${user._id})`);
    } catch (createError) {
      console.error('❌ User creation error:', createError.message);
      console.error('   Stack:', createError.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user in database',
        error: process.env.NODE_ENV === 'development' ? createError.message : undefined
      });
    }

    // Verify user was saved
    let savedUser;
    try {
      savedUser = await User.findById(user._id);
      if (!savedUser) {
        console.error('❌ User creation failed - user not found after creation');
        console.error(`   Looking for user ID: ${user._id}`);
        return res.status(500).json({
          success: false,
          message: 'User created but not found in database. Please check MongoDB connection.'
        });
      }
      console.log(`✅ User verified in database: ${savedUser.email}`);
    } catch (verifyError) {
      console.error('❌ User verification error:', verifyError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify user in database',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    console.log(`✅ User created successfully: ${user.email} (ID: ${user._id})`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin/Manager)
export const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Don't allow password update through this route
    delete req.body.password;

    let user;
    try {
      user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify user was saved
      const savedUser = await User.findById(user._id);
      if (!savedUser) {
        console.error('❌ User update failed - user not found after update');
        return res.status(500).json({
          success: false,
          message: 'User updated but not found in database. Please check MongoDB connection.'
        });
      }

      console.log(`✅ User updated successfully: ${user.email} (ID: ${user._id})`);
      console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
    } catch (error) {
      console.error('❌ User update error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user in database',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin/Manager)
export const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    
    const newUsersToday = await User.countDocuments({
      registeredAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const inactiveUsers = await User.countDocuments({ status: 'Inactive' });
    const churnRate = totalUsers > 0 ? ((inactiveUsers / totalUsers) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsersToday,
        activeUsers,
        churnRate: `${churnRate}%`
      }
    });
  } catch (error) {
    next(error);
  }
};


