import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

import { fetchCart, clearCart } from "../../features/cart/cartSlice";
import { placeOrder } from "../../features/orders/orderSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isBuyNow = location.state?.buyNow;
  const buyNowProduct = location.state?.product;
  const { items: cartItems } = useSelector((state) => state.cart);
  const items = isBuyNow ? [buyNowProduct] : cartItems;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isBuyNow) dispatch(fetchCart());
  }, [dispatch, isBuyNow]);

  if (!items || items.length === 0) {
    return (
      <div className="container text-center mt-5 pt-5">
        <h2 className="fw-bold text-danger">🛍 No Items to Checkout</h2>
        <Link to="/shop" className="btn btn-dark mt-3">
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );
  const shipping = subtotal >= 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const validate = (field, value) => {
    let error = "";
    if (!value.trim()) error = "This field is required";
    if (field === "phone" && !/^\d{10}$/.test(value))
      error = "Phone must be 10 digits";
    if (field === "pincode" && !/^\d{6}$/.test(value))
      error = "Pincode must be 6 digits";
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validate(field, value);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate(field, form[field]);
  };

  const isInvalid =
    Object.values(form).some((v) => !v.trim()) ||
    Object.values(errors).some(Boolean);

  const placeFinalOrder = async () => {
    const normalizedItems = items.map((item) => ({
      product: item.product?._id || item.product || item._id,
      qty: item.qty || 1,
    }));

    const result = await dispatch(
      placeOrder({
        items: normalizedItems,
        shippingAddress: form,
        paymentMethod,
      })
    );

    if (result?.success) {
      toast.success("🎉 Order placed successfully!");
      if (!isBuyNow) dispatch(clearCart());
      navigate(`/shipping/${result.order._id}`);
    } else {
      toast.error(result?.message || "Order failed");
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const { data: order } = await api.post("/payment/order", {
        amount: total,
      });

      const razor = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Glow Haven",
        description: "Secure Payment",
        order_id: order.id,

        handler: async (response) => {
          const verify = await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verify.data.success) {
            await placeFinalOrder();
          } else {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        theme: { color: "#2874f0" },
      });

      razor.open();
    } catch (err) {
      console.error(err);
      toast.error("Online payment failed");
    }
  };

  const handleOrder = async () => {
    if (isInvalid) {
      toast.error("⚠️ Fix form errors");
      return;
    }

    setLoading(true);

    if (paymentMethod === "COD") {
      await placeFinalOrder();
    } else {
      await handleOnlinePayment();
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5 pt-5">
      <h3 className="fw-bold mb-4">Checkout</h3>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card p-4">
            <h5 className="fw-bold mb-3">Delivery Address</h5>

            {[
              ["name", "Name"],
              ["phone", "Phone"],
              ["city", "City"],
              ["address", "Address"],
              ["pincode", "Pincode"],
            ].map(([key, label]) => (
              <div className="mb-3" key={key}>
                <label className="form-label">
                  {label} <span className="text-danger">*</span>
                </label>
                <input
                  className={`form-control ${
                    touched[key] && errors[key] ? "is-invalid" : ""
                  }`}
                  value={form[key]}
                  maxLength={key === "phone" ? 10 : key === "pincode" ? 6 : undefined}
                  onChange={(e) =>
                    handleChange(
                      key,
                      ["phone", "pincode"].includes(key)
                        ? e.target.value.replace(/\D/g, "")
                        : e.target.value
                    )
                  }
                  onBlur={() => handleBlur(key)}
                />
                {touched[key] && errors[key] && (
                  <div className="invalid-feedback">{errors[key]}</div>
                )}
              </div>
            ))}
          </div>

          <div className="card p-4 mt-4">
            <h5 className="fw-bold mb-2">Payment Method</h5>

            <label className="d-flex gap-2 mt-2">
              <input
                type="radio"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="d-flex gap-2 mt-2">
              <input
                type="radio"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              UPI / Card / Netbanking
            </label>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>

            {items.map((item, i) => (
              <div key={i} className="d-flex justify-content-between mb-2">
                <span>{item.name}</span>
                <strong>₹{item.price * (item.qty || 1)}</strong>
              </div>
            ))}

            <hr />
            <p className="d-flex justify-content-between">
              <span>Total</span>
              <strong>₹{total}</strong>
            </p>

            <button
              className="btn btn-primary w-100 mt-3"
              disabled={loading || isInvalid}
              onClick={handleOrder}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "COD"
                ? "Place Order"
                : "Pay Now"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={800} theme="colored" />
    </div>
  );
}

export default Checkout;
