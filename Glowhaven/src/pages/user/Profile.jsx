import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../api/userApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-5 text-muted">
        ⏳ Loading profile...
      </p>
    );

  return (
    <div className="container profile-page">
      {/* Page Title */}
      <h2 className="text-center profile-title">👤 My Account</h2>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 profile-card">
            {/* Header */}
            <div className="profile-header">
              <div className="profile-avatar">
                {profile.name?.charAt(0)}
              </div>

              <h5 className="profile-name">{profile.name}</h5>
              <p className="text-muted profile-email">
                {profile.email}
              </p>
            </div>

            {/* Body */}
            <div className="card-body px-4 py-4">
              <div className="profile-stat">
                <span className="text-muted">Total Orders</span>
                <span>{profile.totalOrders}</span>
              </div>

              <a
                href="/myorders"
                className="btn btn-dark w-100 profile-btn"
              >
                📦 View My Orders
              </a>
            </div>
          </div>
        </div>
      </div>
       <ToastContainer
        position="top-right"
        autoClose={800}
        theme="colored"
      />
    </div>
  );
}

export default Profile;
