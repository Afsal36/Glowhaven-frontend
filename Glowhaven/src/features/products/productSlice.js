import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= THUNKS (Manual Async) ================= */

// FETCH ALL PRODUCTS
// FETCH ALL PRODUCTS + SEARCH
export const fetchProducts = (search = "") => async (dispatch) => {
  // dispatch(startLoading());
  try {
    const { data } = await api.get(
      `/products?search=${search}`
    );
    dispatch(setProducts(data));
  } catch (err) {
    dispatch(
      setError(err.response?.data?.message || "Failed to fetch products")
    );
  }
};


// FETCH SINGLE PRODUCT
export const fetchSingleProduct = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const { data } = await api.get(`/products/${id}`);
    dispatch(setSingleProduct(data));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch product"));
  }
};



/* ================= SLICE ================= */

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
  },

  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProducts: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    setSingleProduct: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProduct: (state) => {
      state.product = null; // reset single product view
    },
  },
});

export const {
  startLoading,
  setProducts,
  setSingleProduct,
  setError,
  clearProduct,
} = productSlice.actions;

export default productSlice.reducer;
