import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import "./AdminSidebar.css"

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <aside className="admin-sidebar-container">
      <h4 className="admin-title">Admin Panel</h4>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className="admin-link">
          📊 Dashboard
        </NavLink>

        <NavLink to="/admin/add-product" className="admin-link">
          ➕ Add Product
        </NavLink>

        <NavLink to="/admin/products" className="admin-link">
          📦 All Products
        </NavLink>

        <NavLink to="/admin/orders" className="admin-link">
          🚚 Orders
        </NavLink>

        <NavLink to="/admin/users" className="admin-link">
          👤 Users
        </NavLink>
      </nav>

      <button className="admin-logout-btn" onClick={handleLogout}>
        🔒 Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
