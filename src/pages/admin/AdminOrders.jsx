import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowClockwise, Eye } from "@phosphor-icons/react";
import { FadeLoader } from "react-spinners";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Retrieve all customer orders from the database
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error("Order fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order fulfillment status and refresh the list
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders(); // Refresh to ensure UI matches database state
    } catch (err) {
      alert("Status update failed. Please check backend connectivity.");
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[var(--bg)] font-[var(--font-primary)] text-[var(--text)]">
      
      {/* Admin Sub-navigation */}
      <div className="flex max-w-6xl mx-0 lg:mx-12 mb-5">
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { name: "Dashboard", path: "/admin" },
            { name: "Inventory", path: "/admin/products" },
            { name: "Orders", path: "/admin/orders" },
            { name: "User Management", path: "/admin/users" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1 border rounded-md text-xs font-bold transition-colors ${
                location.pathname === link.path
                  ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-[var(--shadow-sm)]"
                  : "bg-white border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Header and Manual Refresh */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight font-[var(--font-heading)]">Orders</h1>
          <p className="text-[var(--text-muted)] text-sm font-[var(--font-lead)]">Manage customer transactions and fulfillment.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all"
        >
          <ArrowClockwise size={22} className={loading ? "animate-spin text-[var(--primary)]" : ""} />
        </button>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-sm)] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border)] text-[10px] uppercase tracking-widest font-black text-[var(--text-light)]">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center"><FadeLoader color="var(--primary)" /></td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-[var(--bg)] transition-colors">
                    {/* Displaying last 6 digits of ID for a cleaner look */}
                    <td className="px-6 py-4 font-mono text-xs text-[var(--text-light)]">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm">{order.user?.name || "Guest"}</p>
                      <p className="text-xs text-[var(--text-muted)]">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-[var(--primary)]">${order.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {/* Interactive status selector */}
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-[10px] font-black uppercase px-3 py-1 rounded border border-[var(--border)] bg-white focus:ring-2 focus:ring-[var(--primary-light)] outline-none cursor-pointer"
                      >
                        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/orders/${order._id}`} className="inline-block p-2 text-[var(--text-muted)] hover:text-[var(--primary)]">
                        <Eye size={20} weight="bold" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;