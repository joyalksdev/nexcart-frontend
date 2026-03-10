import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, CurrencyDollar, ArrowClockwise } from "@phosphor-icons/react";
import { FadeLoader } from "react-spinners";
import { getAnalytics } from "../../services/adminService";
import { Link, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  // Initialize state with default zeros to prevent undefined errors during first render
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Primary function to pull aggregated metrics from the backend
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getAnalytics();
      if (res.success) setStats(res.data);
    } catch (err) { 
      console.error("Dashboard analytics fetch failed:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const navLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Inventory", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "User Management", path: "/admin/users" },
  ];

  return (
    <div className="p-6 md:p-10 font-(--font-primary) bg-(--bg) min-h-screen text-(--text)">
      
      {/* Global Admin Navigation Bar */}
      <div className="flex max-w-6xl mx-0 lg:mx-12 mb-5">
        <div className="flex flex-wrap gap-3 mt-4">
          {navLinks.map((link) => (
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

      {/* Title and Manual Sync Button */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black font-(--font-heading)">Dashboard</h1>
        <button 
          onClick={fetchStats} 
          className="p-2 bg-(--bg-card) border border-(--border) rounded-lg shadow-(--shadow-sm) transition-all active:scale-95 hover:border-(--primary)"
          title="Refresh Statistics"
        >
          <ArrowClockwise size={24} className={loading ? "animate-spin text-(--primary)" : ""} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FadeLoader color="var(--primary)" />
          </div>
        ) : (
          /* KPI Grid: Responsive layout for various screen sizes */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Revenue", val: `$${stats.totalRevenue.toLocaleString()}`, icon: <CurrencyDollar size={24} />, color: "text-green-600", bg: "bg-green-50" },
              { label: "Orders", val: stats.totalOrders.toLocaleString(), icon: <ShoppingCart size={24} />, color: "text-(--primary)", bg: "bg-(--primary-glow)" },
              { label: "Inventory", val: stats.totalProducts.toLocaleString(), icon: <Package size={24} />, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Customers", val: stats.totalUsers.toLocaleString(), icon: <Users size={24} />, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((card, i) => (
              <div key={i} className="bg-(--bg-card) p-6 rounded-xl border border-(--border) shadow-(--shadow-sm) transition-transform hover:translate-y-[-4px]">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-2 ${card.bg} ${card.color} rounded-lg`}>{card.icon}</div>
                  <p className="text-[10px] font-black text-(--text-light) uppercase tracking-widest">{card.label}</p>
                </div>
                <h2 className="text-3xl font-black">{card.val}</h2>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;