import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((req) => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const token = user?.token;

  console.log("SENDING TOKEN:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;