import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user, isRestoring } = useSelector((state) => state.auth);

  // Wait for auth state to initialize to prevent accidental redirects
  if (isRestoring) return null; 

  // If logged in, redirect home; otherwise, allow access to guest pages
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoute;