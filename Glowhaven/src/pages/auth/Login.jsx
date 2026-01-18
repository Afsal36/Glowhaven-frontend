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
import { Link, useNavigate } from "react-router";

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

  // 🔁 RESEND OTP TIMER
  const [resendTimer, setResendTimer] = useState(0);

  /* 🧹 Clear errors */
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
      setTimeout(() => setShowError(false), 3000);
    }
  }, [error]);

  /* ⏳ OTP RESEND COUNTDOWN */
  useEffect(() => {
    if (resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  /* ================= LOGIN ================= */
  const loginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill all fields!");
    dispatch(loginUser({ email, password }));
  };

  /* ================= FORGOT PASSWORD ================= */
  const forgotSubmit = () => {
    if (!email) return alert("Enter email first!");
    dispatch(forgotPassword(email));
    setResendTimer(30);
    setStep("otp");
  };

  /* ================= VERIFY OTP ================= */
  const otpSubmit = () => {
    if (!otp) return alert("Enter OTP!");
    dispatch(verifyOtp({ email, otp }));
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = () => {
    if (resendTimer > 0) return;
    dispatch(forgotPassword(email));
    setResendTimer(30);
  };

  /* ================= RESET PASSWORD ================= */
  const resetSubmit = async () => {
    if (!newPassword) return alert("Enter new password!");

    const result = await dispatch(
      resetPassword({ email, password: newPassword })
    );

    if (result?.success) {
      alert("Password updated! Please login.");
      setStep("login");
    } else {
      alert(result?.message || "Password reset failed");
    }
  };

  /* 🔓 Move to reset screen after OTP success */
  useEffect(() => {
    if (otpVerified) setStep("reset");
  }, [otpVerified]);

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

        {/* ❌ ERROR */}
        {showError && (
          <div className="alert alert-danger py-2 text-center">
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

            <p
              className="text-primary text-center fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => setStep("forgot")}
            >
              Forgot password?
            </p>

            <div className="text-center mt-2">
              <span>Don't have an account? </span>
              <Link to="/register" className="fw-bold text-success">
                Sign Up
              </Link>
            </div>
          </form>
        )}

        {/* ================= FORGOT ================= */}
        {step === "forgot" && (
          <>
            <h5 className="text-center mb-3 fw-semibold">
              Reset Your Password
            </h5>
            <input
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-dark w-100" onClick={forgotSubmit}>
              Send OTP
            </button>
            <p
              className="text-center mt-3 text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setStep("login")}
            >
              Back to Login
            </p>
          </>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <>
            <h5 className="text-center mb-2 fw-semibold">Enter OTP</h5>
            <p className="text-center text-muted mb-3" style={{ fontSize: "14px" }}>
              OTP sent to <strong>{email}</strong>
            </p>

            <input
              className="form-control mb-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button className="btn btn-dark w-100 mb-2" onClick={otpSubmit}>
              Verify OTP
            </button>

            <div className="text-center mt-2">
              {resendTimer > 0 ? (
                <span className="text-muted">
                  Resend OTP in {resendTimer}s
                </span>
              ) : (
                <span
                  className="text-primary fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={resendOtp}
                >
                  Resend OTP
                </span>
              )}
            </div>

            <p
              className="text-center mt-3 text-secondary"
              style={{ cursor: "pointer" }}
              onClick={() => setStep("login")}
            >
              Back to Login
            </p>
          </>
        )}

        {/* ================= RESET PASSWORD ================= */}
        {step === "reset" && (
          <>
            <h5 className="text-center mb-3 fw-semibold">
              Create New Password
            </h5>
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
