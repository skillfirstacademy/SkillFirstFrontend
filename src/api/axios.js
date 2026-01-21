import axios from "axios";
import { showError } from "../Componnets/AppToaster";

const api = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

let logoutTimeout = null;
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

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

// Request interceptor - Add token to requests
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

// Response interceptor - Handle token refresh and device mismatch
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    const errorDetails = {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      url: error.config?.url
    };
    
    console.log("🔴 API Error Response:", errorDetails);

    // Handle 401 errors
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;
      
      console.log("⚠️ 401 Error - Code:", code);
      
      // ✅ Handle device mismatch - logout immediately
      if (code === "DEVICE_MISMATCH") {
        handleDeviceMismatchLogout();
        return Promise.reject(error);
      }
      
      // ✅ Handle token expiration - try to refresh
      if (code === "TOKEN_EXPIRED" && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          console.log("⏳ Request queued - waiting for token refresh");
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.log("❌ No refresh token - redirecting to login");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          console.log("🔄 Attempting to refresh access token");
          
          // Use base axios instance without interceptors for refresh
          const response = await axios.post(
            "http://localhost:5000/api/users/refresh-token",
            { refreshToken }
          );

          const newAccessToken = response.data.accessToken;
          
          console.log("✅ Token refreshed successfully");
          
          // Store new access token
          localStorage.setItem("accessToken", newAccessToken);
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // Process all queued requests with new token
          processQueue(null, newAccessToken);
          
          isRefreshing = false;
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          console.log("❌ Token refresh failed:", refreshError.response?.data);
          
          processQueue(refreshError, null);
          isRefreshing = false;
          
          // Check if refresh failed due to device mismatch
          if (refreshError.response?.data?.code === "DEVICE_MISMATCH") {
            handleDeviceMismatchLogout();
          } else if (refreshError.response?.data?.code === "REFRESH_TOKEN_EXPIRED") {
            // Refresh token expired - need to login again
            showError("Session expired - please login again");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          } else {
            // Other refresh errors
            showError("Authentication failed - please login again");
            localStorage.clear();
            
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
          
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;