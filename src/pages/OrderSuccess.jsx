import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowLeft, Receipt } from "@phosphor-icons/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use"; 
import { getOrderById } from "../services/orderService";
import { FadeLoader } from "react-spinners";

const OrderSuccess = () => {
  const { id } = useParams(); // get the order ID from the URL path
  const { width, height } = useWindowSize(); // for full-screen confetti
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runConfetti, setRunConfetti] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // pull the specific order details from the database
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // stop the confetti animation after 5 seconds
    const timer = setTimeout(() => setRunConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [id]);

  // show loading spinner while waiting for the database
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-(--bg)">
        <FadeLoader color="var(--primary)" />
        <p className="mt-4 text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Finalizing Order...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg) p-6 md:p-10 font-(--font-primary) text-(--text) overflow-x-hidden">
      {/* celebration effect on mount */}
      {runConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} colors={['#7c3aed', '#a78bfa', '#10b981']} />}
      
      <div className="max-w-3xl mx-auto mt-10">
        {/* success icon and main heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6 animate-bounce">
            <CheckCircle size={48} weight="fill" />
          </div>
          <h1 className="text-4xl font-black font-(--font-heading) mb-2">Order Confirmed!</h1>
          <p className="text-(--text-muted)">Thanks for shopping with us. Your order <span className="font-bold text-(--text)">#{order?._id.slice(-6).toUpperCase()}</span> is being processed.</p>
        </div>

        {/* box containing the summary of items and totals */}
        <div className="bg-white border border-(--border) rounded-3xl shadow-(--shadow-sm) overflow-hidden mb-8">
          <div className="p-6 border-b border-(--border) flex justify-between items-center bg-neutral-50">
            <div className="flex items-center gap-2">
              <Receipt size={20} className="text-(--primary)" weight="bold" />
              <span className="font-bold">Order Summary</span>
            </div>
            <span className="text-[10px] font-black bg-white border border-(--border) px-3 py-1 rounded-full uppercase tracking-tighter">
              Paid via Card
            </span>
          </div>

          <div className="p-8 space-y-6">
            {/* map through the populated products list */}
            <div className="space-y-4">
              {order?.products?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.product?.image} alt="product" className="w-10 h-10 object-cover rounded" />
                    <span className="text-sm font-medium">{item.product?.title}</span>
                    <span className="text-xs text-neutral-400">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-sm">₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-(--border)" />

            {/* shipping and pricing info */}
            <div className="grid grid-cols-2 gap-8 py-2">
              <div>
                <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-2">Shipping To</p>
                <p className="text-sm font-bold">{order?.shippingAddress?.city}</p>
                <p className="text-xs text-(--text-muted) leading-relaxed">{order?.shippingAddress?.address}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest mb-2">Total Paid</p>
                <p className="text-2xl font-black text-(--primary)">₹{order?.totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* navigation buttons to track orders or go home */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link 
            to="/orders" 
            className="flex items-center gap-2 px-8 py-3 bg-white border border-(--border) rounded-xl font-bold text-sm hover:bg-neutral-50 transition-all active:scale-95"
          >
            <Package size={18} weight="bold" />
            Track Order
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-8 py-3 bg-(--primary) text-white rounded-xl font-bold text-sm hover:bg-(--primary-light) shadow-lg shadow-(--primary-glow) transition-all active:scale-95"
          >
            <ArrowLeft size={18} weight="bold" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;