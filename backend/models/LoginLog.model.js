import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    required: true
  },
  failureReason: {
    type: String,
    default: null
  },
  loginAt: {
    type: Date,
    default: Date.now
  },
  location: {
    country: String,
    city: String,
    region: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
loginLogSchema.index({ user: 1, loginAt: -1 });
loginLogSchema.index({ email: 1 });
loginLogSchema.index({ status: 1 });
loginLogSchema.index({ loginAt: -1 });

const LoginLog = mongoose.model('LoginLog', loginLogSchema);

export default LoginLog;

