// src/pages/MyOrders.jsx
import React, { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../features/orders/orderSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-center py-5">
        ⏳ Loading your orders...
      </p>
    );
  }

  return (
    <>
      {/* BREADCRUMB */}
      <ol className="section-banner py-3">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li className="active">My Orders</li>
      </ol>

      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">
          📦 My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead text-muted">
              You haven't placed any orders yet.
            </p>
            <Link to="/shop" className="btn btn-dark">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded-4">
            <table className="table align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    {/* ORDER ID */}
                    <td>
                      <small className="text-muted">
                        {order._id.substring(0, 10)}...
                      </small>
                    </td>

                    {/* PRODUCTS */}
                    <td>
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-1"
                        >
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 6,
                              objectFit: "cover",
                            }}
                          />
                          <span className="ms-2 small">
                            {item.name} × {item.qty || 1}
                          </span>
                        </div>
                      ))}
                    </td>

                    {/* TOTAL */}
                    <td className="fw-semibold">
                      ₹{order.totalAmount}
                    </td>

                    {/* STATUS */}
                    <td>
                      <span
                        className={`badge ${
                          order.status === "pending"
                            ? "bg-warning text-dark"
                            : order.status === "processing"
                            ? "bg-primary"
                            : order.status === "shipped"
                            ? "bg-info"
                            : order.status === "delivered"
                            ? "bg-success"
                            : order.status === "cancelled"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {order.status === "cancelled"
                          ? "Cancelled ❌"
                          : order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="text-center">
                      {order.status === "cancelled" ? (
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          disabled
                        >
                          Cancelled
                        </button>
                      ) : (
                        <Link
                          to={`/order/${order._id}`}
                          className="btn btn-sm btn-outline-dark"
                        >
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
       <ToastContainer
        position="top-right"
        autoClose={800}
        theme="colored"
      />
    </>
  );
}

export default MyOrders;
