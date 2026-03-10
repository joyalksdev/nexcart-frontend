import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updatePassword, updateUserProfile } from "../services/profileService";
import { setUser, logout } from "../features/auth/authSlice";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ui/Modal";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Local state for profile inputs
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Modal states
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Create avatar based on the CURRENT name in the input field
  const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(name)}`;

  // Logic to update name and email
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      return toast.error("Name and Email cannot be empty");
    }

    setLoading(true);
    try {
      // Call service to update database
      const updatedUser = await updateUserProfile({ name, email });
      // Update Redux so the Navbar update immediately
      dispatch(setUser(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Logic for secure password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (newPassword === currentPassword) {
      return toast.error("New password cannot be the same as old one");
    }

    setPassLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      
      toast.success("Security updated. Please login again.");

      // Security Protocol: Force logout after password change
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setPassLoading(false);
    }
  };

  // Logic to end session
  const handleLogout = async () => {
    try {
      await logoutUser(); // Clear server-side cookies
      dispatch(logout()); // Clear client-side state
      toast.info("Signed out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-(--shadow-md) font-(--font-primary) mb-24 py-12">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-20 h-20 rounded-full mb-3 border-2 border-(--primary-glow) p-1"
        />
        <h2 className="text-xl font-bold text-(--text-main)">{user?.name}</h2>
        <p className="text-sm text-(--text-muted)">{user?.email}</p>
      </div>

      {/* Profile Update Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-(--text-muted) mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-(--border) px-3 py-2 rounded-lg outline-none focus:border-(--primary) transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-(--text-muted) mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-(--border) px-3 py-2 rounded-lg outline-none focus:border-(--primary) transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-(--primary) text-white py-2 rounded-lg font-bold hover:bg-(--primary-light) transition disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Update Profile"}
        </button>
      </form>

      {/* Security Actions */}
      <div className="mt-6 pt-6 border-t border-(--border) space-y-3">
        <button
          onClick={() => setPasswordModal(true)}
          className="w-full border border-(--border) py-2 rounded-lg font-medium hover:bg-gray-50 transition"
        >
          Change Password
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-red-500 border border-red-100 py-2 rounded-lg font-medium hover:bg-red-50 transition"
        >
          Logout Account
        </button>
      </div>

      {/* Password Change Modal */}
      <Modal
        isOpen={passwordModal}
        onClose={() => setPasswordModal(false)}
        title="Update Security"
      >
        <div className="bg-orange-50 border border-orange-100 text-orange-700 text-[11px] p-3 rounded-lg mb-4 font-bold uppercase tracking-tighter">
          Note: You will be logged out automatically after this change.
        </div>

        <form className="flex flex-col gap-3" onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border border-(--border) focus:border-(--primary) outline-none p-2 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-(--border) focus:border-(--primary) outline-none p-2 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-(--border) focus:border-(--primary) outline-none p-2 rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={passLoading}
            className="bg-(--primary) text-white py-2 rounded-lg font-bold mt-2 disabled:opacity-50"
          >
            {passLoading ? "Updating..." : "Confirm Password Change"}
          </button>
        </form>
      </Modal>
    </main>
  );
};

export default Profile;