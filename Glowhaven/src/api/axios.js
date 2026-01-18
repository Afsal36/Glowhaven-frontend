import axios from "axios";

const api = axios.create({
  baseURL: "https://glowhavena.onrender.com/api"
});

// 🔐 Attach token automatically (PRO WAY)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ ONLY THIS

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;