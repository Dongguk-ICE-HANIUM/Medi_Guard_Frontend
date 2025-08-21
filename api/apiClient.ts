import { deleteSecureStore, getSecureStore } from "@/utils/secureStore";
import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: "http://mediguardlbtest-1434827029.ap-northeast-2.elb.amazonaws.com",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request 인터셉터: 자동으로 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getSecureStore("refreshToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Token 가져오기 오류: ", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 401에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await deleteSecureStore("refreshToken");
      } catch (e) {
        console.error("Token 삭제 오류:", e);
      }
      throw new Error("AUTH_EXPIRED");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
