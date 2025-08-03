import axios, { isAxiosError } from "axios";

import {
  kakaoLoginResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/types/social";

export const submitSocialLoginReal = async (
  userId: string,
  data: SocialLoginRequest,
  bearerToken: string
): Promise<SocialLoginResponse> => {
  try {
    const response = await axios.post(`/api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    const responseData: SocialLoginResponse = response.data;
    if (responseData.errorCode !== null) throw new Error(responseData.message);

    return responseData;
  } catch (error: any) {
    if (isAxiosError(error)) {
      if (error.response) {
        const errorData = error.response.data;
        return {
          errorCode: errorData?.errorCode || "SERVER_ERRPR",
          message: errorData?.message || `서버 에러: ${error.response.status}`,
          result: null,
        };
      } else if (error.request) {
        return {
          errorCode: "NETWORK_ERROR",
          message: "네트워크 연결을 확인해주세요",
          result: null,
        };
      } else {
        return {
          errorCode: "REQUEST_ERROR",
          message: "요청 중 오류가 발생했습니다",
          result: null,
        };
      }
    } else {
      return {
        errorCode: "UNKNOWN_ERROR",
        message: error.message || "알 수 없는 오류",
        result: null,
      };
    }
  }
};

export const submitSocialLogin = async (
  userId: string,
  data: SocialLoginRequest,
  bearerToken: string
): Promise<SocialLoginResponse> => {
  console.log("Mock API 호출:", { userId, data, bearerToken });

  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock 성공 응답
  return {
    errorCode: null,
    message: "OK",
    result: {
      accessToken: "mock_access_token_1234567890",
      refreshToken: "mock_refresh_token_0987654321",
    },
  };
};

export const kakaoSocialLoginReal = async (
  kakaoAccessToken: string
): Promise<kakaoLoginResponse> => {
  try {
    const response = await axios.post("/api/auth/kakao/login", {
      accessToken: kakaoAccessToken,
    });

    const responseData: kakaoLoginResponse = response.data;
    if (responseData.errorCode !== null) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error: any) {
    if (isAxiosError(error)) {
      if (error.response) {
        // 서버에서 응답은 받았지만 에러상태 (400, 500)
        const errorData = error.response.data;
        return {
          errorCode: errorData?.errorCode || "SERVER_ERROR",
          message: errorData?.message || `서버 에러: ${error.response.status}`,
          result: {},
        };
      } else if (error.request) {
        // 네트워크 오류
        return {
          errorCode: "NETWORK_ERROR",
          message: "네트워크 연결을 확인해주세요",
          result: {},
        };
      } else {
        // 요청 설정 오류
        return {
          errorCode: "REQUEST_ERROR",
          message: "요청 중 오류가 발생했습니다",
          result: {},
        };
      }
    } else {
      return {
        errorCode: "UNKNOWN_ERROR",
        message: error.message || "알 수 없는 오류",
        result: {},
      };
    }
  }
};

export const kakaoSocialLogin = async (
  kakaoAccessToken: string
): Promise<kakaoLoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    errorCode: null,
    message: "OK",
    result: {
      accessToken: "kakaoSocialLogin_access_token",
      refreshToken: "kakaoSocialLogin_refresh_token",
      isNewUser: true,
    },
  };
};
