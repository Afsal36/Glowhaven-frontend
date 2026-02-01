// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

// Store
import {store} from "./app/store";

// Main App
import App from "./App.jsx";

// Global Styles
import "./styles/global.css";
import './styles/cursor.css'
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/product.css";
import "./styles/checkout.css";
import "./styles/contact.css";
import "./styles/responsive.css";
import "./styles/footer.css";
import './styles/about.css'
import "./styles/productDetails.css";
import './styles/cart.css'
import "./styles/orderDetails.css"
import './styles/profile.css'





// Bootstrap + Icons (if used)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
