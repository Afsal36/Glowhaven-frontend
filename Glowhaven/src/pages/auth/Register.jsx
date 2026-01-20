// src/pages/auth/Register.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /* =========================
     CLEAR OLD ERRORS
  ========================= */
  useEffect(() => {
    dispatch(clearAuthError());
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  /* =========================
     VALIDATION RULES
  ========================= */
  const validate = (values) => {
    const errs = {};

    // Name
    if (!values.name.trim()) {
      errs.name = "Full name is required";
    } else if (values.name.length < 3) {
      errs.name = "Name must be at least 3 characters";
    }

    // Email
    if (!values.email) {
      errs.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    ) {
      errs.email = "Enter a valid email address";
    }

    // Password
    if (!values.password) {
      errs.password = "Password is required";
    } else if (values.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(values.password)) {
      errs.password = "Password must contain one uppercase letter";
    } else if (!/[0-9]/.test(values.password)) {
      errs.password = "Password must contain one number";
    }

    return errs;
  };

  /* =========================
     HANDLERS
  ========================= */
  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const blurHandler = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
    setErrors(validate(form));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
    });

    if (Object.keys(validationErrors).length > 0) return;

    dispatch(registerUser(form));
  };

  /* =========================
     REDIRECT ON SUCCESS
  ========================= */
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 pt-5">
      <div
        className="card p-4 shadow-lg border-0"
        style={{ width: "430px", borderRadius: "14px" }}
      >
        <h3 className="fw-bold text-center mb-2">
          Create Account
        </h3>
        <p className="text-center text-muted mb-4">
          Join and start shopping
        </p>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} noValidate>
          {/* NAME */}
          <input
            className={`form-control mb-2 ${
              touched.name && errors.name
                ? "is-invalid"
                : ""
            }`}
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={changeHandler}
            onBlur={blurHandler}
          />
          {touched.name && errors.name && (
            <div className="invalid-feedback d-block">
              {errors.name}
            </div>
          )}

          {/* EMAIL */}
          <input
            className={`form-control mb-2 ${
              touched.email && errors.email
                ? "is-invalid"
                : ""
            }`}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={changeHandler}
            onBlur={blurHandler}
          />
          {touched.email && errors.email && (
            <div className="invalid-feedback d-block">
              {errors.email}
            </div>
          )}

          {/* PASSWORD */}
          <input
            className={`form-control mb-3 ${
              touched.password && errors.password
                ? "is-invalid"
                : ""
            }`}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={changeHandler}
            onBlur={blurHandler}
          />
          {touched.password && errors.password && (
            <div className="invalid-feedback d-block">
              {errors.password}
            </div>
          )}

          <button
            className="btn btn-dark w-100"
            disabled={loading}
          >
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
