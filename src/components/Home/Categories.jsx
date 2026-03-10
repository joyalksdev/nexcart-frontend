import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Electronics", icon: "⚡", count: "1,240 products"},
  { name: "Clothing", icon: "👗", count: "3,800 products"},
  { name: "Home", icon: "🏡", count: "920 products"},
  { name: "Beauty", icon: "✨", count: "640 products",},
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16">
      <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-(--primary) font-bold">
            Browse
          </span>
          <h2 className="text-3xl font-black font-(--font-heading) mt-1">
            Shop by Category
          </h2>
        </div>

        <button 
          onClick={() => navigate("/products")}
          className="text-(--primary) text-sm font-bold hover:underline"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => navigate(`/products`)}
            className="bg-white border border-(--border) rounded-xl p-6 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-(--shadow-md) hover:border-(--primary) transition cursor-pointer group"
          >
            <div className="text-2xl">{cat.icon}</div>

            <div>
              <h3 className="font-bold font-(--font-heading)">{cat.name}</h3>
              <p className="text-xs text-(--text-muted)">{cat.count}</p>
            </div>

            <span className="text-(--text-muted) group-hover:text-(--primary) group-hover:translate-x-1 transition-all mt-auto">
              →
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;