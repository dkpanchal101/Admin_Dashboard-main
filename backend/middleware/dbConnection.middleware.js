import mongoose from 'mongoose';

// Middleware to check database connection before operations
export const checkDbConnection = (req, res, next) => {
  const connectionState = mongoose.connection.readyState;
  
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (connectionState !== 1) {
    console.error('❌ Database not connected! State:', connectionState);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please check MongoDB connection.',
      connectionState: {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting'
      }[connectionState] || 'Unknown'
    });
  }
  
  next();
};

