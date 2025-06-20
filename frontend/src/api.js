// frontend/src/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      try {
        const response = await axios.post("http://localhost:5000/token", {
          token: token,
        });
        const newToken = response.data.accessToken;
        localStorage.setItem("token", newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
