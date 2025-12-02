import axios from "axios";

const api = axios.create({
  baseURL: "mongodb+srv://Door2Go:Door2Go123@door2go.opetk5r.mongodb.net/?appName=Door2Go",
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
