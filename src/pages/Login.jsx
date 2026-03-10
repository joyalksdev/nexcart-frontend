import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/Logo";
import {
  loginStart,
  loginSuccess,
  loginFail,
} from "../features/auth/authSlice";
import api from "../services/axios"; // your axios instance
import { setCart } from "../features/cart/cartSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    dispatch(loginStart());
    setLoading(true);

    try {
     const res = await api.post("/auth/login", { email, password });

      dispatch(loginSuccess(res.data));

      toast.success("Login successful!");

      navigate("/");

    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || "Login failed"));
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-(--bg) font-(--font-primary)">
      <form
        onSubmit={handleSubmit}
        className="w-[350px] bg-(--bg-card) rounded-2xl shadow-(--shadow-md) flex flex-col justify-center items-center py-6 px-6"
      >
        <div className="flex flex-col gap-1 items-center mb-4">
          <Logo />
          <p className="text-(--text-muted) text-xs text-center">
            Login to Continue Shopping
          </p>
        </div>

        <div className="flex flex-col gap-1 mt-4 w-full">
          <label htmlFor="email" className="text-(--text-muted)">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="outline-none px-3 py-2 border border-(--border) rounded-lg focus:border-(--primary)"
          />
        </div>

        <div className="flex flex-col gap-1 mt-3 w-full">
          <label htmlFor="password" className="text-(--text-muted)">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="outline-none px-3 py-2 border border-(--border) rounded-lg focus:border-(--primary)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full py-2 bg-(--primary) hover:bg-(--primary-light) cursor-pointer text-white font-medium rounded-lg cursor-po shadow-(--shadow-sm) transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-(--text-muted)">
          New here?{" "}
          <Link
            to="/register"
            className="text-(--primary) font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Login;
