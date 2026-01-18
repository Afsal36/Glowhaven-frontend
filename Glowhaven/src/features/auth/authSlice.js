import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= MANUAL THUNKS ================= */

// LOGIN
export const loginUser = (data) => async (dispatch) => {
  dispatch(authLoading());
  try {
    const res = await api.post("/auth/login", data);

    dispatch(loginSuccess(res.data));

    // 🔥 Persist auth
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    return { success: true };
  } catch (err) {
    dispatch(
      setAuthError(err.response?.data?.message || "Login failed")
    );
    return { success: false };
  }
};

// REGISTER
export const registerUser = (data) => async (dispatch) => {
  dispatch(authLoading());
  try {
    const res = await api.post("/auth/register", data);

    // 🔥 SAME AS LOGIN (IMPORTANT)
    dispatch(loginSuccess(res.data));

    // 🔥 Persist auth
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    return { success: true };
  } catch (err) {
    dispatch(
      setAuthError(err.response?.data?.message || "Registration failed")
    );
    return { success: false };
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authLoading());
  try {
    await api.post("/auth/forgot-password", { email });
    dispatch(otpSentSuccess());
  } catch (err) {
    dispatch(
      setAuthError(err.response?.data?.message || "Failed to send OTP")
    );
  }
};

// VERIFY OTP
export const verifyOtp = (data) => async (dispatch) => {
  dispatch(authLoading());
  try {
    await api.post("/auth/verify-otp", data);
    dispatch(otpVerifiedSuccess());
  } catch (err) {
    dispatch(
      setAuthError(err.response?.data?.message || "Invalid OTP")
    );
  }
};

// RESET PASSWORD
export const resetPassword = ({ email, password }) => async () => {
  try {
    const res = await api.post("/auth/reset-password", {
      email,
      password,
    });

    return {
      success: true,
      message: res.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message || "Password reset failed",
    };
  }
};

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",

  // 🔥 PERSIST AUTH ON REFRESH
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    otpSent: false,
    otpVerified: false,
  },

  reducers: {
    authLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
    },

    otpSentSuccess: (state) => {
      state.loading = false;
      state.otpSent = true;
    },

    otpVerifiedSuccess: (state) => {
      state.loading = false;
      state.otpVerified = true;
    },

    setAuthError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;

      // 🔥 Clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  authLoading,
  loginSuccess,
  registerSuccess,
  otpSentSuccess,
  otpVerifiedSuccess,
  setAuthError,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
