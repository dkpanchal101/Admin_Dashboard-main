# Admin Dashboard Backend API

A production-ready Node.js, Express.js, and MongoDB backend for the Admin Dashboard application.

## Features

- 🔐 JWT Authentication & Authorization
- 👥 User Management (CRUD operations)
- 📦 Product Management (CRUD operations)
- 🛒 Order Management (CRUD operations)
- 📊 Analytics & Reporting
- 🔒 Role-based Access Control (Admin, Manager, Customer, Support, Sales)
- ✅ Input Validation
- 🛡️ Security Middleware (Helmet, CORS, Rate Limiting)
- 📝 Error Handling
- 🗄️ MongoDB with Mongoose ODM

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Compression** - Response compression

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/admin_dashboard
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (logs attempt to MongoDB)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/login-logs` - Get login logs (Admin/Manager only)
- `GET /api/auth/login-stats` - Get login statistics (Admin/Manager only)
- `GET /api/auth/login-logs/user/:userId` - Get user login history

### Users
- `GET /api/users` - Get all users (Admin/Manager only)
- `GET /api/users/:id` - Get single user (Admin/Manager only)
- `POST /api/users` - Create user (Admin/Manager only)
- `PUT /api/users/:id` - Update user (Admin/Manager only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin/Manager only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Manager only)
- `PUT /api/products/:id` - Update product (Admin/Manager only)
- `DELETE /api/products/:id` - Delete product (Admin/Manager only)
- `GET /api/products/stats` - Get product statistics

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (Admin/Manager only)
- `DELETE /api/orders/:id` - Delete order (Admin only)
- `GET /api/orders/stats` - Get order statistics

### Sales
- `GET /api/sales` - Get all sales with filters
- `GET /api/sales/:id` - Get single sale
- `GET /api/sales/stats` - Get sales statistics

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/top-products` - Top selling products
- `GET /api/analytics/user-growth` - User growth (Admin/Manager only)
- `GET /api/analytics/sales-by-category` - Sales by category
- `GET /api/analytics/channel-performance` - Channel performance

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Role-Based Access Control

- **Admin**: Full access to all resources
- **Manager**: Can manage users, products, and orders (except delete users)
- **Customer**: Can view and create orders, view products
- **Support**: Limited access (can be customized)
- **Sales**: Limited access (can be customized)

## Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection

## Database Models

### User
- name, email, password, role, status
- lastLogin, registeredAt
- orders, totalSpent

### Product
- name, category, price, stock, sales
- rating, description, image
- isActive

### Order
- orderId, customer, items
- total, status, paymentMethod
- shippingAddress, date, deliveredAt

### Sale
- saleId, order, customer, product
- quantity, unitPrice, totalAmount
- saleDate, paymentMethod, channel, status

### LoginLog
- user, email, ipAddress, userAgent
- status (Success/Failed), failureReason
- loginAt, location

## Development

The server runs on `http://localhost:5000` by default.

Health check endpoint: `GET /api/health`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB instance
4. Set up proper CORS origins
5. Use environment variables for all sensitive data
6. Enable HTTPS
7. Set up proper logging and monitoring

## License

ISC


