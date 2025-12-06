import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import saleRoutes from './routes/sale.routes.js';
import verifyRoutes from './routes/verify.routes.js';
import registrationLogRoutes from './routes/registrationLog.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { notFound } from './middleware/notFound.middleware.js';
import { dbLogger } from './middleware/dbLogger.middleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database operation logger
app.use(dbLogger);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/registration-logs', registrationLogRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_dashboard';
    
    if (!mongoURI || mongoURI.trim() === '') {
      console.error('❌ ERROR: MONGODB_URI is not set in .env file');
      console.error('💡 Please set MONGODB_URI in your .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check if MongoDB is running');
    console.error('2. Verify MONGODB_URI in .env file is correct');
    console.error('3. For MongoDB Atlas: Check your connection string and IP whitelist');
    console.error(`   Current URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_dashboard'}`);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;


