import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../../features/products/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";

function Shop() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterSortOption, setFilterSortOption] = useState("all");

  // 🔥 Listen for URL changes from Navbar search
  useEffect(() => {
    const handleURLChange = () => {
      const params = new URLSearchParams(window.location.search);
      const urlSearch = params.get("search") || "";
      setSearch(urlSearch);
      setDebouncedSearch(urlSearch);
    };

    handleURLChange();
    window.addEventListener("popstate", handleURLChange);
    return () => window.removeEventListener("popstate", handleURLChange);
  }, []);

  // ⏳ Debounce typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // 📦 Fetch products
  useEffect(() => {
    dispatch(fetchProducts(debouncedSearch));
  }, [dispatch, debouncedSearch]);

  const handleFilterSort = () => {
    let filtered = [...products];

    if (filterSortOption === "new" || filterSortOption === "sale") {
      filtered = filtered.filter(
        (product) => product.tag?.toLowerCase() === filterSortOption
      );
    }

    if (filterSortOption === "low") filtered.sort((a, b) => a.price - b.price);
    if (filterSortOption === "high") filtered.sort((a, b) => b.price - a.price);

    return filtered;
  };

  const displayedProducts = handleFilterSort();

  const requireAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to continue");
      return false;
    }
    return true;
  };

  const handleWishlist = (product) => {
    if (!requireAuth()) return;
    dispatch(addToWishlist(product._id));
    toast.success(`${product.name} added to wishlist ❤️`);
  };

  const handleCart = (product) => {
    if (!requireAuth()) return;
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.info(`${product.name} added to cart 🛒`);
  };

  if (loading) return <p className="text-center py-5">Loading products...</p>;

  return (
    <>
      <div className="shop-container">
        <div className="container">
          <h1 className="text-center py-4 fw-semibold">Products</h1>

          {/* 🔍 SEARCH */}
          <div className="mb-4 d-flex justify-content-center">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER */}
          <div className="container my-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <strong className="text-muted">
              Showing {displayedProducts.length} product(s)
            </strong>

            <select
              className="form-select py-2 fs-6"
              style={{ minWidth: 200 }}
              value={filterSortOption}
              onChange={(e) => setFilterSortOption(e.target.value)}
            >
              <option value="all">All Products</option>
              <option value="new">New Products</option>
              <option value="sale">Sale Products</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {!loading && displayedProducts.length === 0 && (
            <p className="text-center text-muted">No products found</p>
          )}

          {/* PRODUCTS */}
          <div className="row">
            {displayedProducts.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <div className="product-item text-center position-relative">
                  <div className="product-image w-100 position-relative overflow-hidden">
                    <img src={product.image} className="img-fluid" alt={product.name} />

                    <div className="product-icons gap-3">
                      <div className="product-icon" onClick={() => handleWishlist(product)}>
                        <i className="bi bi-heart fs-5"></i>
                      </div>

                      <div className="product-icon" onClick={() => handleCart(product)}>
                        <i className="bi bi-cart3 fs-5"></i>
                      </div>
                    </div>
                  </div>

                  <Link to={`/product/${product._id}`} className="text-decoration-none text-black">
                    <div className="product-content pt-3">
                      <span className="price">₹ {product.price}</span>
                      <h3 className="title pt-1">{product.name}</h3>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={800} theme="colored" />
    </>
  );
}

export default Shop;
