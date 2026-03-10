import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/Logo";
import { loginStart, loginSuccess, loginFail } from "../features/auth/authSlice";
import { registerUser } from "../services/authService";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // state to hold input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  // update state whenever a user types in a field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic checks before calling the API
    if (!name.trim() || !email.trim() || !password.trim()) {
      return toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    dispatch(loginStart());
    setLoading(true);

    try {
      // send registration data to the backend
      const res = await registerUser({ name, email, password });

      // save user data to global state and redirect to home
      dispatch(loginSuccess(res.data)); 
      toast.success("Account created successfully!");

      navigate("/");
    } catch (err) {
      // handle errors like "email already exists"
      const errorMsg = err.response?.data?.message || "Registration failed";
      dispatch(loginFail(errorMsg));
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-(--bg) font-(--font-primary)">
      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-(--bg-card) rounded-2xl shadow-(--shadow-md) flex flex-col justify-center items-center py-8 px-6"
      >
        <div className="flex flex-col gap-1 items-center mb-4">
          <Logo />
          <p className="text-(--text-muted) text-xs text-center">
            Create an account to start shopping
          </p>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1 mt-3 w-full">
          <label htmlFor="name" className="text-(--text-muted) text-sm">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="John Doe"
            className="outline-none px-3 py-2 border border-(--border) rounded-lg focus:border-(--primary)"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1 mt-3 w-full">
          <label htmlFor="email" className="text-(--text-muted) text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="example@mail.com"
            className="outline-none px-3 py-2 border border-(--border) rounded-lg focus:border-(--primary)"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 mt-3 w-full">
          <label htmlFor="password" className="text-(--text-muted) text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handleChange}
            placeholder="••••••••"
            className="outline-none px-3 py-2 border border-(--border) rounded-lg focus:border-(--primary)"
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1 mt-3 w-full">
          <label htmlFor="confirmPassword" className="text-(--text-muted) text-sm">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="outline-none px-3 py-2 border border-(--border) rounded-lg focus:border-(--primary)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full py-2 bg-(--primary) hover:bg-(--primary-light) text-white font-medium rounded-lg cursor-pointer shadow-(--shadow-sm) transition disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-(--text-muted)">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-(--primary) font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;