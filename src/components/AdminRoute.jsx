import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, isRestoring } = useSelector((state) => state.auth);

  // Prevent jumping to login/home while state is being restored
  if (isRestoring) return null;

  // No user? Go to login
  if (!user) return <Navigate to="/login" replace />;

  // Not an admin? Go home
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;