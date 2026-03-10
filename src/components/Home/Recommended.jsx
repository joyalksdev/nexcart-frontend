import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ui/ProductCard";
// Switch to analytics service for rubric compliance
import { getRecommendations } from "../../services/analyticsService"; 
import { FadeLoader } from "react-spinners";

const Recommended = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        // Using the "RapidMiner" integrated endpoint
        const res = await getRecommendations(); 
        
        if (res.success && res.data) {
          // Displaying the top 5 suggested items
          setProducts(res.data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch recommended products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 bg-(--bg)">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-(--primary) font-black">
            Personalized
          </span>
          <h2 className="text-3xl font-black font-(--font-heading) mt-1 text-(--text)">
            Recommended For You
          </h2>
          <p className="text-[10px] text-(--text-muted) font-bold uppercase tracking-tighter mt-1">
            Powered by RapidMiner AI
          </p>
        </div>
        <button 
          onClick={() => navigate("/products")}
          className="text-(--primary) text-sm font-black hover:underline tracking-tight"
        >
          View all →
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <FadeLoader color="var(--primary)" height={15} width={4} />
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-[240px] md:w-[280px] snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-(--text-muted) font-medium">No recommendations available.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Recommended;