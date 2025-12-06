import Sale from '../models/Sale.model.js';
import { validationResult } from 'express-validator';

// @desc    Get all sales with pagination and filters
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.channel) filter.channel = req.query.channel;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customerId) filter.customer = req.query.customerId;
    if (req.query.productId) filter.product = req.query.productId;
    if (req.query.dateFrom) filter.saleDate = { ...filter.saleDate, $gte: new Date(req.query.dateFrom) };
    if (req.query.dateTo) filter.saleDate = { ...filter.saleDate, $lte: new Date(req.query.dateTo) };

    // If user is customer, only show their sales
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    }

    const sales = await Sale.find(filter)
      .populate('customer', 'name email')
      .populate('product', 'name category price')
      .populate('order', 'orderId status')
      .sort({ saleDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments(filter);

    res.json({
      success: true,
      data: sales,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
export const getSale = async (req, res, next) => {
  try {
    const filter = { _id: req.params.id };
    
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    }

    const sale = await Sale.findOne(filter)
      .populate('customer', 'name email')
      .populate('product', 'name category price image')
      .populate('order', 'orderId status paymentMethod');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private
export const getSalesStats = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'Customer') {
      filter.customer = req.user.id;
    }

    const [
      totalSales,
      totalRevenue,
      salesByCategory,
      salesByChannel,
      recentSales
    ] = await Promise.all([
      Sale.countDocuments(filter),
      Sale.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Sale.aggregate([
        { $match: filter },
        { $group: { _id: '$category', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Sale.aggregate([
        { $match: filter },
        { $group: { _id: '$channel', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Sale.countDocuments({
        ...filter,
        saleDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalSales,
        totalRevenue: totalRevenue[0]?.total || 0,
        salesByCategory: salesByCategory.map(item => ({
          category: item._id,
          total: item.total,
          count: item.count
        })),
        salesByChannel: salesByChannel.map(item => ({
          channel: item._id,
          total: item.total,
          count: item.count
        })),
        recentSales
      }
    });
  } catch (error) {
    next(error);
  }
};

