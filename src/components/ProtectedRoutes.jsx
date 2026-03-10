import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ adminOnly = false }) => {
  const { user, isRestoring } = useSelector((state) => state.auth);

  // 1. Prevent redirect while checking session
  if (isRestoring) return null;

  // 2. Redirect guests to login
  if (!user) return <Navigate to="/login" replace />;

  // 3. Block non-admins if route is admin-specific
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;