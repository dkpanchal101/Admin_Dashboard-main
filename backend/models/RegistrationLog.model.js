import mongoose from 'mongoose';

const registrationLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  registrationSource: {
    type: String,
    enum: ['Website', 'Mobile App', 'Admin Panel', 'API', 'Import'],
    default: 'Website'
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    required: true,
    default: 'Success'
  },
  failureReason: {
    type: String,
    default: null
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
registrationLogSchema.index({ user: 1, registeredAt: -1 });
registrationLogSchema.index({ email: 1 });
registrationLogSchema.index({ registeredAt: -1 });
registrationLogSchema.index({ registrationSource: 1 });

const RegistrationLog = mongoose.model('RegistrationLog', registrationLogSchema);

export default RegistrationLog;

