import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../../features/products/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";

function Shop() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);

  // 🔍 READ SEARCH FROM URL
  const params = new URLSearchParams(location.search);
  const urlSearch = params.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [filterSortOption, setFilterSortOption] = useState("all");

  // ⏳ DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 📦 FETCH PRODUCTS
  useEffect(() => {
    dispatch(fetchProducts(debouncedSearch));
  }, [dispatch, debouncedSearch]);

  // 🔽 FILTER + SORT
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

  // 🔐 TOKEN CHECK
  const requireAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to continue");
      navigate("/login");
      return false;
    }
    return true;
  };

  // ❤️ WISHLIST
  const handleWishlist = (product) => {
    if (!requireAuth()) return;

    dispatch(addToWishlist(product._id));
    toast.success(`${product.name} added to wishlist ❤️`);
  };

  // 🛒 CART
  const handleCart = (product) => {
    if (!requireAuth()) return;

    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.info(`${product.name} added to cart 🛒`);
  };

  if (loading) {
    return <p className="text-center py-5">Loading products...</p>;
  }

  return (
    <>
      {/* BREADCRUMB */}
      <ol className="section-banner py-3 position-relative">
        <li className="position-relative">
          <Link to="/">Home</Link>
        </li>
        <li className="position-relative active">
          <span className="ps-5">Products</span>
        </li>
      </ol>

      <div className="shop-container">
        <div className="container">
          <h1 className="text-center py-4 fw-semibold">Products</h1>

          {/* SEARCH */}
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

          {/* NO RESULT */}
          {!loading && displayedProducts.length === 0 && (
            <p className="text-center text-muted">No products found</p>
          )}

          {/* PRODUCTS */}
          <div className="row">
            {displayedProducts.map((product) => (
              <div className="col-md-3 mb-4" key={product._id}>
                <div className="product-item text-center position-relative">
                  <div className="product-image w-100 position-relative overflow-hidden">
                    <img
                      src={product.image || "https://via.placeholder.com/300"}
                      className="img-fluid"
                      alt={product.name}
                    />
                    <img
                      src={
                        product.secondImage ||
                        product.image ||
                        "https://via.placeholder.com/300"
                      }
                      className="img-fluid hover-img"
                      alt={product.name}
                    />

                    <div className="product-icons gap-3">
                      <div
                        className="product-icon"
                        onClick={() => handleWishlist(product)}
                      >
                        <i className="bi bi-heart fs-5"></i>
                      </div>

                      <div
                        className="product-icon"
                        onClick={() => handleCart(product)}
                      >
                        <i className="bi bi-cart3 fs-5"></i>
                      </div>

                      <div
                        className="product-icon"
                        onClick={() =>
                          navigate(`/product/${product._id}`)
                        }
                      >
                        <i className="bi bi-eye fs-5"></i>
                      </div>
                    </div>

                    {product.tag && (
                      <span className="tag-badge text-white bg-success">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="text-decoration-none text-black"
                  >
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

      <ToastContainer
             position="top-right"
             autoClose={800}
             theme="colored"
           />
    </>
  );
}

export default Shop;
