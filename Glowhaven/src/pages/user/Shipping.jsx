// src/pages/Shipping.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import { toast } from "react-toastify";


function Shipping() {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();

  // 🔐 AUTH TOKEN
  const token = useSelector((state) => state.auth.user.token);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================
  // FETCH ORDER DETAILS
  // ========================
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  // ========================
  // CANCEL ORDER
  // ========================
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(
        `/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order cancelled successfully");
      navigate("/shop");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to cancel order");
    }
  };

  // ========================
  // LOADING / ERROR
  // ========================
  if (loading) {
    return <p className="text-center mt-5">Loading order...</p>;
  }

  if (!order || !order.items || order.items.length === 0) {
    return <p className="text-center mt-5">Order not found</p>;
  }

  // ========================
  // DATA
  // ========================
  const product = order.items[0];

  const canCancel =
    order.status === "pending" || order.status === "processing";

  // ========================
  // UI
  // ========================
  return (
    <div className="container mt-5 pt-5">
      <h3 className="text-center mb-4">🚚 Shipping Details</h3>

      {/* PRODUCT */}
      <div className="card mb-4 p-3 shadow-sm">
        <div className="d-flex gap-3 align-items-center">
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            style={{ width: 90, height: 90, objectFit: "cover" }}
          />
          <div>
            <h6 className="mb-1">{product.name}</h6>
            <p className="mb-0">Qty: {product.qty}</p>
            <strong>₹ {product.price * product.qty}</strong>
          </div>
        </div>
      </div>

      {/* STATUS */}
      <div className="card mb-4 p-3 shadow-sm">
        <h6>📦 Order Status</h6>
        <p className="fw-semibold text-capitalize mt-2">
          Status:{" "}
          <span
            className={
              order.status === "cancelled"
                ? "text-danger"
                : "text-success"
            }
          >
            {order.status}
          </span>
        </p>
      </div>

      {/* ADDRESS */}
      <div className="card mb-4 p-3 shadow-sm">
        <h6>🏠 Shipping Address</h6>
        <p className="mb-1">{order.shippingAddress.name}</p>
        <p className="mb-1">{order.shippingAddress.phone}</p>
        <p className="mb-1">
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </p>
        <p className="mb-0">
          Pincode: {order.shippingAddress.pincode}
        </p>
      </div>

      {/* CANCEL BUTTON */}
    {/* CANCEL + SHOP BUTTONS */}
{canCancel && (
  <>
    <button
      className="btn btn-danger w-100 mb-2"
      onClick={handleCancelOrder}
    >
      ❌ Cancel Order
    </button>

    <button
      className="btn btn-dark w-100"
      onClick={() => navigate("/shop")}
    >
      🛍 Continue Shopping
    </button>
  </>
)}

    </div>
  );
}

export default Shipping;
