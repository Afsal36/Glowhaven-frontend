import React, { useEffect, useMemo } from "react";
import { Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartQty,
  removeFromCart,
  updateQtyOptimistic,
} from "../../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();

  // ✅ select ONLY items to avoid re-renders
  const cartItems = useSelector((state) => state.cart.items);

  /* ========================
     LOAD CART (ONCE)
  ======================== */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /* ========================
     UPDATE QUANTITY (INSTANT UI)
  ======================== */
  const updateQuantity = (productId, type, qty) => {
    if (!productId) return;

    const newQty = type === "increase" ? qty + 1 : qty - 1;
    if (newQty < 1) return;

    // 🚀 Optimistic UI update (NO DELAY)
    dispatch(updateQtyOptimistic({ productId, quantity: newQty }));

    // 🔁 Background API sync
    dispatch(updateCartQty({ productId, quantity: newQty }));
  };

  /* ========================
     REMOVE ITEM
  ======================== */
  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.error("Removed from cart");
  };

  /* ========================
     SUBTOTAL (MEMOIZED)
  ======================== */
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }, [cartItems]);

  return (
    <>
      <div className="container my-5 pt-5">
        <h2 className="text-center fw-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">Your cart is empty</p>
            <Link to="/shop" className="btn btn-dark mt-3">
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-lg-8">
              {cartItems.map((item) => {
                const productId =
                  typeof item.product === "object"
                    ? item.product._id
                    : item.product;

                return (
                  <div
                    key={productId}
                    className="card shadow-sm border-0 rounded-4 mb-3 p-3"
                  >
                    <div className="row align-items-center">
                      <div className="col-3">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name}
                          className="img-fluid rounded-3"
                          style={{
                            height: "100px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div className="col-9 d-flex flex-column flex-md-row justify-content-between">
                        <div>
                          <h5 className="fw-semibold">{item.name}</h5>
                          <p className="text-muted mb-1">
                            ₹ {item.price}
                          </p>
                          <strong>
                            ₹ {(item.price * item.qty).toFixed(2)}
                          </strong>
                        </div>

                        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                          <button
                            className="qty-btn"
                            disabled={item.qty === 1}
                            onClick={() =>
                              updateQuantity(
                                productId,
                                "decrease",
                                item.qty
                              )
                            }
                          >
                            −
                          </button>

                          <span className="fw-bold">
                            {item.qty}
                          </span>

                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(
                                productId,
                                "increase",
                                item.qty
                              )
                            }
                          >
                            +
                          </button>

                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => removeItem(productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              <div className="card border-0 shadow p-4 rounded-4">
                <h4 className="fw-bold mb-3">
                  Order Summary
                </h4>
                <hr />
                <p className="d-flex justify-content-between">
                  <span>Total Items:</span>
                  <strong>{cartItems.length}</strong>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <strong>
                    ₹ {subtotal.toFixed(2)}
                  </strong>
                </p>

                <Link
                  to="/checkout"
                  className="btn btn-dark w-100 mt-3"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={800} />
    </>
  );
}

export default Cart;
