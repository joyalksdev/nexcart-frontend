import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center justify-center gap-2">
      <div className="px-2.5 py-2.5 rounded-lg bg-[#4F46E5] flex items-center justify-center">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <h2 className="font-(--font-heading) logo text-2xl tracking-tight">
        Nex<span className="text-(--primary) font-extrabold">Cart</span>
      </h2>
    </Link>
  );
};

export default Logo;
