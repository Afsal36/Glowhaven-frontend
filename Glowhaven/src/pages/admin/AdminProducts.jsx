// src/pages/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router";
import AdminSidebar from "./AdminSidebar"; 
import "./AdminProducts.css";

function AdminProducts() {
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);

  // Redirect non-admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const loadProducts = async () => {
    try {
      const res = await api.get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      alert("⚠️ Products vannanilla, token or backend check cheyyu");
      console.log(err.response?.data);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("If you want to delete this product")) return;
    try {
      await api.delete(`/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("✔️ Product Deleted!");
    } catch (err) {
      alert("❌ Delete failed");
      console.log(err.response?.data);
    }
  };

  useEffect(() => {
    if (token) loadProducts();
  }, [token]);

  return (
    <div className="admin-products-layout">
      <AdminSidebar />

      <div className="admin-products-content">
        <div className="header-section">
          <h2>📦 All Products</h2>
          <Link to="/admin/add-product" className="btn-black">
            ➕ Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="no-products">❌ No products found</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>

                  {/* 🖼️ IMAGE DISPLAY FIX */}
                  <td>
                    <img
                      src={p.image || "https://via.placeholder.com/60"}
                      alt={p.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        background: "#eee"
                      }}
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>

                  <td className="actions">
                    <Link to={`/admin/edit-product/${p._id}`} className="edit-btn">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
