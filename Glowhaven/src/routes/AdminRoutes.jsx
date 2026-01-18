// src/components/common/ProtectedAdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  // ❌ Not Logged In – Go to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but NOT admin – send them home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✔ Correct admin, allow access
  return children;
};

export default ProtectedAdminRoute;

