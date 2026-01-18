import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import AdminSidebar from "../pages/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // ❌ Not Admin → Redirect
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <main style={{ marginLeft: "240px", padding: "20px", width: "100%", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
