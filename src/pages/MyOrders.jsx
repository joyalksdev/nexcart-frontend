import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMyOrders } from "../services/orderService";
import { FadeLoader } from "react-spinners";
import { Package, CaretRight, ShoppingBagOpen } from "@phosphor-icons/react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  // fetch all orders belonging to the logged-in user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  // helper function to style status badges dynamically
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return "bg-green-50 text-green-600 border-green-100";
      case 'processing': return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-(--bg) font-(--font-primary) text-(--text)">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black font-(--font-heading)">Order History</h1>
          <p className="text-(--text-muted) text-sm font-(--font-lead)">Manage your recent purchases and tracking information.</p>
        </header>

        {/* loader state while API is fetching */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FadeLoader color="var(--primary)" />
            <p className="mt-4 text-[10px] font-black text-(--text-light) uppercase tracking-widest">Syncing Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          /* empty state UI if no orders exist in DB */
          <div className="text-center py-20 bg-white border border-dashed border-(--border) rounded-2xl">
            <ShoppingBagOpen size={48} className="mx-auto text-(--text-light) mb-4" />
            <p className="text-(--text-muted) font-bold mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="inline-block bg-(--primary) text-white px-6 py-2 rounded-lg font-bold text-sm">
              Explore Products
            </Link>
          </div>
        ) : (
          /* list of order cards */
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 border border-(--border) rounded-xl shadow-(--shadow-sm) hover:border-(--primary) transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-(--primary-glow) rounded-lg flex items-center justify-center text-(--primary)">
                      <Package size={24} weight="bold" />
                    </div>
                    <div>
                      {/* showing a cleaner version of the long Mongo ID */}
                      <h3 className="font-bold text-sm">Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p className="text-xs text-(--text-light)">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-(--text-light) uppercase tracking-widest mb-1">Total</p>
                      <p className="font-black text-(--primary)">${order.totalPrice.toLocaleString()}</p>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-md border text-[10px] font-black uppercase tracking-tight ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>

                    {/* navigate to detailed view for this specific order */}
                    <Link to={`/orders/${order._id}`} className="p-2 text-(--text-light) hover:text-(--primary) transition-colors">
                      <CaretRight size={20} weight="bold" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;