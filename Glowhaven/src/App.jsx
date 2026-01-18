import { Routes, Route } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./features/cart/cartSlice";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";
// user pages
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Wishlist from "./pages/user/Wishlist";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MyOrders from "./pages/user/MyOrders";
import OrderDetails from "./pages/user/orderDetails";
import ProductDetails from "./pages/user/ProductDetails";

// admin pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import AddProduct from "./pages/admin/AddProduct";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";

// components
import Nav from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import AdminProducts from "./pages/admin/AdminProducts";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./pages/user/ScrollTop";
import EditProduct from "./pages/admin/EditProduct";
import Shipping from "./pages/user/Shipping";
import Profile from "./pages/user/Profile";
import ShippingPolicy from "./pages/static/ShippingPolicy";
import Terms from "./pages/static/Terms";
import Privacy from "./pages/static/Privacy";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);
  return (
    <>
    
      <Nav />
      <ScrollToTop />
      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* ---------- USER (LOGIN REQUIRED) ---------- */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shipping/:id"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-product/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={700}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Footer />
    </>
  );
}

export default App;
