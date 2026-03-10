import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react"; // Matches your other components
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigates to a search results page with the query as a URL param
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="flex flex-col justify-center gap-4 items-center py-20 px-6 text-center">
      
      {/* Dynamic Badge */}
      <div className="flex items-center py-1.5 px-4 rounded-full gap-2 border border-(--primary-glow) text-(--primary) text-xs font-bold bg-(--primary-glow) animate-in fade-in slide-in-from-bottom-2">
        <span className="w-2 h-2 rounded-full bg-(--accent) animate-pulse"></span>
        New arrivals every week
      </div>

      <div className="flex flex-col items-center max-w-2xl">
        <h1 className="tracking-tighter font-black text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
          Shop <em className="text-(--primary) not-italic relative">Smarter</em> <br />
          with NexCart
        </h1>

        <p className="text-sm md:text-base text-(--text-muted) mt-4 max-w-md leading-relaxed">
          Discover curated electronics, fashion, and home essentials — 
          crafted for your modern lifestyle.
        </p>
      </div>

      {/* Hero-Specific Search UI */}
      <form 
        onSubmit={handleSearch}
        className="flex items-center gap-2 w-full max-w-lg mt-6 bg-white p-2 rounded-2xl border border-(--border) focus-within:border-(--primary) focus-within:ring-4 focus-within:ring-(--primary-glow) shadow-xl transition-all duration-300"
      >
        <div className="pl-3">
          <MagnifyingGlass size={22} weight="bold" className="text-(--text-muted)" />
        </div>

        <input
          type="text"
          placeholder="Search products, brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none bg-transparent w-full text-sm md:text-base py-2"
        />

        <button 
          type="submit"
          className="bg-(--primary) text-white font-bold px-6 py-2.5 rounded-xl hover:bg-(--primary-light) transition-all active:scale-95 shadow-(--shadow-sm)"
        >
          Search
        </button>
      </form>

    </section>
  );
};

export default Hero;