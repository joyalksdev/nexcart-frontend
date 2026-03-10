import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { restoreUserSession } from "../../services/authService";

const RootLayout = () => {
  const dispatch = useDispatch();
  const { isRestoring } = useSelector((state) => state.auth);

  useEffect(() => {
    restoreUserSession(dispatch);
  }, [dispatch]);

  if (isRestoring) {
    return (
      <div className="flex justify-center items-center h-screen text-(--text-muted)">
        Restoring session...
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-200">
      <Navbar />
      <main className="px-0 lg:px-6 pt-24 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;