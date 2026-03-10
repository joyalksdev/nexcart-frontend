import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MagnifyingGlass, X, ShoppingBag,
  CircleNotch, ArrowRight, StarIcon,
} from "@phosphor-icons/react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debounced search logic to optimize API calls
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await api.get(`/products?search=${query}`);
        setResults(res.data.data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // Global "Escape" key listener for better accessibility
  useEffect(() => {
    const handleEsc = (e) => { e.key === "Escape" && onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100]" />

      {/* Modal Container */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-[550px] z-[101] px-4">
        <div className="bg-(--bg-card) rounded-[16px] shadow-2xl border border-(--border) overflow-hidden flex flex-col">
          
          {/* Input Header */}
          <div className="relative flex items-center border-b border-(--border) px-4">
            <MagnifyingGlass 
              size={20} 
              className={loading ? "text-(--primary) animate-pulse" : "text-(--text-muted)"} 
            />
            <input
              autoFocus
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-5 outline-none text-base text-(--text-main)"
            />
            <div className="flex items-center gap-2">
              {loading && <CircleNotch size={18} className="animate-spin text-(--primary)" />}
              <button onClick={onClose} className="p-1.5 hover:bg-(--bg) rounded-[10px] text-(--text-muted)">
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {!query && (
              <div className="p-8 text-center flex flex-col items-center gap-2">
                <ShoppingBag size={32} weight="duotone" className="opacity-50" />
                <p className="text-sm text-(--text-muted)">Start typing to find products...</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2 space-y-1">
                <p className="px-3 py-2 text-[10px] uppercase font-bold text-(--text-muted)">Products</p>
                {results.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => { navigate(`/products/${product._id}`); onClose(); }}
                    className="w-full flex items-center justify-between p-3 rounded-[10px] hover:bg-(--primary-glow) group transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-(--bg) border border-(--border) rounded-[10px] overflow-hidden flex-shrink-0">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-yellow-400">
                          <StarIcon weight="fill" size={10} /> <span>{product.rating || 0}</span>
                        </div>
                        <p className="text-xs text-(--primary) font-semibold">${product.price}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-(--text-muted) opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="bg-(--bg) px-4 py-2 border-t border-(--border) flex justify-between items-center">
            <span className="text-[10px] text-(--text-muted)">{results.length} results found</span>
            <span className="text-[10px] text-(--text-muted)">
              <kbd className="bg-(--bg-card) border border-(--border) px-1 rounded">ESC</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default SearchModal;