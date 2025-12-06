import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Pencil, Trash2, Plus, Download } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { SkeletonTable } from "../common/LoadingSkeleton";

const OrdersTable = ({ orders, setOrders, loading, onPageChange, pagination }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { success, error: showError } = useToast();

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const query = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query)
    );
  }, [orders, searchTerm]);

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Total", "Status", "Date", "Items", "Payment Method"];
    const rows = filteredOrders.map(o => [
      o.id, o.customer, o.total, o.status, o.date, o.items || 1, o.paymentMethod || "N/A"
    ]);
    
    const csv = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    success("Orders exported to CSV");
  };

  const handleSave = () => {
    if (editingOrder.id && orders.find((o) => o.id === editingOrder.id)) {
      // Edit
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
      );
      success("Order updated successfully");
    } else {
      // Add new
      const newId = `ORD${String(Date.now()).slice(-6)}`;
      setOrders((prev) => [...prev, { ...editingOrder, id: newId, items: 1, paymentMethod: "Credit Card" }]);
      success("Order added successfully");
    }
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      success("Order deleted successfully");
    }
  };

  if (loading) {
    return <SkeletonTable rows={5} cols={6} />;
  }

  return (
    <>
      <motion.div
        className='card p-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className='flex flex-wrap justify-between items-center gap-4 mb-6'>
          <h2 className='text-xl font-semibold' style={{ color: "rgb(var(--text))" }}>Order List</h2>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search orders...'
                className='rounded-lg pl-10 pr-4 py-2 border text-sm'
                style={{ backgroundColor: "rgb(var(--bg))", color: "rgb(var(--text))", borderColor: "rgb(var(--border))" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2' size={18} style={{ color: "rgb(var(--muted))" }} />
            </div>
            <button
              onClick={exportToCSV}
              className='btn'
              style={{ borderColor: "rgb(var(--border))" }}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => {
                setEditingOrder({ id: "", customer: "", total: "", status: "Pending", date: new Date().toISOString().split('T')[0] });
                setShowModal(true);
              }}
              className='btn btn-primary flex items-center gap-1'
            >
              <Plus size={16} /> 
              <span className="hidden sm:inline">Add Order</span>
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center muted">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
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
              )))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-sm muted">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm" style={{ color: "rgb(var(--text))" }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="btn disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "rgb(var(--border))" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
