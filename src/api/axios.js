import axios from "axios";
import { showError } from "../Componnets/AppToaster";

const api = axios.create({
  baseURL: "https://skillfirstbackend.onrender.com/api/users",
});

let logoutTimeout = null;
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  console.log(`📋 Processing ${failedQueue.length} queued requests`);
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
      console.log(`🔵 REQUEST [${config.method.toUpperCase()}] ${config.url} - Token attached`);
    } else {
      console.log(`⚠️ REQUEST [${config.method.toUpperCase()}] ${config.url} - No token found`);
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
    const user = JSON.parse(localStorage.getItem("user"));
    

    if (user?.isBlockedAll) {
      // localStorage.clear();
      window.location.href = "/out-of-service";
      return;
    }

    if (user?.isBlocked) {
      // localStorage.clear();
      window.location.href = "/blocked";
      return;
    }
    console.log(`✅ RESPONSE [${response.config.method.toUpperCase()}] ${response.config.url} - Success`);
    return response;
  },


  async (error) => {
    const originalRequest = error.config;

    const errorDetails = {
      status: error.response?.status,
      code: error.response?.data?.code,
      message: error.response?.data?.message,
      url: error.config?.url,
      retry: originalRequest._retry
    };

    console.log("🔴 API Error Response:", errorDetails);

    // Handle 401 errors
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;

      console.log("⚠️ 401 Error - Code:", code);
      console.log("🔍 Request already retried?", originalRequest._retry);
      console.log("🔍 Currently refreshing?", isRefreshing);

      // ✅ Handle device mismatch - logout immediately
      if (code === "DEVICE_MISMATCH") {
        console.log("❌ Device mismatch detected");
        handleDeviceMismatchLogout();
        return Promise.reject(error);
      }

      // ✅ Handle token expiration - try to refresh
      if (code === "TOKEN_EXPIRED" && !originalRequest._retry) {
        console.log("🔄 Token expired - attempting refresh flow");

        if (isRefreshing) {
          // If already refreshing, queue this request
          console.log("⏳ Already refreshing - queuing request");
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            console.log("✅ Retrying queued request with new token");
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => {
            console.log("❌ Queued request failed:", err);
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");

        console.log("🔍 Refresh token exists?", !!refreshToken);

        if (!refreshToken) {
          console.log("❌ No refresh token - redirecting to login");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {
          console.log("🔄 Attempting to refresh access token...");
          console.log("🔄 Calling: http://localhost:5000/api/users/refresh-token");

          // Use base axios instance without interceptors for refresh
          const response = await axios.post(
            "http://localhost:5000/api/users/refresh-token",
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          console.log("✅ Refresh response received:", response.data);

          const newAccessToken = response.data.accessToken;

          if (!newAccessToken) {
            console.log("❌ No access token in response!");
            throw new Error("No access token in refresh response");
          }

          console.log("✅ Token refreshed successfully");
          console.log("💾 Storing new access token");

          // Store new access token
          localStorage.setItem("accessToken", newAccessToken);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log("📋 Processing queued requests...");
          // Process all queued requests with new token
          processQueue(null, newAccessToken);

          isRefreshing = false;

          console.log("🔁 Retrying original request with new token");
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          console.log("❌ Token refresh failed:", {
            status: refreshError.response?.status,
            data: refreshError.response?.data,
            message: refreshError.message
          });

          processQueue(refreshError, null);
          isRefreshing = false;

          // Check if refresh failed due to device mismatch
          if (refreshError.response?.data?.code === "DEVICE_MISMATCH") {
            console.log("❌ Refresh failed - device mismatch");
            handleDeviceMismatchLogout();
          } else if (refreshError.response?.data?.code === "REFRESH_TOKEN_EXPIRED") {
            console.log("❌ Refresh token expired");
            // Refresh token expired - need to login again
            showError("Session expired - please login again");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          } else {
            console.log("❌ Refresh failed - other error");
            // Other refresh errors
            showError("Authentication failed - please login again");
            localStorage.clear();

            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }

          return Promise.reject(refreshError);
        }
      } else if (code === "TOKEN_EXPIRED" && originalRequest._retry) {
        console.log("❌ Token still expired after retry - giving up");
      }
    }

    return Promise.reject(error);
  }
);

export default api;