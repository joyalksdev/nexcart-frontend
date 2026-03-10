import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X, Trash, Minus, Plus,
  ShoppingCartSimple, ArrowRight,
} from "@phosphor-icons/react";
import { useDispatch } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

// Threshold for free shipping reward
const FREE_SHIPPING = 50; 

const CartDrawer = ({ open, onClose, cartItems = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // disable background scrolling when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  // calculate total price of all items
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // percentage for the progress bar
  const progress = Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  // use createPortal to render the drawer outside the main DOM tree
  return createPortal(
    <>
      {/* darkened background overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity"
      />

      {/* sliding drawer container */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white z-[101]
          flex flex-col shadow-2xl border-l border-(--border)
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* top header with item count */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-(--border)">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCartSimple size={24} weight="bold" className="text-(--primary)" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-(--primary) text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
            <h2 className="font-black font-(--font-heading) text-xl tracking-tight">My Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100"><X size={20} weight="bold" /></button>
        </div>

        {/* dynamic free shipping motivator */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 bg-neutral-50/50 border-b border-(--border)">
            <p className="text-[11px] font-black uppercase tracking-widest text-(--text-muted) mb-2">
              {subtotal >= FREE_SHIPPING
                ? "You've earned Free Shipping! 🚚"
                : `Spend $${(FREE_SHIPPING - subtotal).toFixed(2)} more for Free Shipping`}
            </p>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-full bg-(--primary) transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* scrollable product list */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <ShoppingCartSimple size={64} weight="thin" className="mb-4" />
              <p className="font-bold">Your cart is currently empty</p>
              <button onClick={onClose} className="mt-6 font-black text-xs uppercase text-(--primary)">Start Shopping →</button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex gap-4 group">
                <div className="w-20 h-24 bg-neutral-50 border border-(--border) rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-black truncate">{item.title}</h3>
                    <button onClick={() => dispatch(removeFromCart(item._id))} className="text-neutral-300 hover:text-red-500"><Trash size={18} /></button>
                  </div>
                  <p className="text-sm font-bold text-(--primary) mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {/* item quantity adjustments */}
                    <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 border border-neutral-200">
                      <button onClick={() => dispatch(decreaseQty(item._id))} className="p-1.5 hover:bg-white rounded-md"><Minus size={12} weight="bold" /></button>
                      <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                      <button onClick={() => dispatch(increaseQty(item._id))} className="p-1.5 hover:bg-white rounded-md"><Plus size={12} weight="bold" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* sticky bottom summary and checkout action */}
        {cartItems.length > 0 && (
          <div className="border-t border-(--border) p-6 bg-white space-y-4">
            <div className="flex justify-between text-lg font-black text-(--text)">
              <span>Total</span>
              <span className="text-(--primary)">${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { onClose(); navigate("/checkout"); }}
              className="w-full bg-(--primary) text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Checkout Now <ArrowRight weight="bold" />
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;