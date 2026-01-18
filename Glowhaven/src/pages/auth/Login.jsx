// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  clearAuthError,
} from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router"; // ✔ FIXED

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, otpVerified } = useSelector(
    (state) => state.auth
  );

  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showError, setShowError] = useState(false);

  /* 🧹 Clear errors on page load */
  useEffect(() => {
    dispatch(clearAuthError());
    return () => dispatch(clearAuthError()); // ✔ cleanup fix
  }, [dispatch]);

  /* 🔁 If logged in → redirect */
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  /* 🚨 Auto-hide error */
  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [error]);

  /* ================= LOGIN ================= */
  const loginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields!");
    dispatch(loginUser({ email, password }));
  };

  /* ================= FORGOT PW ================= */
  const forgotSubmit = () => {
    if (!email) return alert("Enter email first!");
    dispatch(forgotPassword(email));
    setStep("otp");
  };

  /* ================= VERIFY OTP ================= */
  const otpSubmit = () => {
    dispatch(verifyOtp({ email, otp }));
  };

  /* ================= RESET PASSWORD ================= */
const resetSubmit = async () => {
  if (!newPassword) {
    alert("Enter new password!");
    return;
  }

  const result = await dispatch(
    resetPassword({ email, password: newPassword })
  );

  if (result?.success) {
    alert("Password updated! Please login now.");
    setStep("login");
  } else {
    alert(result?.message || "Password reset failed");
  }
};



  /* 🔓 move to reset screen after OTP success */
  useEffect(() => {
    if (otpVerified) setStep("reset");
  }, [otpVerified]);

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 pt-5">
      <div className="card p-4 shadow-lg border-0" style={{ width: "430px", borderRadius: "14px" }}>
        <h3 className="fw-bold text-center mb-2">Welcome Back 👋</h3>
        <p className="text-center text-muted mb-4">Login to continue shopping</p>

        {/* ❌ ERROR MESSAGE */}
        {showError && (
          <div className="alert alert-danger py-2 text-center" style={{ fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {step === "login" && (
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

            <p className="text-primary text-center fw-semibold" style={{ cursor: "pointer" }} onClick={() => setStep("forgot")}>
              Forgot password?
            </p>

            <div className="text-center mt-2">
              <span>Don't have an account? </span>
              <Link to="/register" className="fw-bold text-success">Sign Up</Link>
            </div>
          </form>
        )}

        {/* ================= FORGOT ================= */}
        {step === "forgot" && (
          <>
            <h5 className="text-center mb-3 fw-semibold">Reset Your Password</h5>
            <input
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-dark w-100" onClick={forgotSubmit}>
              Send OTP
            </button>
            <p className="text-center mt-3 text-primary" style={{ cursor: "pointer" }} onClick={() => setStep("login")}>
              Back to Login
            </p>
          </>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <>
            <h5 className="text-center mb-3 fw-semibold">Enter OTP</h5>
            <input
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn btn-dark w-100" onClick={otpSubmit}>
              Verify OTP
            </button>
          </>
        )}

        {/* ================= RESET PW ================= */}
        {step === "reset" && (
          <>
            <h5 className="text-center mb-3 fw-semibold">Create New Password</h5>
            <input
              className="form-control mb-3"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="btn btn-dark w-100" onClick={resetSubmit}>
              Save & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
