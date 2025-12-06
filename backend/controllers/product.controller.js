import Product from '../models/Product.model.js';
import { validationResult } from 'express-validator';

// @desc    Get all products with pagination and filters
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { category: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    if (req.query.minPrice) filter.price = { ...filter.price, $gte: parseFloat(req.query.minPrice) };
    if (req.query.maxPrice) filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Manager)
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let product;
    try {
      product = await Product.create(req.body);
      console.log(`💾 Product creation initiated: ${product.name} (ID: ${product._id})`);
    } catch (createError) {
      console.error('❌ Product creation error:', createError.message);
      console.error('   Stack:', createError.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to create product in database',
        error: process.env.NODE_ENV === 'development' ? createError.message : undefined
      });
    }

    // Verify product was saved to database
    let savedProduct;
    try {
      savedProduct = await Product.findById(product._id);
      if (!savedProduct) {
        console.error('❌ Product creation failed - product not found after creation');
        console.error(`   Looking for product ID: ${product._id}`);
        return res.status(500).json({
          success: false,
          message: 'Product created but not found in database. Please check MongoDB connection.'
        });
      }
      console.log(`✅ Product verified in database: ${savedProduct.name}`);
    } catch (verifyError) {
      console.error('❌ Product verification error:', verifyError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify product in database',
        error: process.env.NODE_ENV === 'development' ? verifyError.message : undefined
      });
    }

    console.log(`✅ Product created successfully: ${product.name} (ID: ${product._id})`);
    console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Product creation error:', error.message);
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Manager)
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let product;
    try {
      product = await Product.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        {
          new: true,
          runValidators: true
        }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Verify product was saved
      const savedProduct = await Product.findById(product._id);
      if (!savedProduct) {
        console.error('❌ Product update failed - product not found after update');
        return res.status(500).json({
          success: false,
          message: 'Product updated but not found in database. Please check MongoDB connection.'
        });
      }

      console.log(`✅ Product updated successfully: ${product.name} (ID: ${product._id})`);
      console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
    } catch (error) {
      console.error('❌ Product update error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to update product in database',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Manager)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private
export const getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lt: 20 } });
    const totalRevenue = await Product.aggregate([
      {
        $project: {
          revenue: { $multiply: ['$price', '$sales'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$revenue' }
        }
      }
    ]);

    const topSelling = await Product.find()
      .sort({ sales: -1 })
      .limit(1)
      .select('sales');

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStock,
        totalRevenue: totalRevenue[0]?.total || 0,
        topSelling: topSelling[0]?.sales || 0
      }
    });
  } catch (error) {
    next(error);
  }
};


