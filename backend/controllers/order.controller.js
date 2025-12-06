import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import { validationResult } from 'express-validator';

// @desc    Get all orders with pagination and filters
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) {
      filter.customerName = { $regex: req.query.customer, $options: 'i' };
    }
    if (req.query.dateFrom) filter.date = { ...filter.date, $gte: new Date(req.query.dateFrom) };
    if (req.query.dateTo) filter.date = { ...filter.date, $lte: new Date(req.query.dateTo) };
    
    // If user is not admin/manager, only show their orders
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.product', 'name price')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    
    // If user is not admin/manager, only allow access to their orders
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    }

    const order = await Order.findOne(filter)
      .populate('customer', 'name email')
      .populate('items.product', 'name price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { items, paymentMethod, shippingAddress } = req.body;

    // Calculate total and validate products
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });

      // Update product stock
      product.stock -= item.quantity;
      product.sales += item.quantity;
      await product.save();
    }

    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let order;
    try {
      order = await Order.create({
        customer: req.user.id,
        customerName: user.name,
        items: orderItems,
        total,
        paymentMethod: paymentMethod || 'Credit Card',
        shippingAddress: shippingAddress || {},
        status: 'Pending'
      });
      console.log(`💾 Order creation initiated: ${order.orderId} (ID: ${order._id})`);
    } catch (createError) {
      console.error('❌ Order creation error:', createError.message);
      console.error('   Stack:', createError.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order in database',
        error: process.env.NODE_ENV === 'development' ? createError.message : undefined
      });
    }

    // Verify order was saved
    let savedOrder;
    try {
      savedOrder = await Order.findById(order._id);
      if (!savedOrder) {
        console.error('❌ Order creation failed - order not found after creation');
        console.error(`   Looking for order ID: ${order._id}`);
        return res.status(500).json({
          success: false,
          message: 'Order created but not found in database. Please check MongoDB connection.'
        });
      }
      console.log(`✅ Order verified in database: ${savedOrder.orderId}`);
    } catch (verifyError) {
      console.error('❌ Order verification error:', verifyError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify order in database',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    // Update user stats
    try {
      user.orders += 1;
      user.totalSpent += total;
      user.averageOrderValue = user.totalSpent / user.orders;
      await user.save();
      console.log(`✅ User stats updated: ${user.email}`);
    } catch (userError) {
      console.error('⚠️  User stats update failed:', userError.message);
      // Don't fail the request if user stats update fails
    }

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'name price');

    console.log(`✅ Order created successfully: ${order.orderId} (Total: $${total})`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin/Manager)
export const updateOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('customer', 'name email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If order is delivered, update deliveredAt
    if (req.body.status === 'Delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
      await order.save();
    }

    // Verify order was saved
    let savedOrder;
    try {
      savedOrder = await Order.findById(order._id);
      if (!savedOrder) {
        console.error('❌ Order update failed - order not found after update');
        console.error(`   Looking for order ID: ${order._id}`);
        return res.status(500).json({
          success: false,
          message: 'Order updated but not found in database. Please check MongoDB connection.'
        });
      }
      console.log(`✅ Order verified in database: ${savedOrder.orderId}`);
    } catch (verifyError) {
      console.error('❌ Order verification error:', verifyError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify order in database',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    console.log(`✅ Order updated successfully: ${order.orderId} (Status: ${order.status})`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Order update error:', error.message);
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Restore product stock if order is cancelled
    if (order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.sales = Math.max(0, product.sales - item.quantity);
          await product.save();
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
export const getOrderStats = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    }

    const totalOrders = await Order.countDocuments(filter);
    const pendingOrders = await Order.countDocuments({ ...filter, status: 'Pending' });
    const completedOrders = await Order.countDocuments({ ...filter, status: 'Delivered' });

    const revenueResult = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenueResult[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};


