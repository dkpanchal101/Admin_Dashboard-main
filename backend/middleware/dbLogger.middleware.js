// Middleware to log database operations
export const dbLogger = (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Log successful creations
    if (res.statusCode === 201 && data.success) {
      if (req.path.includes('/auth/register') || req.path.includes('/users')) {
        console.log(`✅ User saved to database: ${data.user?.email || data.data?.email}`);
      } else if (req.path.includes('/products')) {
        console.log(`✅ Product saved to database: ${data.data?.name}`);
      } else if (req.path.includes('/orders')) {
        console.log(`✅ Order saved to database: ${data.data?.orderId || 'New Order'}`);
      }
    }
    
    // Log successful updates
    if (res.statusCode === 200 && data.success && req.method === 'PUT') {
      if (req.path.includes('/orders')) {
        console.log(`✅ Order updated in database: ${data.data?.orderId} (Status: ${data.data?.status})`);
      } else if (req.path.includes('/products')) {
        console.log(`✅ Product updated in database: ${data.data?.name}`);
      } else if (req.path.includes('/users')) {
        console.log(`✅ User updated in database: ${data.data?.email}`);
      }
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

