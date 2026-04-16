import axios from "axios";

// Use environment variable for flexibility
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

