import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Electronics',
      'Clothing',
      'Home & Kitchen',
      'Sports',
      'Books',
      'Toys',
      'Beauty',
      'Automotive'
    ]
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative'],
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minStockLevel: {
    type: Number,
    min: 0,
    default: 10
  },
  sales: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed
  },
  images: [{
    type: String
  }],
  supplier: {
    name: { type: String, trim: true },
    contact: { type: String, trim: true },
    email: { type: String, trim: true }
  },
  weight: {
    value: { type: Number, min: 0 },
    unit: { type: String, enum: ['kg', 'g', 'lb', 'oz'], default: 'kg' }
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    unit: { type: String, enum: ['cm', 'm', 'in', 'ft'], default: 'cm' }
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ name: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;


