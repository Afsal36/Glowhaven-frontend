import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= MANUAL THUNKS ================= */

// GET ALL PRODUCTS (ADMIN)
export const fetchAdminProducts = () => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    const token = getState().auth.token;
    const { data } = await api.get("/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setProducts(data));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch products"));
  }
};

// GET SINGLE PRODUCT
export const fetchAdminProduct = (id) => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    const token = getState().auth.token;
    const { data } = await api.get(`/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setSingleProduct(data));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch product"));
  }
};

// ADD PRODUCT
export const createAdminProduct = (formData) => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    const token = getState().auth.token;
    const { data } = await api.post("/admin/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(addProduct(data.product));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to add product"));
  }
};

// UPDATE PRODUCT
export const updateAdminProduct = (id, formData) => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    const token = getState().auth.token;
    const { data } = await api.put(`/admin/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(updateProductItem(data.product));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to update product"));
  }
};

// DELETE PRODUCT
export const deleteAdminProduct = (id) => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    const token = getState().auth.token;
    await api.delete(`/admin/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(removeProduct(id));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to delete product"));
  }
};



/* ================= SLICE ================= */

const adminProductSlice = createSlice({
  name: "adminProducts",
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
    addProduct: (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload);
    },
    updateProductItem: (state, action) => {
      state.loading = false;
      state.products = state.products.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
    removeProduct: (state, action) => {
      state.loading = false;
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setProducts,
  setSingleProduct,
  addProduct,
  updateProductItem,
  removeProduct,
  setError,
  clearProductError,
} = adminProductSlice.actions;

export default adminProductSlice.reducer;
