import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { clearCart } from "../../features/cart/cartSlice";
import { clearWishlist } from "../../features/wishlist/wishlistSlice";

function Nav() {
  const dispatch = useDispatch();

  const [showDrop, setShowDrop] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);
  const navRef = useRef(null);
  const togglerRef = useRef(null);

  const cartItems = useSelector((state) => state.cart?.items || []);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const user = useSelector((state) => state.auth.user);

  const cartCount = cartItems.reduce((a, i) => a + (i.qty || 1), 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    setShowDrop(false);
  };

  // 🔥 SEARCH WITHOUT RELOAD
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    window.history.pushState({}, "", `/shop?search=${search}`);
    window.dispatchEvent(new PopStateEvent("popstate"));

    setSearch("");
    setShowSearch(false);

    if (togglerRef.current && navRef.current.classList.contains("show")) {
      togglerRef.current.click();
    }
  };

  useEffect(() => {
    const handleOutsideSearch = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideSearch);
    return () => document.removeEventListener("mousedown", handleOutsideSearch);
  }, []);

  useEffect(() => {
    const handleOutsideNav = (e) => {
      if (
        navRef.current &&
        togglerRef.current &&
        !navRef.current.contains(e.target) &&
        !togglerRef.current.contains(e.target) &&
        navRef.current.classList.contains("show")
      ) {
        togglerRef.current.click();
      }
    };
    document.addEventListener("mousedown", handleOutsideNav);
    return () => document.removeEventListener("mousedown", handleOutsideNav);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top py-3 glam-nav">
      <Link to="/" className="navbar-brand d-lg-none fw-bold glam-logo">
        GLOW HAVEN
      </Link>

      <ul className="navbar-nav d-lg-none d-flex flex-row align-items-center gap-3 ms-auto me-2">
        <li className="position-relative" ref={searchRef}>
          <button className="btn p-0 border-0 bg-transparent nav-icon" onClick={() => setShowSearch(p => !p)}>
            <i className="bi bi-search"></i>
          </button>

          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="position-absolute end-0 mt-2" style={{ width: 200 }}>
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

        <li><Link to="/wishlist"><i className="bi bi-heart"></i> {wishlistCount}</Link></li>
        <li><Link to="/cart"><i className="bi bi-bag"></i> {cartCount}</Link></li>
      </ul>

      <button ref={togglerRef} className="navbar-toggler shadow-none" data-bs-toggle="collapse" data-bs-target="#mainNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse justify-content-between" id="mainNav" ref={navRef}>
        <ul className="navbar-nav gap-4 nav-menu">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/shop" className="nav-link">Shop</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>

        <Link to="/" className="navbar-brand d-none d-lg-block fw-bold glam-logo">
          GLOW HAVEN
        </Link>

        <ul className="navbar-nav d-flex align-items-center gap-4">
          <li className="position-relative" ref={searchRef}>
            <button className="btn p-0 border-0 bg-transparent nav-icon" onClick={() => setShowSearch(p => !p)}>
              <i className="bi bi-search"></i>
            </button>

            {showSearch && (
              <form onSubmit={handleSearchSubmit} className="position-absolute end-0 mt-2" style={{ width: 220 }}>
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

          <li><Link to="/wishlist"><i className="bi bi-heart"></i> {wishlistCount}</Link></li>
          <li><Link to="/cart"><i className="bi bi-bag"></i> {cartCount}</Link></li>

          <li>
            {user ? (
              <button onClick={handleLogout} className="btn btn-sm btn-outline-dark">Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
