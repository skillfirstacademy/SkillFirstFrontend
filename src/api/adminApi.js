import axios from "axios";
import { showError } from "../Componnets/AppToaster";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/",
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// REQUEST
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  Promise.reject
);

// RESPONSE (🔥 THIS WAS MISSING)
adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const code = error.response?.data?.code;
    const status = error.response?.status;

    if (
      status === 401 &&
      code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return adminApi(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(
          "http://localhost:5000/api/users/refresh-token",
          { refreshToken }
        );

        localStorage.setItem("accessToken", res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }

        processQueue(null, res.data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return adminApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        showError("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
