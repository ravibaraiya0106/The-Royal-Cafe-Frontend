import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    const resData = error.response?.data;
    let backendMessage =
      resData?.message || error.message || "Something went wrong";

    if (
      resData?.errors &&
      Array.isArray(resData.errors) &&
      resData.errors.length > 0
    ) {
      backendMessage = resData.errors.join(", ");
    }

    return Promise.reject(new Error(backendMessage));
  },
);

export default API;
