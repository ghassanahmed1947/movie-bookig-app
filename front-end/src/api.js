import axios from "axios";

// Vercel par frontend aur backend ek hi domain par hain, isliye sirf "/api".
// Apne computer par vite.config.js ka proxy "/api" ko localhost:5002 par bhej deta hai.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
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