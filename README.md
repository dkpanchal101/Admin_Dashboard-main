# Admin Dashboard - Company Level Project

A comprehensive admin dashboard application with React frontend and Node.js/Express/MongoDB backend.

## 🚀 Features

- **Complete User Management** - Registration, login, user profiles with full customer details
- **Product Management** - Full product catalog with SKU, inventory, supplier information
- **Order Management** - Complete order tracking with payment status, shipping, and tracking
- **Analytics Dashboard** - Real-time analytics and insights
- **Sales Tracking** - Detailed sales records and reporting
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Registration & Login Logging** - Complete audit trail of all authentication events

## 📁 Project Structure

```
Admin_Dashboard-main/
├── Frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utilities and API
│   └── package.json
│
├── backend/           # Node.js/Express backend
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── scripts/        # Utility scripts (seed, etc.)
│   ├── utils/         # Helper functions
│   └── server.js       # Server entry point
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Recharts (data visualization)
- Framer Motion (animations)
- Context API (state management)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs (password hashing)
- express-validator (validation)
- express-rate-limit (rate limiting)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy from .env.example or create new
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/admin_dashboard
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/admin_dashboard?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

4. Seed database (optional):
```bash
npm run seed
```

5. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Collections

- **users** - User and customer information
- **products** - Product catalog with inventory
- **orders** - Order management and tracking
- **sales** - Individual sales transactions
- **loginlogs** - Login attempt tracking
- **registrationlogs** - Registration tracking

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (Admin/Manager)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin/Manager)
- `PUT /api/users/:id` - Update user (Admin/Manager)
- `DELETE /api/users/:id` - Delete user (Admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin/Manager)
- `PUT /api/products/:id` - Update product (Admin/Manager)
- `DELETE /api/products/:id` - Delete product (Admin/Manager)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order (Admin/Manager)
- `DELETE /api/orders/:id` - Delete order (Admin)

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/products` - Product analytics
- `GET /api/analytics/users` - User analytics

### Verification
- `GET /api/verify/database` - Verify database connection and data

## 🔐 Default Login Credentials

After seeding the database:
- **Admin:** admin@example.com / admin123
- **Manager:** manager@example.com / manager123
- **Customer:** john@example.com / user123

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Build and start server:
```bash
npm start
```

### Frontend
1. Build for production:
```bash
npm run build
```

2. Deploy `dist/` folder to your hosting service

## 📝 Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key (min 32 chars)
- `JWT_EXPIRE` - JWT expiration (default: 7d)
- `FRONTEND_URL` - Frontend URL for CORS
- `RATE_LIMIT_WINDOW_MS` - Rate limit window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

## 📊 Features

### User Management
- Complete customer profiles (phone, address, company info)
- User preferences and settings
- Registration source tracking
- Login history

### Product Management
- SKU and barcode tracking
- Inventory management with low stock alerts
- Supplier information
- Product specifications and dimensions
- Multiple images support

### Order Management
- Complete order tracking
- Payment status tracking
- Shipping information with tracking numbers
- Order status workflow
- Cancellation handling

### Analytics
- Real-time dashboard
- Revenue analytics
- Product performance
- User analytics
- Sales trends

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- Error handling
- Security headers (Helmet)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@example.com or create an issue in the repository.

---

**Built with ❤️ for company-level administration**

