import React from "react";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoute from "./components/PublicRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Orders from "./pages/MyOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from './pages/Checkout'

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import ProductDetails from "./pages/ProductDetails";
import OrderSuccess from "./pages/OrderSuccess";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import OrderDetails from "./pages/OrderDetails";

const App = () => {
  return (
    <>
    {/* Global popup notifications */}
    <ToastContainer autoClose={2500} />
    
    <Routes>
      {/* Routes only for logged-out users (Login/Register) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Pages that share the same Navbar and Footer */}
      <Route element={<RootLayout />}>
         <Route index element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
        
        {/* Pages that require a standard user login */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>

        {/* Pages restricted to Admin accounts only */}
        <Route element={<ProtectedRoutes adminOnly={true} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
};

export default App;