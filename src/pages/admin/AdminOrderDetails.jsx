import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Package,
  User, Hash, CalendarBlank,
} from "@phosphor-icons/react";
import { getOrderById, updateOrderStatus } from "../../services/orderService";
import { FadeLoader } from "react-spinners";

const AdminOrderDetails = () => {
  // Extracting the unique order ID from the URL parameters
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch complete order details including populated user and product data
  const fetchOrder = async () => {
    try {
      const res = await getOrderById(id);
      if (res.success) setOrder(res.data);
    } catch (err) {
      console.error("Order detail fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Handle status updates and re-fetch to reflect changes in the UI
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrder();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Global loading state for the specific order page
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-(--bg)">
        <FadeLoader color="var(--primary)" />
      </div>
    );
  }

  // Error boundary if the ID is invalid or order doesn't exist
  if (!order) {
    return (
      <div className="h-screen flex items-center justify-center bg-(--bg)">
        <p className="text-(--text-muted) font-bold">Order data not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-(--bg) font-(--font-primary) text-(--text)">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb style back navigation */}
        <Link
          to="/admin/orders"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-(--text-muted) hover:text-(--primary) mb-8 transition-colors"
        >
          <ArrowLeft weight="bold" /> Back to Orders
        </Link>

        {/* Page Header with dynamic status badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black tracking-tight font-(--font-heading)">
                Order Details
              </h1>
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                  order?.status === "Delivered"
                    ? "bg-green-50 border-green-200 text-green-600"
                    : "bg-amber-50 border-amber-200 text-amber-600"
                }`}
              >
                {order?.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-(--text-muted) font-medium">
              <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-(--border)">
                <Hash size={14} /> {order?._id}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarBlank size={14} />{" "}
                {new Date(order?.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Inline status update control */}
          <div className="bg-white border border-(--border) p-2 rounded-2xl shadow-(--shadow-sm) flex items-center gap-3">
            <span className="text-[10px] font-black uppercase px-3 text-(--text-muted)">
              Update Status
            </span>
            <select
              value={order?.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="text-xs font-bold px-4 py-2 bg-(--bg) border border-(--border) rounded-xl outline-none cursor-pointer hover:border-(--primary) transition-all focus:ring-2 focus:ring-(--primary-glow)"
            >
              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Itemized Product List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-(--border) rounded-3xl shadow-(--shadow-sm) overflow-hidden">
              <div className="px-6 py-4 border-b border-(--border) bg-neutral-50/50 flex items-center gap-2">
                <Package weight="bold" size={20} className="text-(--primary)" />
                <h2 className="font-bold text-sm">Shipment Contents</h2>
              </div>
              <div className="p-6 divide-y divide-(--border)">
                {order?.products.map((item, idx) => (
                  <div key={idx} className="py-5 first:pt-0 last:pb-0 flex items-center gap-5 group">
                    <img
                      src={item.product?.image}
                      alt=""
                      className="w-20 h-20 object-cover rounded-2xl border border-(--border) group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-(--text) mb-1">
                        {item.product?.title}
                      </p>
                      <p className="text-xs text-(--text-muted) font-medium">
                        SKU: {item.product?._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-(--text-muted) mb-1">
                        QTY: {item.quantity}
                      </p>
                      <p className="font-black text-(--primary)">
                        ₹{(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Grand Total Footer */}
              <div className="p-8 bg-neutral-50 border-t border-(--border) flex justify-between items-center">
                <span className="font-black text-xs uppercase tracking-[0.2em] text-(--text-muted)">
                  Total Settlement
                </span>
                <span className="text-3xl font-black text-(--primary)">
                  ₹{order?.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar: Customer Metadata and Logistics */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-(--border) rounded-3xl shadow-(--shadow-sm) p-8">
              <div className="flex items-center gap-3 mb-6 text-(--primary)">
                <User weight="bold" size={24} />
                <h2 className="font-black text-sm uppercase tracking-tight text-(--text)">
                  Customer Detail
                </h2>
              </div>
              <p className="font-bold text-base text-(--text) mb-1">{order?.user?.name}</p>
              <p className="text-sm text-(--text-muted) font-medium mb-4">{order?.user?.email}</p>
              <div className="pt-4 border-t border-(--border)">
                <p className="text-[10px] font-black text-(--text-muted) uppercase mb-1">Customer UUID</p>
                <p className="text-[10px] font-mono text-neutral-400 break-all">{order?.user?._id}</p>
              </div>
            </div>

            <div className="bg-white border border-(--border) rounded-3xl shadow-(--shadow-sm) p-8">
              <div className="flex items-center gap-3 mb-6 text-(--primary)">
                <MapPin weight="bold" size={24} />
                <h2 className="font-black text-sm uppercase tracking-tight text-(--text)">
                  Delivery Port
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-(--text-muted) uppercase mb-1">Contact</p>
                  <p className="font-bold text-sm">{order?.shippingAddress?.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-(--text-muted) uppercase mb-1">Destination</p>
                  <p className="text-sm font-medium text-(--text-muted) leading-relaxed">
                    {order?.shippingAddress?.address}
                    <br />
                    {order?.shippingAddress?.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;