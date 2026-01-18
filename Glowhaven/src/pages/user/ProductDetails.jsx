// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api/axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // ⭐ Buy Now Navigation
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);

  // ⭐ Fetch product by ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        toast.error("❌ Product load failed");
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="product-details-container">
      <div className="container ">
        <div className="row align-items-center">
          {/* PRODUCT IMAGE */}
          {/* PRODUCT IMAGE */}
          <div className="col-md-6 text-center">
            <div className="product-details-image-box">
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="product-details-main"
              />

              {product.secondImage && (
                <img
                  src={product.secondImage}
                  alt={product.name}
                  className="product-details-hover"
                />
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div className="col-md-6">
            <h2 className="fw-bold">{product.name}</h2>
            <h3 className="text-danger">₹ {product.price}</h3>

            {product.oldPrice && (
              <p className="text-secondary text-decoration-line-through">
                ₹ {product.oldPrice}
              </p>
            )}

            <p className="mt-3">{product.description}</p>

            <p className="fw-semibold">
              Stock:{" "}
              {product.stock > 0 ? (
                <span className="text-success">Available</span>
              ) : (
                <span className="text-danger">Out of Stock</span>
              )}
            </p>

            {/* BUTTONS */}
            {/* BUTTONS */}
            <div className="d-flex gap-3 mt-4 flex-wrap">
              {/* 🛒 Add to Cart */}
              <button
                className="btn btn-dark"
                onClick={() => {
                  dispatch(addToCart({ productId: product._id, quantity: 1 }));
                  toast.success("Added to Cart 🛒");
                }}
              >
                🛒 Add to Cart
              </button>

              {/* ❤️ Wishlist */}
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  dispatch(addToWishlist(product._id));
                  toast.info("Added to Wishlist ❤️");
                }}
              >
                ❤️ Wishlist
              </button>

              {/* ⚡ Buy Now */}
              <button
                className={`btn ${
                  product.stock > 0 ? "btn-success" : "btn-secondary"
                }`}
                disabled={product.stock <= 0}
                onClick={() => {
                  if (product.stock <= 0) {
                    toast.info(
                      "🚫 This product is currently out of stock. It will be available again soon."
                    );
                    return;
                  }

                  navigate("/checkout", {
                    state: {
                      buyNow: true,
                      product,
                    },
                  });
                }}
              >
                {product.stock > 0 ? "⚡ Buy Now" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
       <ToastContainer
        position="top-right"
        autoClose={800}
        theme="colored"
      />
    </div>
  );
}

export default ProductDetails;
