import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import AdminSidebar from "./AdminSidebar";
import "./Orders.css";

function Orders() {
  const { token, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= ADMIN GUARD ================= */
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      alert(" Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(
        `/admin/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          " Failed to update order status"
      );
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  if (loading) {
    return <p className="text-center mt-5">⏳ Loading Orders...</p>;
  }

  return (
    <div className="orders-layout">
      <AdminSidebar />

      <div className="orders-content">
        <h2 className="orders-title">📦 Manage Orders</h2>

        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, i) => {
                const isUserCancelled =
                  order.status === "cancelled" &&
                  order.cancelledBy === "user";

                return (
                  <tr key={order._id}>
                    <td>{i + 1}</td>

                    <td>{order.user?.email || "Guest"}</td>

                    <td>₹{order.totalAmount}</td>

                    <td>
                      <span
                        className={`status-tag ${order.status}`}
                      >
                        {order.status}
                        {isUserCancelled && " (User)"}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        disabled={isUserCancelled}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {isUserCancelled && (
                        <small className="text-danger d-block mt-1">
                        Cancelled by customer
                        </small>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Orders;
