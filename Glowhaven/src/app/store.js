import { configureStore } from "@reduxjs/toolkit";

/* AUTH */
import authReducer from "../features/auth/authSlice";

/* USER PRODUCTS */
import productReducer from "../features/products/productSlice";

/* CART */
import cartReducer from "../features/cart/cartSlice";

/* WISHLIST */
import wishlistReducer from "../features/wishlist/wishlistSlice";

/* USER ORDERS */
import orderReducer from "../features/orders/orderSlice";

/* ADMIN */
import adminProductReducer from "../features/admin/adminProductSlice";
import adminOrderReducer from "../features/admin/adminOrderSlice";

 export const store = configureStore({
  reducer: {
    auth: authReducer,

    /* USER */
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,

    /* ADMIN */
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});


