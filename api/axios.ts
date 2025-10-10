import { deleteSecureStore } from "@/utils/secureStore";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
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
  const token = process.env.EXPO_PUBLIC_TEST_TOKEN;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.log("Error Details:", {
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
