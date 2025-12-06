import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  saleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  saleDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'],
    default: 'Credit Card'
  },
  channel: {
    type: String,
    enum: ['Website', 'Mobile App', 'Marketplace', 'Social Media', 'Direct', 'Email'],
    default: 'Website'
  },
  status: {
    type: String,
    enum: ['Completed', 'Refunded', 'Cancelled'],
    default: 'Completed'
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
saleSchema.index({ saleDate: -1 });
saleSchema.index({ category: 1 });
saleSchema.index({ channel: 1 });
saleSchema.index({ customer: 1 });
saleSchema.index({ product: 1 });
saleSchema.index({ status: 1 });

// Generate sale ID before saving
saleSchema.pre('save', async function(next) {
  if (!this.saleId) {
    const count = await mongoose.model('Sale').countDocuments();
    this.saleId = `SALE${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;

