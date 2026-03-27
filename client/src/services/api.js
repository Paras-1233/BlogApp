import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const token = user?.token;

  console.log("SENDING TOKEN:", token);
// 🔐 Attach token
API.interceptors.request.use(
  (req) => {
    try {
      let token = localStorage.getItem("token");

      // fallback (if stored inside user object)
      if (!token) {
        const user = JSON.parse(localStorage.getItem("user"));
        token = user?.token;
      }

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Token error:", error.message);
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle response errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - logging out");

      // clear auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // optional redirect
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;