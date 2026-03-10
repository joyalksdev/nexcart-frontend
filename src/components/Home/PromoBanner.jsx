import React from "react";
import { useNavigate } from "react-router-dom";

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-16">
      <div className="rounded-3xl bg-gradient-to-br from-(--primary) to-(--primary-glow) p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 text-white shadow-(--shadow-md)">
        
        <div className="max-w-md">
          <span className="uppercase text-[10px] font-black tracking-[0.2em] opacity-80">
            Limited time offer
          </span>

          <h2 className="text-4xl font-black font-(--font-heading) mt-3 leading-tight">
            Summer Sale — <br /> Up to 50% Off
          </h2>

          <p className="text-sm font-medium opacity-80 mt-4 leading-relaxed">
            On select electronics, clothing and home essentials. 
            Don't miss out on the season's best deals.
          </p>

          <button 
            onClick={() => navigate("/products")}
            className="mt-8 bg-white text-(--primary) px-8 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:-translate-y-1 hover:shadow-xl transition-all active:scale-95"
          >
            Shop the Sale →
          </button>
        </div>

        <div className="text-8xl drop-shadow-2xl animate-bounce-slow">
          🛍️
        </div>

      </div>
    </section>
  );
};

export default PromoBanner;