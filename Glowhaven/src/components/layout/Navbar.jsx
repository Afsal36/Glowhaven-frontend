// src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { clearCart } from "../../features/cart/cartSlice";
import { clearWishlist } from "../../features/wishlist/wishlistSlice";

function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showDrop, setShowDrop] = useState(false);

  // 🔍 SEARCH
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  // 🔒 REFS
  const searchRef = useRef(null);
  const navRef = useRef(null);
  const togglerRef = useRef(null);

  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const user = useSelector((state) => state.auth.user);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + (item.qty || 1),
    0
  );
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    setShowDrop(false);
  };

  // 🔍 SEARCH SUBMIT
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/shop?search=${search}`);
    setSearch("");
    setShowSearch(false);

    // 🔥 CLOSE MOBILE NAV
    if (togglerRef.current && navRef.current.classList.contains("show")) {
      togglerRef.current.click();
    }
  };

  // 🖱️ CLICK OUTSIDE → CLOSE SEARCH
  useEffect(() => {
    const handleOutsideSearch = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideSearch);
    return () =>
      document.removeEventListener("mousedown", handleOutsideSearch);
  }, []);

  // 🖱️ CLICK OUTSIDE → CLOSE NAVBAR (TOGGLER)
  useEffect(() => {
    const handleOutsideNav = (e) => {
      if (
        navRef.current &&
        togglerRef.current &&
        !navRef.current.contains(e.target) &&
        !togglerRef.current.contains(e.target) &&
        navRef.current.classList.contains("show")
      ) {
        togglerRef.current.click(); // 🔥 CLOSE
      }
    };

    document.addEventListener("mousedown", handleOutsideNav);
    return () =>
      document.removeEventListener("mousedown", handleOutsideNav);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top py-3 glam-nav">
      {/* MOBILE LOGO */}
      <Link to="/" className="navbar-brand d-lg-none fw-bold glam-logo">
        GLOW HAVEN
      </Link>
       {/* 🔍 ❤️ 🛒 MOBILE ICONS – ALWAYS VISIBLE */}
<ul className="navbar-nav d-lg-none d-flex flex-row align-items-center gap-3 ms-auto me-2">

  {/* 🔍 SEARCH */}
  <li className="position-relative" ref={searchRef}>
    <button
      className="btn p-0 border-0 bg-transparent nav-icon"
      onClick={() => setShowSearch((p) => !p)}
    >
      <i className="bi bi-search"></i>
    </button>

    {showSearch && (
      <form
        onSubmit={handleSearchSubmit}
        className="position-absolute end-0 mt-2"
        style={{ width: 200, zIndex: 1000 }}
      >
        <input
          autoFocus
          type="text"
          className="form-control form-control-sm"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    )}
  </li>

  {/* ❤️ WISHLIST */}
  <li className="position-relative">
    <Link to="/wishlist" className="nav-icon">
      <i className="bi bi-heart"></i>
      {wishlistCount > 0 && (
        <span className="cart-count">{wishlistCount}</span>
      )}
    </Link>
  </li>

  {/* 🛒 CART */}
  <li className="position-relative">
    <Link to="/cart" className="nav-icon">
      <i className="bi bi-bag"></i>
      {cartCount > 0 && (
        <span className="cart-count">{cartCount}</span>
      )}
    </Link>
  </li>

</ul>

      <button
        ref={togglerRef}
        className="navbar-toggler shadow-none"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-between"
        id="mainNav"
        ref={navRef}
      >
        {/* LEFT */}
        <ul className="navbar-nav gap-4 nav-menu">
          <li><Link to="/" className="nav-link glam-link">Home</Link></li>
          <li><Link to="/shop" className="nav-link glam-link">Shop</Link></li>
          <li><Link to="/about" className="nav-link glam-link">About</Link></li>
          <li><Link to="/contact" className="nav-link glam-link">Contact</Link></li>

          {user?.role === "admin" && (
            <li>
              <Link to="/admin/dashboard" className="nav-link text-danger fw-semibold">
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        {/* CENTER LOGO */}
        <Link to="/" className="navbar-brand d-none d-lg-block fw-bold glam-logo">
          GLOW HAVEN
        </Link>

        {/* RIGHT */}
        <ul className="navbar-nav d-flex align-items-center gap-4">
          {/* 🔍 SEARCH */}
          <li className="position-relative" ref={searchRef}>
            <button
              className="btn p-0 border-0 bg-transparent nav-icon"
              onClick={() => setShowSearch((p) => !p)}
            >
              <i className="bi bi-search"></i>
            </button>

            {showSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className="position-absolute end-0 mt-2"
                style={{ width: 220, zIndex: 1000 }}
              >
                <input
                  autoFocus
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
            )}
          </li>

          {/* ❤️ Wishlist */}
          <li className="position-relative">
            <Link to="/wishlist" className="nav-icon">
              <i className="bi bi-heart"></i>
              {wishlistCount > 0 && (
                <span className="cart-count">{wishlistCount}</span>
              )}
            </Link>
          </li>

          {/* 🛒 Cart */}
          <li className="position-relative">
            <Link to="/cart" className="nav-icon">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </li>

          {/* 👤 USER */}
          <li className="nav-user-box">
            {user ? (
              <div
                className="user-dropdown"
                onClick={() => setShowDrop((p) => !p)}
              >
                <span className="user-btn">
                  Hi, {user.name?.split(" ")[0]}{" "}
                  <i className="bi bi-chevron-down"></i>
                </span>

                {showDrop && (
                  <div className="dropdown-box shadow-sm">
                    <Link to="/profile" onClick={() => setShowDrop(false)}>
                      👤 My Profile
                    </Link>

                    <Link to="/myorders" onClick={() => setShowDrop(false)}>
                      📦 My Orders
                    </Link>

                    <button onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-link glam-link">
                <i className="bi bi-person"></i> Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
