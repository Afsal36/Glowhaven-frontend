import React, { useEffect } from "react";
import { Link } from "react-router"; // ✔ FIXED
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchWishlist,
  removeFromWishlist,
} from "../../features/wishlist/wishlistSlice";
import { addToCart } from "../../features/cart/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const { items: wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.error("Item removed from wishlist!");
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 })); // ✔ FIXED FORMAT
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <>
      {/* BREADCRUMB */}
      <ol className="section-banner py-3 position-relative">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li className="active">
          <Link to="/wishlist">Wishlist</Link>
        </li>
      </ol>

      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">❤️ Your Wishlist</h2>

        {wishlist.length === 0 ? (
          <div className="text-center">
            <p className="lead text-muted">Your Wishlist is Empty.</p>
            <Link to="/shop" className="btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="row row-cols-2 row-cols-md-4 g-3 g-md-4">
            {wishlist.map((item) => (
              <div className="col" key={item.product._id}>
                <div className="card h-100 shadow-sm border-0 position-relative">
                  {/* PRODUCT IMAGE */}
                  <div
                    className="position-relative overflow-hidden"
                    style={{ height: "180px", backgroundColor: "#f8f9fa" }}
                  >
                    <img
                      src={
                        item.product.images?.[0] ||
                        item.product.image ||
                        "/placeholder.png"
                      }
                      className="card-img-top h-100 object-fit-cover"
                      alt={item.product.name}
                    />

                    {item.product.tag && (
                      <span className="badge position-absolute top-0 end-0 m-2 bg-success">
                        {item.product.tag}
                      </span>
                    )}
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="card-body d-flex flex-column text-center">
                    <p className="card-text fs-5 fw-semibold text-dark">
                      ₹ {item.product.price}
                    </p>
                    <h5 className="card-title">{item.product.name}</h5>

                    <div className="mt-auto d-flex flex-column gap-2">
                      <button
                        className="btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleAddToCart(item.product)}
                      >
                        <FaShoppingCart size={14} /> Add
                      </button>

                      <button
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

       <ToastContainer
              position="top-right"
              autoClose={400}
              theme="colored"
            />
    </>
  );
}

export default Wishlist;
