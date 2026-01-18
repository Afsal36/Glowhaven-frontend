import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import "./Dashboard.css";

function Dashboard() {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // 🔒 Admin Guard
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    todayOrders: 0,
    thisMonthOrders: 0,
    thisMonthRevenue: 0,
    lowStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadDashboard();
  }, [token]);

  if (loading) {
    return (
      <div className="admin-dashboard-layout">
        <AdminSidebar />
        <div className="dashboard-content">
          <p className="loading">⏳ Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar />

      <div className="dashboard-content">
        <h2 className="dashboard-heading">Admin Dashboard</h2>

        <div className="dashboard-cards">
          <StatsCard title="📦 Total Products" count={stats.totalProducts} />
          <StatsCard title="🚚 Total Orders" count={stats.totalOrders} />
          <StatsCard title="👤 Total Users" count={stats.totalUsers} />
          <StatsCard
            title="💰 This Month Revenue"
            count={`₹${stats.thisMonthRevenue}`}
          />
          <StatsCard title="🆕 Today Orders" count={stats.todayOrders} />

          {/* ✅ LOW STOCK – CLICKABLE */}
          <StatsCard
            title="⚠️ Low Stock Products"
            count={stats.lowStockProducts}
            onClick={() =>
              navigate("/admin/products?lowStock=true")
            }
          />
        </div>

        <div className="dashboard-summary">
          <p>
            📈 Orders This Month:{" "}
            <strong>{stats.thisMonthOrders}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

const StatsCard = ({ title, count, onClick }) => (
  <div
    className="dashboard-card"
    style={{ cursor: onClick ? "pointer" : "default" }}
    onClick={onClick}
  >
    <h5>{title}</h5>
    <h2>{count}</h2>
  </div>
);

export default Dashboard;
