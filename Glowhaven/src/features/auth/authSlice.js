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

    dispatch(loginSuccess(res.data)); // same as login

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

/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
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

    setAuthError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
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
  setAuthError,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
