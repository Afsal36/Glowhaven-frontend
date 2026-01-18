// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  /* 🧹 Clear errors on load & unmount */
  useEffect(() => {
    dispatch(clearAuthError());
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  /* 🔁 Redirect if logged in */
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  /* 🚨 Auto-hide error */
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  /* ================= LOGIN ================= */
  const loginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 pt-5">
      <div
        className="card p-4 shadow-lg border-0"
        style={{ width: "430px", borderRadius: "14px" }}
      >
        <h3 className="fw-bold text-center mb-2">Welcome Back 👋</h3>
        <p className="text-center text-muted mb-4">
          Login to continue shopping
        </p>

        {/* ❌ ERROR MESSAGE */}
        {showError && (
          <div
            className="alert alert-danger py-2 text-center"
            style={{ fontSize: "14px" }}
          >
            {error}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={loginSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-dark w-100 mb-3" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>

          <div className="text-center mt-2">
            <span>Don't have an account? </span>
            <Link to="/register" className="fw-bold text-success">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
