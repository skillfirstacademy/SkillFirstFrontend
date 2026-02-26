import axios from "axios";
import { showError } from "../Componnets/AppToaster";

const api = axios.create({
  baseURL: "http://video-api.skillfirstacademy.com/api/users",
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


    // Handle 401 errors
    if (error.response?.status === 401) {
      const code = error.response?.data?.code;

      // ✅ Handle device mismatch - logout immediately
      if (code === "DEVICE_MISMATCH") {
        handleDeviceMismatchLogout();
        return Promise.reject(error);
      }

      // ✅ Handle token expiration - try to refresh
      if (code === "TOKEN_EXPIRED" && !originalRequest._retry) {

        if (isRefreshing) {
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
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        try {

          // Use base axios instance without interceptors for refresh
          const response = await axios.post(
            "http://video-api.skillfirstacademy.com/api/users/refresh-token",
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          const newAccessToken = response.data.accessToken;

          if (!newAccessToken) {
            throw new Error("No access token in refresh response");
          }

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
      } else if (code === "TOKEN_EXPIRED" && originalRequest._retry) {
        console.log("Token still expired after retry");
      }
    }

    return Promise.reject(error);
  }
);

export default api;