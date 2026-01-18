import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../api/axios";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/contact", form);
      toast.success(res.data.message || "Message sent successfully");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CONTACT INFO */}
      <section className="contact-section mt-5">
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            className="section-title"
            style={{ marginTop: "100px", fontWeight: "700" }}
          >
            Keep In Touch With Us
          </h2>

          <p className="section-subtitle">
            Be the first to know about new skincare launches, exclusive offers,
            and expert beauty tips for radiant skin.
          </p>

          <div className="row contact-boxes">
            <div className="contact-col">
              <div className="contact-box bg-transparent border-0">
                <i className="ri-map-pin-line icon"></i>
                <h5>Address</h5>
                <p>Rendom IT Solutions, 2nd Floor, Siddharth complex,</p>
                <p className="mb-4">
                  Ussur, Bangalore, India – 98801
                </p>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                >
                  Get Direction
                </a>
              </div>
            </div>

            <div className="contact-col">
              <div className="contact-box bg-transparent border-0">
                <i className="ri-phone-line icon"></i>
                <h5>Contact</h5>
                <p>
                  <strong>Mobile:</strong> +91 65748 77836
                </p>
                <p>
                  <strong>Hotline:</strong> +1800 123 0943
                </p>
                <p>
                  <strong>E-mail:</strong> SupportGlow@gmail.com
                </p>
              </div>
            </div>

            <div className="contact-col">
              <div className="contact-box bg-transparent border-0">
                <i className="ri-time-line icon"></i>
                <h5>
                  <strong>Mon - Fri</strong> 08:30 - 20:00
                </h5>
                <p>
                  <strong>Sat - Sun:</strong> 09:30 - 21:30
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="map-section container">
        <iframe
          title="Our Location"
          className="map rounded"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089943376!2d77.46612593299314!3d12.953945614011557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1764528589402!5m2!1sen!2sin"
          allowFullScreen
        ></iframe>
      </section>

      {/* CONTACT FORM */}
      <section className="message-section">
        <h2 className="form-title">Send A Message</h2>

        <form className="contact-form" onSubmit={submitHandler}>
          <div className="row">
            <input
              type="text"
              placeholder="Name"
              className="input"
              name="name"
              value={form.name}
              onChange={changeHandler}
            />

            <input
              type="email"
              placeholder="Email"
              className="input"
              name="email"
              value={form.email}
              onChange={changeHandler}
            />
          </div>

          <div className="row">
            <textarea
              placeholder="Message"
              className="textarea"
              name="message"
              value={form.message}
              onChange={changeHandler}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn px-5"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </section>

      <ToastContainer position="top-right" autoClose={800} theme="colored" />
    </>
  );
}

export default Contact;
