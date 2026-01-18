import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= PLACE ORDER ================= */

export const placeOrder = (orderData) => async (dispatch) => {
  dispatch(startLoading());

  try {
    // 🔥 interceptor will attach token automatically
    const res = await api.post("/orders", orderData);

    dispatch(orderSuccess(res.data.order));

    return {
      success: true,
      order: res.data.order,
    };
  } catch (err) {
    const message =
      err.response?.data?.message || "Order failed. Try again.";

    dispatch(orderError(message));
    return { success: false, message };
  }
};

/* ================= FETCH MY ORDERS ================= */

export const fetchOrders = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await api.get("/orders/my"); // 🔥 FIX
    dispatch(setOrders(res.data));
  } catch (err) {
    dispatch(orderError("Failed to fetch orders"));
  }
};


/* ================= SLICE ================= */

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    orderSuccess: (state, action) => {
      state.loading = false;
      state.orders.unshift(action.payload); // newest first
    },

    setOrders: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },

    orderError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  orderSuccess,
  setOrders,
  orderError,
} = orderSlice.actions;

export default orderSlice.reducer;
