// src/pages/admin/AddProduct.jsx
import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router"; // ✔ FIXED
import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  // ✔ CORRECT GUARD
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    tag: "New",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);
    if (secondImage) data.append("secondImage", secondImage);

    try {
      await api.post("/admin/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("🎉 Product Added Successfully!");
      navigate("/admin/products"); // ✔ correct
    } catch (err) {
      alert(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="add-product-container">
        <h2 className="add-product-title">➕ Add New Product</h2>

        <form onSubmit={handleSubmit} className="add-product-form">
          <input type="text" name="name" placeholder="Product Name" className="form-control" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" className="form-control" onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" className="form-control" onChange={handleChange} required />
          <input type="number" name="oldPrice" placeholder="Old Price (Optional)" className="form-control" onChange={handleChange} />
          <select name="tag" className="form-control" onChange={handleChange}>
            <option>New</option><option>Sale</option><option>Hot</option>
          </select>
          <input type="number" name="stock" placeholder="Stock" className="form-control" onChange={handleChange} />

          <label>Main Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

          <label>Second Image</label>
          <input type="file" className="form-control mb-3" accept="image/*" onChange={(e) => setSecondImage(e.target.files[0])} />

          <button className="add-product-btn" disabled={loading}>
            {loading ? "Uploading..." : "Add Product 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
