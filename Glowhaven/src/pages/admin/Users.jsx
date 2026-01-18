// src/pages/admin/Users.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router"; // ✔ FIXED
import AdminSidebar from "./AdminSidebar";
import "./User.css";

function Users() {
  const { token, user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✔ ADMIN CHECK
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` }, // ✔ FIXED
      });
      setUsers(res.data);
    } catch {
      alert("⚠️ Unauthorized or backend issue");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, data) => {
    try {
      await api.put(`/admin/users/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }, // ✔ FIXED
      });

      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...data } : u)));
    } catch {
      alert("❌ Update failed");
    }
  };

  useEffect(() => {
    if (token) loadUsers();
  }, [token]);

  if (loading) return <p className="text-center mt-5">⏳ Loading users...</p>;

  return (
    <div className="users-layout">
      <AdminSidebar />
      <div className="users-content">
        <h2 className="users-heading">👤 Manage Users</h2>

        <table className="users-table">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name || "-"}</td>
                <td>{u.email}</td>
                <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                <td><span className={`status-badge ${u.isBlocked ? "blocked" : "active"}`}>{u.isBlocked ? "Blocked" : "Active"}</span></td>
                <td>
                  <button className="action-btn block-btn"
                    onClick={() => updateUser(u._id, { isBlocked: !u.isBlocked })}>
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>

                  {u.role !== "admin" && (
                    <button className="action-btn make-admin-btn"
                      onClick={() => updateUser(u._id, { role: "admin" })}>
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Users;
