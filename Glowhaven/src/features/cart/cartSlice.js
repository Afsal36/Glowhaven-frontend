import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";

/* ================= THUNKS ================= */

// FETCH CART
export const fetchCart = () => async (dispatch) => {
  dispatch(cartLoading());
  try {
    const { data } = await api.get("/cart");
    dispatch(setCartItems(data.items || []));
  } catch {
    dispatch(setCartError("Unable to load cart"));
  }
};

// ADD TO CART
export const addToCart =
  ({ productId, quantity = 1 }) =>
  async (dispatch) => {
    try {
      const { data } = await api.post("/cart", {
        productId,
        qty: quantity,
      });
      dispatch(setCartItems(data.items));
    } catch {
      dispatch(setCartError("Add to cart failed"));
    }
  };

// UPDATE QTY (BACKGROUND SYNC ONLY)
export const updateCartQty =
  ({ productId, quantity }) =>
  async () => {
    try {
      await api.put(`/cart/update/${productId}`, {
        quantity,
      });
    } catch {
      toast.error("Failed to update quantity");
    }
  };

// REMOVE ITEM
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    const { data } = await api.delete(`/cart/${productId}`);
    dispatch(setCartItems(data.items || []));
  } catch {
    dispatch(setCartError("Remove failed"));
  }
};

/* ================= SLICE ================= */

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
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

    setCartError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🚀 OPTIMISTIC UPDATE (KEY FIX)
    updateQtyOptimistic: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(
        (i) =>
          i.product === productId ||
          i.product?._id === productId
      );
      if (item) {
        item.qty = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  cartLoading,
  setCartItems,
  setCartError,
  clearCart,
  updateQtyOptimistic,
} = cartSlice.actions;

export default cartSlice.reducer;
