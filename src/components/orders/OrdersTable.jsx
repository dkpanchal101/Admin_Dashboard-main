import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Pencil, Trash2, Plus } from "lucide-react";

const initialData = [
  { id: "ORD001", customer: "John Doe", total: 235.4, status: "Delivered", date: "2023-07-01" },
  { id: "ORD002", customer: "Jane Smith", total: 412.0, status: "Processing", date: "2023-07-02" },
  { id: "ORD003", customer: "Bob Johnson", total: 162.5, status: "Shipped", date: "2023-07-03" },
  { id: "ORD004", customer: "Alice Brown", total: 750.2, status: "Pending", date: "2023-07-04" },
  { id: "ORD005", customer: "Charlie Wilson", total: 95.8, status: "Delivered", date: "2023-07-05" },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");const OrdersTable = ({ orders, setOrders }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [editingOrder, setEditingOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    const filteredOrders = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleSave = () => {
      if (editingOrder.id && orders.find((o) => o.id === editingOrder.id)) {
        // Edit
        setOrders((prev) =>
          prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
        );
      } else {
        // Add new
        setOrders((prev) => [
          ...prev,
          {
            ...editingOrder,
            id: `ORD${String(prev.length + 1).padStart(3, "0")}`,
          },
        ]);
      }
      setShowModal(false);
      setEditingOrder(null);
    };
  
    const handleDelete = (id) => {
      if (confirm("Are you sure you want to delete this order?")) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
      }
    };
  
    // ...rest of the component remains unchanged
  };
  
  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (editingOrder.id && orders.find((o) => o.id === editingOrder.id)) {
      // Edit
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
      );
    } else {
      // Add new
      setOrders((prev) => [...prev, { ...editingOrder, id: `ORD${String(prev.length + 1).padStart(3, "0")}` }]);
    }
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <>
      <motion.div
        className='card p-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold' style={{ color: "rgb(var(--text))" }}>Order List</h2>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search orders...'
                className='rounded-lg pl-10 pr-4 py-2 border'
                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute left-3 top-2.5' size={18} style={{ color: "rgb(var(--muted))" }} />
            </div>
            <button
              onClick={() => {
                setEditingOrder({ id: "", customer: "", total: "", status: "Pending", date: "" });
                setShowModal(true);
              }}
              className='btn btn-primary rounded-lg flex items-center gap-1'
            >
              <Plus size={18} /> Add Order
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y' style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--text))" }}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Total", "Status", "Date", "Actions"].map((col) => (
                  <th
                    key={col}
                    className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider muted'
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y' style={{ borderColor: "rgb(var(--border))" }}>
              {filteredOrders.map((order) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>{order.id}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>{order.customer}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>${order.total.toFixed(2)}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800 dark:!text-green-300 dark:!bg-green-900/30"
                          : order.status === "Processing"
                          ? "bg-yellow-100 text-yellow-800 dark:!text-yellow-300 dark:!bg-yellow-900/30"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800 dark:!text-blue-300 dark:!bg-blue-900/30"
                          : "bg-red-100 text-red-800 dark:!text-red-300 dark:!bg-red-900/30"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>{order.date}</td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm flex gap-2'>
                    <button
                      onClick={() => {
                        setEditingOrder(order);
                        setShowModal(true);
                      }}
                      className='btn'
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className='btn'
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='card p-6 w-[90%] max-w-md'>
            <h3 className='text-lg mb-4' style={{ color: "rgb(var(--text))" }}>
              {editingOrder.id ? "Edit Order" : "Add New Order"}
            </h3>
            <div className='space-y-4'>
              <input
                className='w-full px-4 py-2 rounded border'
                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                placeholder='Customer Name'
                value={editingOrder.customer}
                onChange={(e) =>
                  setEditingOrder((prev) => ({ ...prev, customer: e.target.value }))
                }
              />
              <input
                className='w-full px-4 py-2 rounded border'
                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                placeholder='Total'
                type='number'
                value={editingOrder.total}
                onChange={(e) =>
                  setEditingOrder((prev) => ({ ...prev, total: parseFloat(e.target.value) || 0 }))
                }
              />
              <select
                className='w-full px-4 py-2 rounded border'
                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                value={editingOrder.status}
                onChange={(e) =>
                  setEditingOrder((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option>Delivered</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Pending</option>
              </select>
              <input
                className='w-full px-4 py-2 rounded border'
                style={{ backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                type='date'
                value={editingOrder.date}
                onChange={(e) =>
                  setEditingOrder((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div className='flex justify-end gap-4 mt-6'>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingOrder(null);
                }}
                className='btn'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className='btn btn-primary'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTable;
