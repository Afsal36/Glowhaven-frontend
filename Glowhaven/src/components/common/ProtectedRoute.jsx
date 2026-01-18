import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedUserRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  // ❌ Not Logged In → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✔ Logged in user → allow access
  return children;
};

export default ProtectedUserRoute;
