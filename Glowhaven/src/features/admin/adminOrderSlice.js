import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ===================== THUNKS (Manual Async) ===================== */

// GET ALL
export const fetchProducts = () => async (dispatch) => {
  dispatch(productsRequest());
  try {
    const { data } = await api.get("/products");
    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFailure(error.response?.data?.message || "Failed to fetch products"));
  }
};

// ADD PRODUCT
export const addProduct = (formData) => async (dispatch) => {
  dispatch(productsRequest());
  try {
    const { data } = await api.post("/admin/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(addProductSuccess(data.product));
  } catch (error) {
    dispatch(productsFailure(error.response?.data?.message || "Failed to add product"));
  }
};

// UPDATE PRODUCT
export const updateProduct = (id, formData) => async (dispatch) => {
  dispatch(productsRequest());
  try {
    const { data } = await api.put(`/admin/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateProductSuccess(data.product));
  } catch (error) {
    dispatch(productsFailure(error.response?.data?.message || "Failed to update product"));
  }
};

// DELETE PRODUCT
export const deleteProduct = (id) => async (dispatch) => {
  dispatch(productsRequest());
  try {
    await api.delete(`/admin/products/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (error) {
    dispatch(productsFailure(error.response?.data?.message || "Failed to delete product"));
  }
};




/* ===================== SLICE ===================== */

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    productsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    addProductSuccess: (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload);
    },
    updateProductSuccess: (state, action) => {
      state.loading = false;
      state.products = state.products.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    productsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
});

export const {
  productsRequest,
  productsSuccess,
  addProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
  productsFailure,
  clearProductError,
} = adminProductSlice.actions;

export default adminProductSlice.reducer;
