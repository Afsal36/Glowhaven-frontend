// ⭐ Keep your same imports
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import aboutHero from "../../assets/banner-female-2.webp";
import aboutMission from "../../assets/discover-1.webp";
import aboutHead from "../../assets/about-head-shape.webp";

import client1 from "../../assets/brand-logo-1.png";
import client2 from "../../assets/brand-logo-2.png";
import client3 from "../../assets/brand-logo-3.png";
import client4 from "../../assets/brand-logo-4.png";
import client5 from "../../assets/brand-logo-5.png";
import client6 from "../../assets/brand-logo-6.png";

import team1 from "../../assets/team-1.webp";
import team2 from "../../assets/team-2.webp";
import team3 from "../../assets/team-3.webp";

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    description: "",
    mission: "",
  });

  useEffect(() => {
    api.get("/about")
      .then((res) => setAboutData(res.data))
      .catch((err) => console.log("About Fetch Error:", err));
  }, []);

  const clients = [client1, client2, client3, client4, client5, client6];
  const team = [
    { img: team1, name: "Slava Fedutik", role: "Founder • Creative Head" },
    { img: team2, name: "Jennifer C", role: "Founder • CEO" },
    { img: team3, name: "Andres", role: "Co-Founder" },
  ];

  return (
    <>
      {/* ⭐ HERO SECTION */}
      <section
        className="about-hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${aboutHero})`,
        }}
      >
        <div>
          <h1 className="about-title fw-bold">{aboutData?.title || "About Glowing Haven"}</h1>
          <p className="about-subtitle">Crafted with love, science & care for every skin type</p>
        </div>
      </section>


      {/* ⭐ INTRO */}
      <section className="container py-5 text-center">
        <img src={aboutHead} className="mb-3 fade-in" alt="Decor" />
        <h2 className="fw-bold display-6">A Journey Towards Healthy & Glowing Skin</h2>
        <p className="about-description mx-auto">
          {aboutData.description || "Premium skincare designed to nourish, renew & protect your skin with nature + science."}
        </p>
      </section>


      {/* ⭐ MISSION BLOCK */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <img src={aboutMission} className="about-img shadow-lg rounded-4" alt="Mission" />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold mb-3 display-6">Our Mission</h3>
            <p className="text-muted fs-5">
              {aboutData.mission || "To make skincare simple, effective & accessible for everyone — blending technology & clean ingredients for real, visible results."}
            </p>
          </div>
        </div>
      </section>


      {/* ⭐ BRAND SECTION */}
      <section className="brand-section text-center py-5">
        <h3 className="fw-bold display-6 mb-4">Trusted by Leading Brands</h3>
        <div className="container">
          <div className="row justify-content-center g-4">
            {clients.map((logo, i) => (
              <div key={i} className="col-6 col-sm-4 col-md-2 brand-logo-wrapper">
                <img src={logo} className="brand-logo" alt={"brand-"+i} />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ⭐ TEAM SECTION */}
      <section className="container text-center py-5">
        <h3 className="fw-bold display-6 mb-5">Meet Our Experts</h3>
        <div className="row justify-content-center">
          {team.map((t, i) => (
            <div className="col-md-4 mb-4 team-card" key={i}>
              <img src={t.img} alt={t.name} className="team-img" />
              <h5 className="fw-bold mt-3">{t.name}</h5>
              <p className="text-muted">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
        <ToastContainer
        position="top-right"
        autoClose={800}
        theme="colored"
      />
    </>
  );
};

export default About;
