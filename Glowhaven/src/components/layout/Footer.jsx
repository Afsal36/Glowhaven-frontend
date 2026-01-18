// src/components/Layout/Footer.jsx

import React from "react";
import { Link, useNavigate } from "react-router";

import payment1 from "../../assets/payment-1.svg";
import payment2 from "../../assets/payment-2.svg";
import payment3 from "../../assets/payment-3.svg";
import payment4 from "../../assets/payment-4.svg";
import payment5 from "../../assets/payment-5.svg";
import payment6 from "../../assets/payment-6.svg";

function Footer() {
  const navigate = useNavigate();

  // 🔐 check token before navigation
  const protectedLink = (e, path) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault(); // stop Link default behaviour
      navigate("/login");
    }
  };

  return (
    <>
      <footer className="footer mt-5 py-5">
        <div className="container">
          <div className="row gy-5">
            {/* -------- LEFT SECTION -------- */}
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-4">
                  <h3 className="mb-3">Company</h3>
                  <p className="mb-0">Find a location nearest to you.</p>
                  <p className="mb-4">
                    See <strong><Link to="/contact">Our Stores</Link></strong>
                  </p>
                  <p className="mb-0">
                    <strong>+91 9876543210</strong>
                  </p>
                  <p>support@glowheaven.com</p>
                </div>

                <div className="col-md-4">
                  <h3 className="mb-3">Useful Links</h3>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/shop" onClick={(e) => protectedLink(e, "/shop")} className="text-decoration-none">
                        New Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop" onClick={(e) => protectedLink(e, "/shop")} className="text-decoration-none">
                        Best Sellers
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop" onClick={(e) => protectedLink(e, "/shop")} className="text-decoration-none">
                        Bundle & Save
                      </Link>
                    </li>
                    <li>
                      <Link to="/cart" onClick={(e) => protectedLink(e, "/cart")} className="text-decoration-none">
                        Gift Cards
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <h3 className="mb-3">Information</h3>
                  <ul className="list-unstyled">
                    {/* 🔐 PROTECTED */}
                    <li>
                      <Link to="/myorders" onClick={(e) => protectedLink(e, "/myorders")} className="text-decoration-none">
                        My Orders
                      </Link>
                    </li>

                    {/* ✅ PUBLIC */}
                    <li><Link to="/contact" className="text-decoration-none">Contact Us</Link></li>
                    <li><Link to="/shipping-policy" className="text-decoration-none">Shipping FAQ</Link></li>
                    <li><Link to="/terms" className="text-decoration-none">Terms & Conditions</Link></li>
                    <li><Link to="/privacy" className="text-decoration-none">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* -------- RIGHT SECTION -------- */}
            <div className="col-lg-4">
              <h3 className="mb-4">Get Updates</h3>
              <p className="mb-4">
                Enter your email to know about new products and collections first.
              </p>
              <div className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
                <button className="btn">Subscribe</button>
              </div>
            </div>
          </div>

          {/* -------- BOTTOM ROW -------- */}
          <div className="footer-bottom mt-5">
            <div className="row align-items-center text-center text-lg-start">
              <div className="col-lg-4 mb-3 mb-lg-0">
                <p className="mb-0">
                  © {new Date().getFullYear()} <strong>Glow Heaven</strong> | All Rights Reserved
                </p>
              </div>

              <div className="col-lg-4 text-center">
                <h2 className="fw-bold m-0" style={{ letterSpacing: "2px" }}>
                  GLOW HEAVEN
                </h2>
              </div>

              <div className="col-lg-4 d-flex gap-2 justify-content-center justify-content-lg-end mt-3 mt-lg-0">
                {[payment1, payment2, payment3, payment4, payment5, payment6].map(
                  (img, i) => (
                    <img key={i} src={img} alt="" style={{ height: "25px" }} />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
