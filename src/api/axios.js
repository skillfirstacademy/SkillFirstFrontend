import axios from "axios";
import { showError } from "../Componnets/AppToaster";

const api = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

let logoutTimeout = null;

const handleDeviceMismatchLogout = () => {
  // Clear any existing timeout
  if (logoutTimeout) {
    clearTimeout(logoutTimeout);
  }

  // Set a new timeout - only execute once even if called multiple times
  logoutTimeout = setTimeout(() => {
    console.log("🚨 DEVICE MISMATCH - Logging out");
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    showError("You've been logged out - logged in from another device");
    
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }, 100); // 100ms debounce
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorDetails = {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      url: error.config?.url
    };
    
    console.log("🔴 API Error Response:", errorDetails);

    if (error.response?.status === 401) {
      const code = error.response?.data?.code;
      
      console.log("⚠️ 401 Error - Code:", code);
      
      if (code === "DEVICE_MISMATCH") {
        handleDeviceMismatchLogout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;