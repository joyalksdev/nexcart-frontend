import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CreditCard, MapPin, Trash,
  Minus, Plus, ShoppingBag,
} from "@phosphor-icons/react";
import { createOrder } from "../services/orderService";
import {
  increaseQty, decreaseQty, removeFromCart, clearCart,
} from "../features/cart/cartSlice";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // pull live cart data from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  // calculate current total before submitting
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // handle the final submission to the backend
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty");

    setLoading(true);
    try {
      const orderData = {
        // Map Redux items to match your Mongoose orderSchema
        products: cartItems.map((item) => ({
          product: item._id, 
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: formData,
        totalPrice: subtotal,
      };

      const res = await createOrder(orderData);

      if (res.success) {
        // wipe cart and redirect to specific success page
        dispatch(clearCart());
        navigate(`/order-success/${res.data._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-(--bg) font-(--font-primary) text-(--text)">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black font-(--font-heading)">Secure Checkout</h1>
          <p className="text-(--text-muted) text-sm">Review your items and provide delivery details.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Section 1: Address and contact form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 border border-(--border) rounded-2xl shadow-(--shadow-sm)">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-(--primary-glow) text-(--primary) rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-lg font-bold">Shipping Information</h2>
              </div>

              <form id="checkout-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Delivery Address</label>
                  <input
                    required
                    placeholder="e.g. 123 Street Name, Apartment 4B"
                    className="w-full px-4 py-3 bg-(--bg) border border-(--border) rounded-xl text-sm outline-none focus:border-(--primary) transition-all"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">City</label>
                  <input
                    required
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 bg-(--bg) border border-(--border) rounded-xl text-sm outline-none focus:border-(--primary) transition-all"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Phone Number</label>
                  <input
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 bg-(--bg) border border-(--border) rounded-xl text-sm outline-none focus:border-(--primary) transition-all"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Section 2: Summary and final CTA */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-(--border) rounded-2xl shadow-(--shadow-sm sticky top-10 overflow-hidden">
              <div className="p-6 bg-neutral-50 border-b border-(--border) flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2"><ShoppingBag weight="bold" /> Your Cart ({cartItems.length})</h2>
                <span className="text-xs font-black text-(--primary) bg-white px-2 py-1 rounded border border-(--border)">STEP 2</span>
              </div>

              {/* itemized breakdown within the checkout flow */}
              <div className="p-6 space-y-5 max-h-[450px] overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p className="text-center text-(--text-muted) py-10">Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item._id} className="flex gap-4 group">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg border border-(--border)" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold line-clamp-1 leading-tight">{item.title}</h4>
                          <button onClick={() => dispatch(removeFromCart(item._id))} className="text-neutral-400 hover:text-red-500"><Trash size={16} /></button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border border-(--border) rounded-lg bg-(--bg)">
                            <button onClick={() => dispatch(decreaseQty(item._id))} className="p-1.5 hover:text-(--primary) border-r border-(--border)"><Minus size={12} weight="bold" /></button>
                            <span className="px-3 text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => dispatch(increaseQty(item._id))} className="p-1.5 hover:text-(--primary) border-l border-(--border)"><Plus size={12} weight="bold" /></button>
                          </div>
                          <p className="font-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* final pricing calculations and submit button */}
              <div className="p-6 bg-neutral-50 border-t border-(--border) space-y-4">
                <div className="flex justify-between items-center border-t border-(--border) pt-4">
                  <span className="font-black text-lg">Total</span>
                  <span className="text-2xl font-black text-(--primary)">${subtotal.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading || cartItems.length === 0}
                  className="w-full py-4 bg-(--primary) text-white font-black rounded-xl shadow-lg hover:shadow-(--primary-glow) transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  <CreditCard weight="bold" size={20} />
                  {loading ? "Completing Purchase..." : "Confirm & Pay Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;