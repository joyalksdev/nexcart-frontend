import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Receipt } from "@phosphor-icons/react";
import { getOrderById } from "../services/orderService";
import { FadeLoader } from "react-spinners";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams(); // get unique order ID from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch specific order data when component mounts
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        if (res.success) setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-(--bg)">
      <FadeLoader color="var(--primary)" />
    </div>
  );

  if (!order) return <div className="p-10 text-center font-bold">Order not found.</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-(--bg) font-(--font-primary) text-(--text)">
      <div className="max-w-3xl mx-auto">
        
        {/* navigation back to the full list */}
        <Link to="/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-(--text-muted) hover:text-(--primary) mb-8 transition-colors">
          <ArrowLeft weight="bold" /> My Orders
        </Link>

        {/* top card showing status and date */}
        <div className="bg-white border border-(--border) rounded-2xl p-6 mb-8 shadow-(--shadow-sm)">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-1">Current Status</p>
              <h2 className="text-2xl font-black text-(--primary) uppercase tracking-tight italic">
                {order.status}
              </h2>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-1">Order Date</p>
              <p className="font-bold text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* list of items purchased with price calculations */}
          <div className="bg-white border border-(--border) rounded-2xl shadow-(--shadow-sm) overflow-hidden">
            <div className="px-6 py-4 border-b border-(--border) bg-neutral-50/50 flex items-center gap-2">
              <Receipt weight="bold" className="text-(--primary)" />
              <h2 className="font-bold text-sm">Order Summary</h2>
            </div>
            <div className="p-6 divide-y divide-(--border)">
              {order.products.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <img src={item.product?.image} alt="" className="w-16 h-16 object-cover rounded-xl border border-(--border)" />
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-1">{item.product?.title}</p>
                    <p className="text-xs text-(--text-muted)">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-sm">${(item.product?.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="p-6 bg-neutral-50 border-t border-(--border) flex justify-between items-center">
              <span className="font-black text-xs uppercase tracking-widest">Total Paid</span>
              <span className="text-xl font-black text-(--primary)">${order.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* delivery destination details */}
            <div className="bg-white border border-(--border) rounded-2xl p-6 shadow-(--shadow-sm)">
              <div className="flex items-center gap-2 mb-4 text-(--primary)">
                <MapPin weight="bold" size={20} />
                <h2 className="font-black text-xs uppercase">Shipping Address</h2>
              </div>
              <p className="text-sm font-bold mb-1">{order.user?.name}</p>
              <p className="text-xs text-(--text-muted) leading-relaxed">
                {order.shippingAddress?.address}, {order.shippingAddress?.city}<br />
                {order.shippingAddress?.phone}
              </p>
            </div>

            {/* database reference and extra actions */}
            <div className="bg-white border border-(--border) rounded-2xl p-6 shadow-(--shadow-sm)">
              <div className="flex items-center gap-2 mb-4 text-(--primary)">
                <Package weight="bold" size={20} />
                <h2 className="font-black text-xs uppercase">Order Info</h2>
              </div>
              <p className="text-[10px] font-black text-(--text-muted) uppercase mb-1">Reference ID</p>
              <p className="text-[10px] font-mono text-neutral-400 break-all mb-3">{order._id}</p>
              <button onClick={()=> toast.info("Download Invoice Coming Soon..")} className="w-full py-2 border border-(--border) rounded-lg text-xs font-bold hover:bg-neutral-50 transition-colors">
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;