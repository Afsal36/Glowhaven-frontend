import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";

/* ================= THUNKS ================= */

export const fetchWishlist = () => async (dispatch) => {
  dispatch(wishlistLoading());
  try {
    const { data } = await api.get("/wishlist");

    // 🔥 backend safe
    dispatch(setWishlist(data.items || data || []));
  } catch {
    dispatch(setWishlistError("❌ Failed to load wishlist"));
  }
};

export const addToWishlist = (productId) => async (dispatch) => {
  try {
    await api.post("/wishlist/add", { productId });
    dispatch(fetchWishlist()); // 🔥 safest
  } catch {
    toast.error("❌ Cannot add to wishlist");
  }
};

export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    await api.delete(`/wishlist/remove/${productId}`);
    dispatch(fetchWishlist());
  } catch {
    toast.error("❌ Remove failed");
  }
};

/* ================= SLICE ================= */

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    wishlistLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setWishlist: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    setWishlistError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  wishlistLoading,
  setWishlist,
  setWishlistError,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
