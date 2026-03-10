import React from "react";
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { ratingStars } from "../../utils/ratingStars";
import { getProductBadge } from "../../utils/productBadge";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseQty, increaseQty } from "../../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCard = ({ product, showWishlist = true }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  if (!product) return null;

  const badge = getProductBadge(product);
  const cartItem = cartItems.find(item => item._id === product._id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="group bg-white border border-(--border) rounded-2xl overflow-hidden hover:shadow-(--shadow-md) transition-all duration-300 relative flex flex-col h-full">
      
      {/* Badges & Wishlist */}
      <div className="absolute top-3 inset-x-3 z-10 flex justify-between items-start pointer-events-none">
        {badge && (
          <span className={`pointer-events-auto px-2 py-1 text-[9px] font-black uppercase rounded-lg text-white ${badge.color}`}>
            {badge.label}
          </span>
        )}
        {showWishlist && (
          <button 
            onClick={() => toast.info("Coming Soon!")} 
            className="pointer-events-auto p-2 bg-white/80 backdrop-blur-md border border-(--border) rounded-full text-(--text-muted) hover:text-red-500 transition-all active:scale-90"
          >
            <Heart size={14} />
          </button>
        )}
      </div>

      {/* Image Section */}
      <Link to={`/products/${product._id}`} className="block aspect-[10/11] overflow-hidden bg-neutral-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 gap-1">
        <span className="text-[10px] font-bold uppercase text-(--text-muted)">{product.category}</span>
        <h3 className="font-bold text-sm text-(--text) line-clamp-2 min-h-[2.5rem]">{product.name}</h3>

        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex text-amber-400">{ratingStars(product.rating)}</div>
          <span className="text-[10px] font-bold text-(--text-light)">({product.rating})</span>
        </div>

        {/* Footer: Price & Cart Logic */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-(--text-light)">Price</span>
            <span className="font-black text-lg text-(--primary)">{formatPrice(product.price)}</span>
          </div>

          {quantity === 0 ? (
            <button
              onClick={() => dispatch(addToCart(product))}
              className="w-10 h-10 flex items-center justify-center bg-(--primary) text-white rounded-xl hover:bg-(--primary-light) transition-all active:scale-95"
            >
              <ShoppingCart size={18} />
            </button>
          ) : (
            <div className="flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-200">
              <button onClick={() => dispatch(decreaseQty(product._id))} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg">
                <Minus size={12} strokeWidth={3} />
              </button>
              <span className="w-6 text-center text-xs font-black">{quantity}</span>
              <button onClick={() => dispatch(increaseQty(product._id))} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-lg">
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;