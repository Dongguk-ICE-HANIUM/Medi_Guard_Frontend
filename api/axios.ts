import { deleteSecureStore, getSecureStore } from "@/utils/secureStore";
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
  const token = await getSecureStore("accessToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      await deleteSecureStore("accessToken");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
