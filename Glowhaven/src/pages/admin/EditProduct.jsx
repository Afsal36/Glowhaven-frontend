import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../../api/axios";
import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import { toast } from "react-toastify";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    tag: "New",
  });

  const [image, setImage] = useState(null);
  const [secondImage, setSecondImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "admin")
    return <h2 className="text-danger mt-5 text-center">Access Denied ❌</h2>;

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          stock: res.data.stock,
          tag: res.data.tag || "New",
        });

      } catch {
        toast.error("❌ Product Load Failed");
      }
    };
    loadProduct();
  }, [id, token]);

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (image) data.append("image", image);
    if (secondImage) data.append("secondImage", secondImage);

    try {
      await api.put(`/admin/products/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✔ Product Updated Successfully!");
      navigate("/admin/products", { replace: true });

    } catch {
      toast.error("❌ Update Failed - Backend Check");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div style={{ marginLeft: 240, padding: 20, width: "100%" }}>
        <h2 className="fw-bold mb-4">✏ Edit Product</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" className="form-control mb-3" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

          <textarea className="form-control mb-3" value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

          <input type="number" className="form-control mb-3" value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />

          <input type="number" className="form-control mb-3" value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />

          <select className="form-control mb-3" value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}>
            <option>New</option><option>Hot</option><option>Sale</option>
          </select>

          <label>Main Image</label>
          <input type="file" className="form-control mb-3"
            onChange={(e) => setImage(e.target.files[0])} />

          <label>Second Image</label>
          <input type="file" className="form-control mb-4"
            onChange={(e) => setSecondImage(e.target.files[0])} />

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Updating..." : "💾 Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
