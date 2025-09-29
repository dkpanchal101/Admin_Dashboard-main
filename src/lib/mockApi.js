// Simple mock API with latency and occasional failures

const simulateLatency = (minMs = 400, maxMs = 900) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (maxMs - minMs) + minMs));

const maybeFail = () => Math.random() < 0.08; // 8% failure rate

export async function getProducts() {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load products. Please try again.");
  return [
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200 },
    { id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800 },
    { id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650 },
    { id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950 },
    { id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 5, sales: 720 },
  ];
}

export async function getUsers() {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load users.");
  return [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Customer", status: "Inactive" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Customer", status: "Active" },
  ];
}

export async function getOrders() {
  await simulateLatency();
  if (maybeFail()) throw new Error("Failed to load orders.");
  return [
    { id: "ORD001", customer: "John Doe", total: 235.4, status: "Delivered", date: "2023-07-01" },
    { id: "ORD002", customer: "Jane Smith", total: 412.0, status: "Processing", date: "2023-07-02" },
    { id: "ORD003", customer: "Bob Johnson", total: 162.5, status: "Shipped", date: "2023-07-03" },
    { id: "ORD004", customer: "Alice Brown", total: 750.2, status: "Pending", date: "2023-07-04" },
  ];
}


