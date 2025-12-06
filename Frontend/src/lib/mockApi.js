// Enhanced mock API with latency, pagination, and realistic data

const simulateLatency = (minMs = 300, maxMs = 800) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (maxMs - minMs) + minMs));

const maybeFail = () => Math.random() < 0.05; // 5% failure rate

// Generate realistic product data
const generateProducts = () => {
  const categories = ["Electronics", "Clothing", "Home & Kitchen", "Sports", "Books", "Toys", "Beauty", "Automotive"];
  const productNames = {
    Electronics: ["Wireless Earbuds", "Smart Watch", "Laptop Stand", "USB-C Hub", "Wireless Mouse", "Keyboard", "Monitor", "Tablet"],
    Clothing: ["Cotton T-Shirt", "Denim Jeans", "Winter Jacket", "Running Shoes", "Baseball Cap", "Sunglasses", "Backpack", "Sneakers"],
    "Home & Kitchen": ["Coffee Maker", "Air Fryer", "Blender", "Dinner Set", "Bed Sheets", "Pillows", "Lamp", "Curtains"],
    Sports: ["Yoga Mat", "Dumbbells", "Basketball", "Tennis Racket", "Bicycle", "Treadmill", "Jump Rope", "Water Bottle"],
    Books: ["Novel Collection", "Cookbook", "Biography", "Self-Help", "Mystery", "Science Fiction", "History", "Poetry"],
    Toys: ["Action Figure", "Board Game", "Puzzle", "RC Car", "LEGO Set", "Doll", "Building Blocks", "Art Supplies"],
    Beauty: ["Face Cream", "Lipstick", "Perfume", "Shampoo", "Sunscreen", "Makeup Kit", "Hair Brush", "Nail Polish"],
    Automotive: ["Car Charger", "Phone Mount", "Dash Cam", "Floor Mats", "Air Freshener", "Tire Gauge", "Jump Starter", "Car Cover"]
  };

  const products = [];
  let id = 1;
  
  categories.forEach(category => {
    const names = productNames[category] || [];
    names.forEach(name => {
      const basePrice = Math.random() * 200 + 10;
      const stock = Math.floor(Math.random() * 500) + 1;
      const sales = Math.floor(Math.random() * 5000) + 100;
      
      products.push({
        id: id++,
        name,
        category,
        price: parseFloat(basePrice.toFixed(2)),
        stock,
        sales,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        image: `https://picsum.photos/200/200?random=${id}`
      });
    });
  });
  
  return products;
};

// Generate realistic user data
const generateUsers = () => {
  const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rachel"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee"];
  const roles = ["Admin", "Manager", "Customer", "Support", "Sales"];
  const statuses = ["Active", "Inactive", "Pending", "Suspended"];

  const users = [];
  for (let i = 1; i <= 150; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const lastLogin = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    
    users.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email,
      role,
      status,
      lastLogin: lastLogin.toISOString(),
      registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 50),
      totalSpent: parseFloat((Math.random() * 5000).toFixed(2))
    });
  }
  
  return users;
};

// Generate realistic order data
const generateOrders = () => {
  const customers = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson", "Diana Martinez", "Eve Anderson", "Frank Taylor"];
  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"];

  const orders = [];
  for (let i = 1; i <= 200; i++) {
    const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const total = parseFloat((Math.random() * 1000 + 20).toFixed(2));
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const items = Math.floor(Math.random() * 5) + 1;
    
    orders.push({
      id: `ORD${String(i).padStart(6, '0')}`,
      customer,
      total,
      status,
      date: date.toISOString().split('T')[0],
      items,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: `${Math.floor(Math.random() * 9999)} Main St, City, State ${Math.floor(Math.random() * 90000) + 10000}`
    });
  }
  
  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Cache generated data
let cachedProducts = null;
let cachedUsers = null;
let cachedOrders = null;

export async function getProducts(page = 1, limit = 20, filters = {}) {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load products. Please try again.");
  
  if (!cachedProducts) {
    cachedProducts = generateProducts();
  }
  
  let filtered = [...cachedProducts];
  
  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.category.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }
  
  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
}

export async function getUsers(page = 1, limit = 20, filters = {}) {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load users.");
  
  if (!cachedUsers) {
    cachedUsers = generateUsers();
  }
  
  let filtered = [...cachedUsers];
  
  if (filters.role) {
    filtered = filtered.filter(u => u.role === filters.role);
  }
  
  if (filters.status) {
    filtered = filtered.filter(u => u.status === filters.status);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(searchLower) || 
      u.email.toLowerCase().includes(searchLower)
    );
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
}

export async function getOrders(page = 1, limit = 20, filters = {}) {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load orders.");
  
  if (!cachedOrders) {
    cachedOrders = generateOrders();
  }
  
  let filtered = [...cachedOrders];
  
  if (filters.status) {
    filtered = filtered.filter(o => o.status === filters.status);
  }
  
  if (filters.customer) {
    filtered = filtered.filter(o => 
      o.customer.toLowerCase().includes(filters.customer.toLowerCase())
    );
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(o => o.date >= filters.dateFrom);
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(o => o.date <= filters.dateTo);
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit)
  };
}

// Analytics data
export async function getAnalyticsData() {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load analytics data.");
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueData = months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 50000 + 100000),
    orders: Math.floor(Math.random() * 200 + 500)
  }));
  
  return {
    revenue: revenueData,
    topProducts: cachedProducts ? cachedProducts.slice(0, 5).map(p => ({
      name: p.name,
      sales: p.sales,
      revenue: p.price * p.sales
    })) : [],
    userGrowth: months.map(month => ({
      month,
      users: Math.floor(Math.random() * 500 + 1000)
    }))
  };
}

// Authentication
export async function login(email, password) {
  await simulateLatency(200, 500);
  if (maybeFail()) throw new Error("Login failed. Please try again.");
  
  // Mock authentication - in production, this would call a real API
  const validUsers = [
    { email: "admin@example.com", password: "admin123", role: "Admin", name: "Admin User" },
    { email: "manager@example.com", password: "manager123", role: "Manager", name: "Manager User" },
    { email: "user@example.com", password: "user123", role: "Customer", name: "Regular User" }
  ];
  
  const user = validUsers.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  return {
    user: {
      id: 1,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token: `mock_token_${Date.now()}`
  };
}

export async function register(userData) {
  await simulateLatency(300, 600);
  if (maybeFail()) throw new Error("Registration failed. Please try again.");
  
  return {
    user: {
      id: Date.now(),
      email: userData.email,
      name: userData.name,
      role: "Customer"
    },
    token: `mock_token_${Date.now()}`
  };
}


