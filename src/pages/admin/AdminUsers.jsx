import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowClockwise, Trash } from "@phosphor-icons/react";
import { FadeLoader } from "react-spinners";
import { getAllUsers, deleteUser } from "../../services/userService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // fetch the list of all registered users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // handle user deletion with a confirmation safety check
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers(); // refresh the list after successful deletion
    } catch (err) {
      alert("Delete failed. Ensure you have administrative privileges.");
    }
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-(--bg) font-(--font-primary) text-(--text)">
      
      {/* admin sub-navigation bar */}
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

      {/* header section with manual refresh trigger */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight font-(--font-heading)">Users</h1>
          <p className="text-(--text-muted) text-sm font-(--font-lead)">Manage account permissions and customer data.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="p-2 bg-(--bg-card) border border-(--border) rounded-lg shadow-(--shadow-sm) hover:shadow-(--shadow-md) transition-all"
        >
          <ArrowClockwise size={22} className={loading ? "animate-spin text-(--primary)" : ""} />
        </button>
      </div>

      {/* user data table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-(--bg-card) border border-(--border) rounded-xl shadow-(--shadow-sm) overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-(--bg) border-b border-(--border) text-[10px] uppercase tracking-widest font-black text-(--text-light)">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center"><FadeLoader color="var(--primary)" /></td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-(--bg) transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* avatar placeholder using the first letter of name */}
                        <div className="w-8 h-8 rounded-full bg-(--primary-glow) text-(--primary) flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-(--text-muted)">{user.email}</td>
                    <td className="px-6 py-4">
                      {/* conditional styling for role badges */}
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                        user.role === 'admin' 
                        ? 'bg-(--primary-glow) text-(--primary) border-(--primary)' 
                        : 'bg-gray-50 text-(--text-light) border-gray-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* prevent admin from accidentally deleting other admins here */}
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="p-2 text-(--text-light) hover:text-red-500 transition-colors"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;