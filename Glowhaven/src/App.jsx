import { Routes, Route, useLocation } from "react-router";
import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./features/cart/cartSlice";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";

// 🔥 Lazy load pages (performance boost)
const Home = lazy(() => import("./pages/user/Home"));
const Shop = lazy(() => import("./pages/user/Shop"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Checkout = lazy(() => import("./pages/user/Checkout"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const MyOrders = lazy(() => import("./pages/user/MyOrders"));
const OrderDetails = lazy(() => import("./pages/user/orderDetails"));
const ProductDetails = lazy(() => import("./pages/user/ProductDetails"));
const About = lazy(() => import("./pages/user/About"));
const Contact = lazy(() => import("./pages/user/Contact"));
const Shipping = lazy(() => import("./pages/user/Shipping"));
const Profile = lazy(() => import("./pages/user/Profile"));
const ShippingPolicy = lazy(() => import("./pages/static/ShippingPolicy"));
const Terms = lazy(() => import("./pages/static/Terms"));
const Privacy = lazy(() => import("./pages/static/Privacy"));

// Admin
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Users = lazy(() => import("./pages/admin/Users"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));

// Components
import Nav from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Loader from "./components/Loader";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  // Route change loader
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  // Fetch cart & wishlist
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([dispatch(fetchCart()), dispatch(fetchWishlist())]).finally(
        () => setLoading(false)
      );
    }
  }, [dispatch, user]);

  return (
    <>
      <ScrollToTop />
      <Nav />

      {/* Global Loader */}
      <Loader visible={loading} />

      {/* Suspense for lazy pages */}
      <Suspense fallback={<Loader visible={true} />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* USER */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/shipping/:id" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
          <Route path="/myorders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute adminOnly><AddProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute adminOnly><Orders /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/edit-product/:id" element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
        </Routes>
      </Suspense>

      <ToastContainer position="top-right" autoClose={700} theme="colored" />
      <Footer />
    </>
  );
}

export default App;
