import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { User, ShieldCheck, SignOut, CaretDown } from "@phosphor-icons/react";
import { logoutUser } from "../../services/authService";

const ProfileDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const close = (e) => !dropdownRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser(); // Backend cleanup
      dispatch(logout()); // Redux cleanup
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  const avatar = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(user.name)}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-slate-100 p-1 rounded-full transition-all active:scale-95"
      >
        <img src={avatar} alt="" className="w-8 h-8 rounded-full border border-(--border)" />
        <span className="font-medium text-sm text-(--primary) hidden sm:block">{user.name}</span>
        <CaretDown size={14} className={`transition-transform text-(--primary) ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Account</p>
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
          </div>

          <ul className="py-1">
            <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <User size={18} weight="duotone" /> Profile
            </Link>

            {user.role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <ShieldCheck size={18} weight="duotone" /> Admin Panel
              </Link>
            )}

            <hr className="my-1 border-gray-100" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium">
              <SignOut size={18} /> Logout
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;