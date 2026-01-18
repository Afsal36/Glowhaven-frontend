import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";

/* ================= THUNKS ================= */

// 📌 FETCH CART
export const fetchCart = () => async (dispatch) => {
  dispatch(cartLoading());
  try {
    const { data } = await api.get("/cart");
    dispatch(setCartItems(data.items || []));
    dispatch(setCartSubtotal(data.subtotal || 0));
  } catch {
    dispatch(setCartError("❌ Unable to load cart"));
  }
};

// ➕ ADD TO CART
export const addToCart =
  ({ productId, quantity = 1 }) =>
  async (dispatch) => {
    try {
      const { data } = await api.post(
        "/cart", // ✅ correct endpoint
        {
          productId,
          qty: quantity, // ✅ backend expects qty
        }
      );

      dispatch(setCartItems(data.items));
      dispatch(setCartSubtotal(data.subtotal));
    } catch (err) {
      console.error("ADD TO CART ERROR 👉", err.response?.data || err.message);

      dispatch(
        setCartError(
          err.response?.data?.message || "Add to cart failed"
        )
      );
    }
  };


// 🔄 UPDATE QTY (NO LOADING FLICKER)
export const updateCartQty =
  ({ productId, quantity }) =>
  async (dispatch) => {
    try {
      const { data } = await api.put(`/cart/update/${productId}`, {
        quantity,
      });

      dispatch(setCartItems(data.items));
      dispatch(setCartSubtotal(data.subtotal));
    } catch {
      toast.error("Failed to update quantity");
    }
  };

// ❌ REMOVE ITEM
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    const { data } = await api.delete(`/cart/${productId}`);

    // 🔥 consistent response handling
    dispatch(setCartItems(data.items || []));
    dispatch(setCartSubtotal(data.subtotal || 0));
  } catch {
    dispatch(setCartError("Remove failed"));
  }
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    loading: false,
    error: null,
  },
  reducers: {
    cartLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCartItems: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    setCartSubtotal: (state, action) => {
      state.subtotal = action.payload;
    },
    setCartError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔐 FOR LOGOUT
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  cartLoading,
  setCartItems,
  setCartSubtotal,
  setCartError,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
