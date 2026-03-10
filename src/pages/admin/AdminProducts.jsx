import { useEffect, useState } from "react";
import {
  PencilSimple, Trash, Plus,
  MagnifyingGlass, ArrowClockwise,
} from "@phosphor-icons/react";
import { FadeLoader } from "react-spinners";
import { 
  getProducts, createProduct, 
  updateProduct, deleteProduct 
} from "../../services/productService";
import Modal from "../../components/ui/Modal";
import { Link, useLocation } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Modal and Edit state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", 
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // Fetch data from backend with optional search filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ search });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search Debounce: Prevents an API call on every single keystroke
  useEffect(() => {
    const delay = setTimeout(fetchProducts, 500);
    return () => clearTimeout(delay);
  }, [search]);

  // Unified submit handler for both Create and Update operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await updateProduct(selectedId, formData);
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh list to show changes
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // UI Helpers to toggle modal states
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setIsEditMode(true);
    setSelectedId(p._id);
    setFormData({
      name: p.name || "", 
      description: p.description || "",
      price: p.price || "",
      category: p.category || "",
      stock: p.stock || "",
      image: p.image || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 bg-(--bg) min-h-screen font-(--font-primary)">
      
      {/* Admin Navigation Tabs */}
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
                  ? "bg-(--primary) text-white border-(--primary) shadow-(--shadow-sm)"
                  : "bg-(--bg-card) border-(--border) text-(--text-muted) hover:border-(--primary) hover:text-(--primary)"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* View Header and Add Button */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-(--text-main)">Manage Products</h1>
          <p className="text-(--text-muted) text-sm">Create, edit, and delete your store inventory.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-(--primary) hover:bg-(--primary-light) text-white px-5 py-2.5 rounded-[10px] font-bold transition-all active:scale-95 shadow-(--shadow-sm)">
          <Plus weight="bold" size={20} /> Add New Product
        </button>
      </div>

      {/* Main Table Interface */}
      <div className="max-w-7xl mx-auto bg-(--bg-card) border border-(--border) rounded-[16px] shadow-(--shadow-sm) overflow-hidden relative">
        <div className="p-4 border-b border-(--border) flex flex-col sm:flex-row gap-4 justify-between items-center bg-(--bg-card)">
          <div className="relative w-full sm:w-72">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm outline-none focus:border-(--primary) transition-colors"
            />
          </div>
          <button onClick={fetchProducts} className="p-2 text-(--text-muted) hover:text-(--primary) transition-colors">
            <ArrowClockwise size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {/* Overlay loader for background updates */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10">
              <FadeLoader color="var(--primary)" radius={-5} speedMultiplier={1} width={4} loading />
              <span className="text-sm font-bold text-(--primary) mt-4 uppercase tracking-widest">Updating List</span>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg) text-(--text-muted) text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {products.length === 0 && !loading ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-(--text-muted)">No products found.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-(--bg) transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[10px] bg-(--bg) border border-(--border) overflow-hidden shrink-0">
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-sm text-(--text-main) line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 bg-(--bg) border border-(--border) rounded-full text-(--text-muted)">
                        {p.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm text-(--text-main)">${p.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className="text-sm text-(--text-muted)">{p.stock > 0 ? `${p.stock} in Stock` : "Out of Stock"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-(--text-muted) hover:text-blue-500 hover:bg-blue-50 rounded-[10px] transition-all">
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button onClick={() => handleDeleteItem(p._id)} className="p-2 text-(--text-muted) hover:text-red-500 hover:bg-red-50 rounded-[10px] transition-all">
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Modal for Create/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditMode ? "Edit Product" : "Add New Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Product Name</label>
            <input
              required
              className="w-full px-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm focus:border-(--primary) outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Price ($)</label>
              <input
                required type="number"
                className="w-full px-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm focus:border-(--primary) outline-none"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Stock Units</label>
              <input
                required type="number"
                className="w-full px-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm focus:border-(--primary) outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Category</label>
            <input
              required
              className="w-full px-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm focus:border-(--primary) outline-none"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Image URL</label>
            <input
              required
              className="w-full px-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm focus:border-(--primary) outline-none"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-(--text-muted) uppercase tracking-widest">Description</label>
            <textarea
              required
              rows="3"
              className="w-full px-4 py-2 bg-(--bg) border border-(--border) rounded-[10px] text-sm focus:border-(--primary) outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button type="submit" className="w-full py-3 bg-(--primary) hover:bg-(--primary-light) text-white font-bold rounded-[10px] transition-all shadow-md mt-4 active:scale-95">
            {isEditMode ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProducts;