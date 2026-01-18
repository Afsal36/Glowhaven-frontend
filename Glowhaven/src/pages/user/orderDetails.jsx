// src/pages/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // FETCH ORDER BY ID
  // ========================
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <h3 className="text-center py-5">
        ⏳ Loading Order Details...
      </h3>
    );
  }

  if (!order) {
    return (
      <h3 className="text-center py-5 text-danger">
        ❌ Order not found
      </h3>
    );
  }

  // ========================
  // CANCEL CONDITION
  // ========================
  const canCancel =
    order.status === "pending" || order.status === "processing";

  // ========================
  // CANCEL ORDER
  // ========================
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled successfully");

      // update UI instantly
      setOrder({ ...order, status: "cancelled" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to cancel order"
      );
    }
  };

  // ========================
  // TRACKING STEPS
  // ========================
  const steps =
    order.status === "cancelled"
      ? ["pending", "cancelled"]
      : ["pending", "packed", "shipped", "out-for-delivery", "delivered"];

  const currentIndex = steps.indexOf(order.status?.toLowerCase());

  // ========================
  // UI
  // ========================
  return (
    <div className="container py-5 mt-5">
      <div className="details-wrapper shadow rounded-4 p-4 bg-white">
        <h4 className="fw-bold">
          Order #{order._id?.slice(0, 10)}...
        </h4>
        <p className="text-muted">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>

        {/* ❌ CANCELLED MESSAGE */}
       {order.status === "cancelled" && (
  <div className="alert alert-danger mt-3">
    ❌ This order was cancelled by you on{" "}
    {new Date(order.cancelledAt).toLocaleDateString()}.
    <br />
    If payment was made online, refund will be processed within 5–7 days.
  </div>
)}


        {/* 🚚 TRACKING */}
        <div className="tracking-bar my-4">
          {steps.map((step, index) => (
            <div className="step-item" key={step}>
              <div
                className={`circle ${
                  step === "cancelled"
                    ? "bg-danger"
                    : index <= currentIndex
                    ? "active"
                    : ""
                }`}
              ></div>

              <span
                className={`text-capitalize ${
                  index <= currentIndex ? "active-text" : ""
                }`}
              >
                {step.replace(/-/g, " ")}
              </span>
            </div>
          ))}
        </div>

        <hr />

        {/* 🛍 PRODUCTS */}
        <h5 className="fw-bold">Products in Order</h5>

        {order.items.map((item, i) => {
          const name = item.name || item.product?.name;
          const image =
            item.image || item.product?.image || "/placeholder.jpg";
          const price = item.price || item.product?.price;

          return (
            <div key={i} className="d-flex align-items-center my-3">
              <img
                src={image}
                alt={name}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
              <div className="ms-3 flex-grow-1">
                <strong>{name}</strong>
                <p className="text-muted small m-0">
                  Qty: {item.qty}
                </p>
              </div>
              <strong>₹{price * item.qty}</strong>
            </div>
          );
        })}

        <hr />

        {/* 📍 ADDRESS */}
        <h5 className="fw-bold">📍 Delivery Address</h5>
        <p>
          {order.shippingAddress?.address},{" "}
          {order.shippingAddress?.city}
          <br />
          Pincode: {order.shippingAddress?.pincode}
          <br />
          📞 {order.shippingAddress?.phone}
        </p>

        <hr />

        {/* 💳 PAYMENT */}
        <h5 className="fw-bold">💳 Payment Summary</h5>
        <div className="d-flex justify-content-between fw-bold mt-2">
          <span>Total Paid:</span>
          <span>
            ₹{order.totalAmount || order.subtotal}
          </span>
        </div>
        <p className="text-muted">
          Payment Mode: {order.paymentMethod}
        </p>

        <hr />

        {/* ❌ CANCEL BUTTON */}
        {canCancel && (
          <button
            className="btn btn-danger w-100 mb-2"
            onClick={handleCancelOrder}
          >
            ❌ Cancel Order
          </button>
        )}

        {/* 🛍 SHOP AGAIN */}
        {order.status === "cancelled" && (
          <Link to="/shop" className="btn btn-dark w-100 mb-2">
            🛍 Shop Again
          </Link>
        )}

        {/* SUPPORT */}
        <Link
          to="/contact"
          className="btn btn-outline-dark w-100"
        >
          ❓ Need Help / Support
        </Link>
      </div>
       <ToastContainer
        position="top-right"
        autoClose={800}
        theme="colored"
      />
    </div>
  );
}

export default OrderDetails;
