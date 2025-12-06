import User from '../models/User.model.js';
import LoginLog from '../models/LoginLog.model.js';
import RegistrationLog from '../models/RegistrationLog.model.js';
import { generateToken } from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // Log failed registration attempt
      const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      const userAgent = req.headers['user-agent'];
      await RegistrationLog.create({
        email,
        name: name || 'Unknown',
        role: role || 'Customer',
        registrationSource: req.body.registrationSource || 'Website',
        ipAddress,
        userAgent,
        status: 'Failed',
        failureReason: 'User already exists'
      });

      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Get registration details
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    const registrationSource = req.body.registrationSource || 'Website';

    // Create user
    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
        role: role || 'Customer',
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        address: req.body.address,
        company: req.body.company,
        registrationSource
      });
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

    // Verify user was saved to database
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

    // Log registration
    try {
      await RegistrationLog.create({
        user: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        registrationSource,
        ipAddress,
        userAgent,
        status: 'Success'
      });
      console.log(`📝 Registration logged in database`);
    } catch (logError) {
      console.error('⚠️  Registration log creation failed:', logError.message);
      // Don't fail the request if logging fails, but log the error
    }

    console.log(`✅ User registered successfully: ${user.email} (ID: ${user._id})`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('❌ User registration error:', error.message);
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    // Log login attempt (before checking password to track failed attempts)
    if (!user) {
      // Log failed login attempt
      await LoginLog.create({
        email,
        ipAddress,
        userAgent,
        status: 'Failed',
        failureReason: 'User not found'
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      // Log failed login attempt
      await LoginLog.create({
        user: user._id,
        email: user.email,
        ipAddress,
        userAgent,
        status: 'Failed',
        failureReason: 'Invalid password'
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      // Log failed login attempt
      await LoginLog.create({
        user: user._id,
        email: user.email,
        ipAddress,
        userAgent,
        status: 'Failed',
        failureReason: 'Account not active'
      });

      return res.status(403).json({
        success: false,
        message: 'Account is not active. Please contact administrator.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Log successful login
    await LoginLog.create({
      user: user._id,
      email: user.email,
      ipAddress,
      userAgent,
      status: 'Success'
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the logout event if needed
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};


