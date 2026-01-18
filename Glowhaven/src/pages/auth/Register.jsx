// src/pages/auth/Register.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router"; // ✔ FIXED

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showError, setShowError] = useState(false);

  // 🧹 Clear previous login error when opening register page
  useEffect(() => {
    dispatch(clearAuthError());
    return () => dispatch(clearAuthError()); // cleanup ✔
  }, [dispatch]);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // 🛡 Basic validation
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required!");
      return;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    dispatch(registerUser(form));
  };

  // 🚀 Redirect after Register success
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // ❗Auto-hide error
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearAuthError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 pt-5">
      <div className="card p-4 shadow-lg border-0" style={{ width: "430px", borderRadius: "14px" }}>
        
        <h3 className="fw-bold text-center mb-2">Create Account ✨</h3>
        <p className="text-center text-muted mb-4">Join & start shopping now!</p>

        {showError && (
          <div className="alert alert-danger py-2 text-center" style={{ fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          <input
            className="form-control custom-input mb-3"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={changeHandler}
            required
          />

          <input
            className="form-control custom-input mb-3"
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={changeHandler}
            required
          />

          <input
            className="form-control custom-input mb-3"
            type="password"
            name="password"
            placeholder="Create Password (min 6 chars)"
            value={form.password}
            onChange={changeHandler}
            required
          />

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-success">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
