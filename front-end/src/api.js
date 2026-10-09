import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api",
});

// Har request ke sath login token apne aap bhej dega (agar token maujood ho)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;