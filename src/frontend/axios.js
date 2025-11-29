import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Auto-attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("d2g_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
