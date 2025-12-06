import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Sale from '../models/Sale.model.js';
import LoginLog from '../models/LoginLog.model.js';
import RegistrationLog from '../models/RegistrationLog.model.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_dashboard');
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Sale.deleteMany({});
    await LoginLog.deleteMany({});
    await RegistrationLog.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create users with comprehensive details
    console.log('👥 Creating users with complete customer details...');
    const userData = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'Admin',
        status: 'Active',
        phone: '+1-555-0100',
        address: {
          street: '123 Admin Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        company: {
          name: 'Admin Corp',
          position: 'System Administrator',
          website: 'https://admincorp.com'
        },
        registeredAt: new Date('2023-01-15'),
        registrationSource: 'Admin Panel'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'Manager',
        status: 'Active',
        phone: '+1-555-0101',
        address: {
          street: '456 Manager Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        },
        company: {
          name: 'Manager Inc',
          position: 'Operations Manager',
          website: 'https://managerinc.com'
        },
        registeredAt: new Date('2023-02-20'),
        registrationSource: 'Admin Panel'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'Customer',
        status: 'Active',
        phone: '+1-555-0200',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Male',
        address: {
          street: '789 Customer Lane',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        company: {
          name: 'Tech Solutions',
          position: 'Software Engineer',
          website: 'https://techsolutions.com'
        },
        orders: 12,
        totalSpent: 2450.75,
        averageOrderValue: 204.23,
        registeredAt: new Date('2023-03-10'),
        registrationSource: 'Website',
        preferences: {
          newsletter: true,
          smsNotifications: false,
          emailNotifications: true,
          language: 'en'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'user123',
        role: 'Customer',
        status: 'Active',
        phone: '+1-555-0201',
        dateOfBirth: new Date('1985-08-22'),
        gender: 'Female',
        address: {
          street: '321 Shopping Blvd',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        },
        orders: 8,
        totalSpent: 1850.50,
        averageOrderValue: 231.31,
        registeredAt: new Date('2023-04-05'),
        registrationSource: 'Mobile App',
        preferences: {
          newsletter: true,
          smsNotifications: true,
          emailNotifications: true,
          language: 'en'
        }
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'user123',
        role: 'Customer',
        status: 'Active',
        phone: '+1-555-0202',
        dateOfBirth: new Date('1978-12-03'),
        gender: 'Male',
        address: {
          street: '654 Business Road',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        },
        company: {
          name: 'Business Pro',
          position: 'CEO',
          website: 'https://businesspro.com'
        },
        orders: 15,
        totalSpent: 3200.00,
        averageOrderValue: 213.33,
        registeredAt: new Date('2023-05-12'),
        registrationSource: 'Website',
        preferences: {
          newsletter: false,
          smsNotifications: false,
          emailNotifications: true,
          language: 'en'
        }
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: 'user123',
        role: 'Customer',
        status: 'Inactive',
        phone: '+1-555-0203',
        dateOfBirth: new Date('1992-03-18'),
        gender: 'Female',
        address: {
          street: '987 Market Street',
          city: 'Philadelphia',
          state: 'PA',
          zipCode: '19101',
          country: 'USA'
        },
        orders: 3,
        totalSpent: 450.25,
        averageOrderValue: 150.08,
        registeredAt: new Date('2023-06-18'),
        registrationSource: 'Website',
        preferences: {
          newsletter: false,
          smsNotifications: false,
          emailNotifications: false,
          language: 'en'
        }
      },
      {
        name: 'Charlie Wilson',
        email: 'charlie@example.com',
        password: 'user123',
        role: 'Customer',
        status: 'Active',
        phone: '+1-555-0204',
        dateOfBirth: new Date('1988-11-25'),
        gender: 'Male',
        address: {
          street: '147 Premium Drive',
          city: 'San Antonio',
          state: 'TX',
          zipCode: '78201',
          country: 'USA'
        },
        orders: 20,
        totalSpent: 5100.00,
        averageOrderValue: 255.00,
        registeredAt: new Date('2023-07-22'),
        registrationSource: 'Mobile App',
        preferences: {
          newsletter: true,
          smsNotifications: true,
          emailNotifications: true,
          language: 'en'
        }
      }
    ];

    const users = await User.create(userData);
    console.log(`✅ Created ${users.length} users with complete details\n`);

    // Create registration logs
    console.log('📝 Creating registration logs...');
    const registrationLogs = [];
    const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.42'];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    ];

    for (const user of users) {
      registrationLogs.push({
        user: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        registrationSource: user.registrationSource || 'Website',
        ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        status: 'Success',
        registeredAt: user.registeredAt
      });
    }

    await RegistrationLog.create(registrationLogs);
    console.log(`✅ Created ${registrationLogs.length} registration logs\n`);

    // Create products with comprehensive details
    console.log('📦 Creating products with complete details...');
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive'];
    const brands = {
      'Electronics': ['TechBrand', 'ElectroMax', 'SmartTech', 'DigitalPro'],
      'Clothing': ['FashionLine', 'StyleCo', 'WearWell', 'TrendSet'],
      'Home & Kitchen': ['HomePro', 'KitchenMaster', 'LivingSpace', 'Domestic'],
      'Sports': ['FitPro', 'SportMax', 'ActiveLife', 'Athletic'],
      'Books': ['BookHouse', 'LiteraryPress', 'ReadMore', 'PageTurner'],
      'Toys': ['PlayTime', 'FunZone', 'ToyLand', 'KidsCorner'],
      'Beauty': ['BeautyPro', 'GlowUp', 'SkinCare', 'Cosmetic'],
      'Automotive': ['AutoPro', 'CarTech', 'DriveWell', 'VehicleMax']
    };
    const suppliers = [
      { name: 'Global Suppliers Inc', contact: '+1-555-1000', email: 'contact@globalsuppliers.com' },
      { name: 'Premium Distributors', contact: '+1-555-1001', email: 'sales@premiumdist.com' },
      { name: 'Quality Imports Ltd', contact: '+1-555-1002', email: 'info@qualityimports.com' },
      { name: 'Direct Source Co', contact: '+1-555-1003', email: 'orders@directsource.com' }
    ];

    const productNames = {
      'Electronics': ['Wireless Earbuds', 'Smart Watch', 'Laptop Stand', 'USB-C Hub', 'Wireless Mouse', 'Keyboard', 'Monitor', 'Tablet'],
      'Clothing': ['Cotton T-Shirt', 'Denim Jeans', 'Winter Jacket', 'Running Shoes', 'Baseball Cap', 'Sunglasses', 'Backpack', 'Sneakers'],
      'Home & Kitchen': ['Coffee Maker', 'Air Fryer', 'Blender', 'Dinner Set', 'Bed Sheets', 'Pillows', 'Lamp', 'Curtains'],
      'Sports': ['Yoga Mat', 'Dumbbells', 'Basketball', 'Tennis Racket', 'Bicycle', 'Treadmill', 'Jump Rope', 'Water Bottle'],
      'Books': ['Novel Collection', 'Cookbook', 'Biography', 'Self-Help', 'Mystery', 'Science Fiction', 'History', 'Poetry'],
      'Toys': ['Action Figure', 'Board Game', 'Puzzle', 'RC Car', 'LEGO Set', 'Doll', 'Building Blocks', 'Art Supplies'],
      'Beauty': ['Face Cream', 'Lipstick', 'Perfume', 'Shampoo', 'Sunscreen', 'Makeup Kit', 'Hair Brush', 'Nail Polish'],
      'Automotive': ['Car Charger', 'Phone Mount', 'Dash Cam', 'Floor Mats', 'Air Freshener', 'Tire Gauge', 'Jump Starter', 'Car Cover']
    };

    const products = [];
    let skuCounter = 1000;
    
    for (const category of categories) {
      const names = productNames[category] || [];
      const categoryBrands = brands[category] || [];
      
      for (const name of names) {
        const basePrice = Math.random() * 200 + 10;
        const costPrice = basePrice * 0.6; // 60% of selling price
        const stock = Math.floor(Math.random() * 500) + 1;
        const sales = Math.floor(Math.random() * 5000) + 100;
        const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));
        const reviewCount = Math.floor(Math.random() * 500) + 10;
        const brand = categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
        const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
        
        products.push({
          name,
          sku: `SKU-${category.substring(0, 3).toUpperCase()}-${skuCounter++}`,
          barcode: `BC${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          category,
          brand,
          price: parseFloat(basePrice.toFixed(2)),
          costPrice: parseFloat(costPrice.toFixed(2)),
          stock,
          minStockLevel: Math.floor(stock * 0.2),
          sales,
          rating,
          reviewCount,
          description: `High-quality ${name.toLowerCase()} perfect for your needs. Features premium materials and excellent craftsmanship.`,
          specifications: {
            Material: 'Premium Quality',
            Warranty: '1 Year',
            Origin: 'USA'
          },
          supplier,
          weight: {
            value: parseFloat((Math.random() * 10 + 0.5).toFixed(2)),
            unit: 'kg'
          },
          dimensions: {
            length: Math.floor(Math.random() * 50 + 10),
            width: Math.floor(Math.random() * 50 + 10),
            height: Math.floor(Math.random() * 50 + 10),
            unit: 'cm'
          },
          tags: [category, brand, 'Popular', 'Featured'],
          isActive: true,
          isFeatured: Math.random() > 0.7,
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        });
      }
    }

    const createdProducts = await Product.create(products);
    console.log(`✅ Created ${createdProducts.length} products with complete details\n`);

    // Create orders and sales
    console.log('🛒 Creating orders and sales...');
    const channels = ['Website', 'Mobile App', 'Marketplace', 'Social Media', 'Direct', 'Email'];
    const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'];
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    
    const orders = [];
    const sales = [];
    const customerUsers = users.filter(u => u.role === 'Customer');

    for (let i = 0; i < 150; i++) {
      const customer = customerUsers[Math.floor(Math.random() * customerUsers.length)];
      const numItems = Math.floor(Math.random() * 4) + 1;
      const orderItems = [];
      let orderTotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = product.price * quantity;
        orderTotal += itemTotal;

        orderItems.push({
          product: product._id,
          quantity,
          price: product.price
        });

        // Create sale record
        sales.push({
          order: null, // Will be set after order creation
          customer: customer._id,
          customerName: customer.name,
          product: product._id,
          productName: product.name,
          category: product.category,
          quantity,
          unitPrice: product.price,
          totalAmount: itemTotal,
          saleDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          channel: channels[Math.floor(Math.random() * channels.length)],
          status: 'Completed'
        });
      }

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const orderDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

      const shippingCost = parseFloat((Math.random() * 20 + 5).toFixed(2));
      const tax = parseFloat((orderTotal * 0.08).toFixed(2));
      const discount = Math.random() > 0.7 ? parseFloat((orderTotal * 0.1).toFixed(2)) : 0;
      const finalTotal = orderTotal + shippingCost + tax - discount;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentStatus = status === 'Delivered' ? 'Paid' : status === 'Cancelled' ? 'Refunded' : 'Pending';
      const shippingMethod = ['Standard', 'Express', 'Overnight', 'International'][Math.floor(Math.random() * 4)];
      const trackingNumber = `TRK${Math.floor(Math.random() * 9000000) + 1000000}`;
      const carrier = ['UPS', 'FedEx', 'USPS', 'DHL'][Math.floor(Math.random() * 4)];

      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
      const cityIndex = Math.floor(Math.random() * cities.length);

      orders.push({
        customer: customer._id,
        customerName: customer.name,
        items: orderItems,
        total: parseFloat(finalTotal.toFixed(2)),
        status,
        paymentMethod,
        paymentStatus,
        shippingAddress: {
          street: `${Math.floor(Math.random() * 9999)} Main St`,
          city: cities[cityIndex],
          state: states[cityIndex],
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          country: 'USA',
          phone: customer.phone || '+1-555-0000'
        },
        billingAddress: {
          street: `${Math.floor(Math.random() * 9999)} Main St`,
          city: cities[cityIndex],
          state: states[cityIndex],
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          country: 'USA'
        },
        shippingMethod,
        shippingCost,
        tax,
        discount,
        trackingNumber: status !== 'Pending' ? trackingNumber : null,
        carrier: status !== 'Pending' ? carrier : null,
        date: orderDate,
        processedAt: status !== 'Pending' ? new Date(orderDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) : null,
        shippedAt: ['Shipped', 'Delivered'].includes(status) ? new Date(orderDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : null,
        deliveredAt: status === 'Delivered' ? new Date(orderDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        cancelledAt: status === 'Cancelled' ? new Date(orderDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) : null,
        cancellationReason: status === 'Cancelled' ? 'Customer request' : null
      });
    }

    const createdOrders = await Order.create(orders);
    console.log(`✅ Created ${createdOrders.length} orders\n`);

    // Update sales with order IDs
    for (let i = 0; i < sales.length; i++) {
      const orderIndex = Math.floor(i / 3); // Approximate order index
      if (orderIndex < createdOrders.length) {
        sales[i].order = createdOrders[orderIndex]._id;
      }
    }

    const createdSales = await Sale.create(sales);
    console.log(`✅ Created ${createdSales.length} sales records\n`);

    // Create login logs
    console.log('🔐 Creating login logs...');
    const loginLogs = [];
    const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.42'];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    ];

    // Create successful login logs
    for (const user of users) {
      const numLogins = Math.floor(Math.random() * 20) + 5;
      for (let i = 0; i < numLogins; i++) {
        loginLogs.push({
          user: user._id,
          email: user.email,
          ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
          userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
          status: 'Success',
          loginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      }
    }

    // Create some failed login logs
    for (let i = 0; i < 15; i++) {
      loginLogs.push({
        email: `fakeuser${i}@example.com`,
        ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        status: 'Failed',
        failureReason: Math.random() > 0.5 ? 'User not found' : 'Invalid password',
        loginAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    await LoginLog.create(loginLogs);
    console.log(`✅ Created ${loginLogs.length} login logs\n`);

    // Update user stats based on orders
    console.log('📊 Updating user statistics...');
    for (const user of customerUsers) {
      const userOrders = createdOrders.filter(o => o.customer.toString() === user._id.toString());
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      
      await User.findByIdAndUpdate(user._id, {
        orders: userOrders.length,
        totalSpent: parseFloat(totalSpent.toFixed(2))
      });
    }
    console.log('✅ Updated user statistics\n');

    // Update product sales based on sales records
    console.log('📈 Updating product sales...');
    for (const product of createdProducts) {
      const productSales = createdSales.filter(s => s.product.toString() === product._id.toString());
      const totalSales = productSales.reduce((sum, s) => sum + s.quantity, 0);
      
      await Product.findByIdAndUpdate(product._id, {
        sales: totalSales
      });
    }
    console.log('✅ Updated product sales\n');

    console.log('✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length} (with complete customer details)`);
    console.log(`   📦 Products: ${createdProducts.length} (with SKU, supplier, cost, etc.)`);
    console.log(`   🛒 Orders: ${createdOrders.length} (with tracking, payment status, etc.)`);
    console.log(`   💰 Sales: ${createdSales.length}`);
    console.log(`   🔐 Login Logs: ${loginLogs.length}`);
    console.log(`   📝 Registration Logs: ${registrationLogs.length}`);
    console.log('\n💾 All data saved to MongoDB:');
    console.log('   - users (with phone, address, company, preferences)');
    console.log('   - products (with SKU, barcode, supplier, cost, dimensions)');
    console.log('   - orders (with tracking, payment status, shipping details)');
    console.log('   - sales');
    console.log('   - loginlogs');
    console.log('   - registrationlogs');
    console.log('\n🎉 Company-level database ready!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
