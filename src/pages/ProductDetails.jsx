import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
  ShoppingCart, Heart, ShareNetwork, ShieldCheck,
  Truck, ArrowLeft, Star, Minus, Plus,
} from "@phosphor-icons/react";
import api from "../services/axios";
import { CheckIcon } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams(); // get product ID from the URL
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0); // scroll to top when opening a new product
      try {
        // fetch main product data
        const res = await api.get(`/products/${id}`);
        const productData = res.data.data;
        setProduct(productData);
        setSelectedImage(productData.image);

        // fetch 4 other products from the same category
        if (productData.category) {
          const relatedRes = await api.get(`/products?category=${productData.category}`);
          const filtered = relatedRes.data.data.filter((p) => p._id !== productData._id);
          setRelated(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // check if this product is already in the cart
  const cartItems = useSelector((state) => state.cart.items);
  const cartItem = cartItems.find((item) => item._id === product?._id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  // add product and selected quantity to Redux store
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500); // reset button text after 1.5s
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="bg-(--bg) min-h-screen pb-20 font-(--font-primary)">
      {/* breadcrumb link */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/products" className="flex items-center gap-2 text-(--text-muted) hover:text-(--primary) text-sm font-medium w-fit">
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* image gallery section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-(--bg-card) border border-(--border) rounded-[16px] p-8 flex justify-center items-center">
              <img src={selectedImage} alt={product.title} className="max-h-[500px] w-auto object-contain" />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[product.image, product.image, product.image].map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(img)} className={`w-24 h-24 rounded-[10px] border-2 bg-(--bg-card) ${selectedImage === img ? "border-(--primary)" : "border-(--border)"}`}>
                  <img src={img} alt="thumb" className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* product information & actions */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-(--primary-glow) text-(--primary) text-xs font-bold rounded-full uppercase mb-4">
                {product.category || "New Arrival"}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-(--text-main) mb-3">{product.title}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-(--text-main)">${product.price}</span>
                <span className="text-(--text-muted) line-through text-lg">${(product.price * 1.2).toFixed(2)}</span>
              </div>
            </div>

            <p className="text-(--text-muted) leading-relaxed mb-8">{product.description}</p>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {/* quantity selector logic */}
                <div className="flex items-center border border-(--border) rounded-[10px] p-1 bg-(--bg-card)">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-(--bg) rounded-[8px]"><Minus weight="bold" /></button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-(--bg) rounded-[8px]"><Plus weight="bold" /></button>
                </div>
              </div>

              {/* show current amount in cart */}
              <div className="flex">
                <span className="flex items-center gap-2 bg-(--primary-glow) text-(--primary) text-xs font-bold px-3 py-1 rounded-full">
                  ✔ Total in Cart: <span className="bg-(--primary) text-white px-2 py-[2px] rounded-full text-[10px]">{cartQty}</span>
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-[10px] font-bold text-lg flex items-center justify-center gap-3 transition-all ${added ? "bg-green-600 text-white" : "bg-(--primary) text-white"}`}
              >
                {added ? <><CheckIcon size={24} /> Added</> : <><ShoppingCart weight="bold" size={22} /> Add To Cart</>}
              </button>
            </div>
          </div>
        </div>

        {/* simple recommendation list */}
        <div className="mt-24 border-t border-(--border) pt-16">
          <h2 className="text-2xl font-bold mb-10">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link to={`/products/${item._id}`} key={item._id} className="group bg-(--bg-card) border border-(--border) rounded-[16px] p-4 hover:shadow-lg transition-all">
                <div className="aspect-square bg-(--bg) rounded-[10px] mb-4 flex items-center justify-center p-4">
                  <img src={item.image} alt={item.title} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="text-sm font-bold truncate group-hover:text-(--primary)">{item.title}</h3>
                <p className="text-base font-black mt-2">${item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;