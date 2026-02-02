import axios from "axios";

export const startLoader = () =>
  window.dispatchEvent(new Event("start-loading"));

export const stopLoader = () =>
  window.dispatchEvent(new Event("stop-loading"));

const api = axios.create({
  baseURL:  `${import.meta.env.VITE_API_BASE_URL}`,
});

// 🔹 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    startLoader();

    // ✅ Attach token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    stopLoader();
    return Promise.reject(error);
  }
);

// 🔹 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    stopLoader();
    return response;
  },
  (error) => {
    stopLoader();

    // Optional: auto logout if token invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // window.location.href = "/login"; // optional redirect
    }

    return Promise.reject(error);
  }
);

export default api;
