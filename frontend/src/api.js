import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

// Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
//here is the new line just for commit
// Global response interceptor to catch expired tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized, trigger modal
      window.dispatchEvent(new CustomEvent("tokenExpired"));
    }
    return Promise.reject(error);
  }
);

export default API;