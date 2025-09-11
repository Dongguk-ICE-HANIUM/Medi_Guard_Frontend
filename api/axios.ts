import { deleteSecureStore } from "@/utils/secureStore";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://mediguardlbtest-1434827029.ap-northeast-2.elb.amazonaws.com",
});

// 요청 전 SecureStore에서 토큰을 읽어 자동 부착
axiosInstance.interceptors.request.use(async (config) => {
  if (
    config.url?.includes("/api/auth/register") ||
    config.url?.includes("/api/auth/login")
  ) {
    return config;
  }
  // const token = await getSecureStore("accessToken");
  const token =
    "eyJKV1QiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1dWlkIjoiNGExMmM3NzQtMDViOC00NTY3LTkwYjItMTNmMTM4Y2Y1MjQ5Iiwicm9sZSI6IlBBVElFTlQiLCJpYXQiOjE3NTc1NTk3ODQsImV4cCI6MTc1NzY0NjE4NH0.Wl1qLYmLc-12lF6-_N7QV8fqqvBEquwngbOfqb_R-zoXNMRFuLADoCdgECD-SWYOpYyF4FIxbK0YlRoK-Qkxjw";
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log("Network Error Details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      },
    });

    const status = error?.response?.status;
    if (status === 401) {
      await deleteSecureStore("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
