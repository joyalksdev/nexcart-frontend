import {
  MagnifyingGlassIcon,
  ShoppingCartSimpleIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo";
import CartDrawer from "../cart/CartDrawer";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import ProfileDropdown from "../ui/ProfileDropdown";
import SearchModal from "../ui/SearchModal";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [cartOpen, setCartOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="flex px-6 md:px-12 lg:px-24 py-4 bg-[#f8fafcd9] border fixed justify-between backdrop-blur-md w-full items-center border-neutral-200 text-md z-50">
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
      />

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <Logo />

    
      <ul className="hidden md:flex items-center gap-5 font-(--font-heading) text-sm">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-2 py-1.5 rounded-md transition duration-300 ${
                isActive
                  ? "bg-(--primary-glow) text-(--primary)"
                  : "text-(--text-muted) hover:bg-(--primary-glow)"
              }`
            }
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `px-2 py-1.5 rounded-md transition duration-300 ${
                isActive
                  ? "bg-(--primary-glow) text-(--primary)"
                  : "text-(--text-muted) hover:bg-(--primary-glow)"
              }`
            }
          >
            Products
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `px-2 py-1.5 rounded-md transition duration-300 ${
                isActive
                  ? "bg-(--primary-glow) text-(--primary)"
                  : "text-(--text-muted) hover:bg-(--primary-glow)"
              }`
            }
          >
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-2 py-1.5 rounded-md transition duration-300 ${
                isActive
                  ? "bg-(--primary-glow) text-(--primary)"
                  : "text-(--text-muted) hover:bg-(--primary-glow)"
              }`
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>


      <div className="flex items-center gap-3">
        <button  onClick={() => setSearchOpen(true)} className="border border-(--border) hover:border-(--primary) transition duration-300 cursor-pointer hover:bg-(--primary-glow) px-1.5 py-1.5 rounded-md">
          <MagnifyingGlassIcon size={20} className="text-(--text-muted)" />
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className="relative border border-(--border) hover:border-(--primary) transition duration-300 cursor-pointer hover:bg-(--primary-glow) px-1.5 py-1.5 rounded-md"
        >
          <ShoppingCartSimpleIcon size={20} className="text-(--text-muted)" />

          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-white bg-(--accent) rounded-full text-xs border-2 border-white px-1">
              {totalItems}
            </span>
          )}
        </button>

        {user ? (
          <ProfileDropdown />
        ) : (
          <Link to="/login">
            <button className="hidden sm:block bg-(--primary) text-sm text-white hover:bg-(--primary-light) px-3 py-1.5 rounded-lg">
              Login
            </button>
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden border border-(--border) p-1.5 rounded-md"
        >
          {menuOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-(--border) md:hidden">
          <ul className="flex flex-col font-(--font-heading) text-sm p-4 gap-3">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-(--text-muted)"
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="text-(--text-muted)"
            >
              Products
            </NavLink>

            <NavLink
              to="/orders"
              onClick={() => setMenuOpen(false)}
              className="text-(--text-muted)"
            >
              Orders
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="text-(--text-muted)"
            >
              Contact
            </NavLink>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
