import axios from "axios";

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",

  headers: {
    "Content-Type": "application/json", // Explicitly setting content type
  },
  withCredentials: true,
});

// Intercept requests to add the Authorization header dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, attach it to the request header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
