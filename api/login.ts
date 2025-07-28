// Mock API

import { LoginResponse } from "@/types/api";
import { LoginFormValues } from "@/types/auth";
import { deleteSecureStore, saveSecureStore } from "@/utils/secureStore";
import axios from "axios";

export const loginApi = async (
  loginData: LoginFormValues
): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Mock 로그인 데이터: ", loginData);

  return {
    errorCode: null,
    message: "OK",
    result: {
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
    },
  };
};

export const loginApiReal = async (
  loginData: LoginFormValues
): Promise<LoginResponse> => {
  try {
    const response = await axios.post("http://api/user", loginData);
    // axios 요청이 성공하면 이 부분 실행
    const data: LoginResponse = response.data;

    return data;
  } catch (error: any) {
    // axios 요청이 실패하면 이 부분 실행
    if (error.response) {
      const errorData = error.response.data;
      throw new Error(errorData.message || "로그인 실패");
    }
    throw error;
  }
};

export const login = async (loginData: LoginFormValues) => {
  try {
    const response: LoginResponse = await loginApi(loginData);

    await saveSecureStore("accessToken", response.result!.accessToken);
    await saveSecureStore("refreshToken", response.result!.refreshToken);

    // 로그인 함수의 목적은 토큰 정보를 얻는 것이기 때문...
    return response.result ?? null;
  } catch (error) {
    await deleteSecureStore("accessToken");
    await deleteSecureStore("refreshToken");
    throw error;
  }
};

export const logout = async () => {
  await deleteSecureStore("accessToken");
  await deleteSecureStore("refreshToken");
};
