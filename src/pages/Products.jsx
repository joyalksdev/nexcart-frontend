import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ui/ProductCard";
import { FadeLoader } from "react-spinners";

const Products = () => {
  // state for storing the products list and UI status
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // states for search, filters, and sorting
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  
  // states for handling multiple pages of data
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // function to get data from the backend based on current filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ search, category, sort, page });
      setProducts(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
    setLoading(false);
  };

  // automatically re-run the search whenever a filter or page number changes
  useEffect(() => {
    fetchProducts();
  }, [search, category, sort, page]);

  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 bg-(--bg) min-h-screen">
      <h1 className="text-3xl font-black font-(--font-heading) mb-10">All Products</h1>

      {/* filter and search bar */}
      <div className="flex flex-wrap gap-4 mb-10 p-4 bg-white rounded-2xl border border-(--border) shadow-(--shadow-sm)">
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 min-w-[200px] border border-(--border) focus:outline-(--primary) px-4 py-2 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-(--border) focus:outline-(--primary) px-4 py-2 rounded-xl bg-white font-bold text-sm"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }} // reset to page 1 on filter change
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Beauty">Beauty</option>
        </select>

        <select
          className="border border-(--border) focus:outline-(--primary) px-4 py-2 rounded-xl bg-white font-bold text-sm"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }} // reset to page 1 on sort change
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* show loading spinner, empty message, or the product grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <FadeLoader color="var(--primary)" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-(--border)">
          <p className="text-(--text-muted) font-bold">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} showWishlist={true} product={product} />
          ))}
        </div>
      )}

      {/* navigation for moving between pages */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-4">
          <div className="flex gap-3 items-center bg-white p-2 px-4 rounded-2xl border border-(--border) shadow-(--shadow-sm)">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-1.5 rounded-lg bg-(--primary) text-white font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Prev
            </button>

            <span className="text-xs font-black uppercase tracking-widest">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-1.5 rounded-lg bg-(--primary) text-white font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;