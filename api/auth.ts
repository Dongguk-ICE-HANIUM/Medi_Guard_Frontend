import {
  EmailCheckRequest,
  EmailCheckResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/api";
import { SignupFormValues } from "@/types/auth";
import axios from "axios";

const transformSignupData = (signupData: SignupFormValues): SignupRequest => {
  return {
    email: signupData.email,
    password: signupData.password,
    name: signupData.name,
    birthday: signupData.birthday,
    height: signupData.height,
    weight: signupData.weight,
    dueDate: signupData.dueDate,
    pregnant: signupData.pregnant,
    feeding: signupData.feeding,
    allergyList: signupData.allergy
      ? signupData.allergy.map((item: any) => item.name)
      : [],
    diseaseList: signupData.disease
      ? signupData.disease.map((item: any) => item.id.toString())
      : [],
  };
};

// Mock API
export const signupApi = async (
  signupData: SignupFormValues
): Promise<SignupResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Mock 회원가입 데이터: ", transformSignupData(signupData));

  // 성공응답
  return {
    errorCode: null,
    message: "OK",
    result: {
      accessToken: "mock_access_token_" + Date.now(),
      refreshToken: "mock_refresh_token_" + Date.now(),
    },
  };
};

// 실제 API (백엔드 완성되면 사용)
export const signupApiReal = async (
  signupData: SignupFormValues
): Promise<SignupResponse> => {
  try {
    const response = await axios.post("http://api/user", signupData, {
      timeout: 1000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: SignupResponse = response.data;

    if (data.errorCode !== null) throw new Error(data.message);

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버에서 응답은 받았지만 에러상태 (400, 500)
        const errorData = error.response.data;
        throw new Error(
          errorData?.message || `서버 에러: ${error.response.status}`
        );
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

export const signup = signupApi;

// Mock 이메일 중복체크 API
export const checkEmailDuplicateApi = async (
  email: string
): Promise<EmailCheckResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Mock 이메일 중복체크: ", { email });

  // Mock 중복 이메일들
  const duplicateEmails = [
    "test@test.com",
    "duplicate@test.com",
    "admin@test.com",
  ];

  if (duplicateEmails.includes(email)) {
    return {
      errorCode: "DUPLICATE_ERRORCODE",
      message: "이미 사용 중인 이메일입니다.",
      result: null,
    };
  } else {
    // 성공 응답
    return {
      errorCode: null,
      message: "OK",
      result: {},
    };
  }
};

// 실제 이메일 중복체크 API (백엔드 완성되면 사용)
export const checkEmailDuplicateApiReal = async (
  email: string
): Promise<EmailCheckResponse> => {
  try {
    const requestData: EmailCheckRequest = { email };

    const response = await axios.post("http://api/check-email", requestData, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: EmailCheckResponse = response.data;
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorData = error.response.data;
        // 서버가 명세 형식으로 응답하면 그대로 반환
        if (errorData.errorCode) return errorData;

        return {
          errorCode: "SERVER_ERROR",
          message: errorData?.message || `서버에러: ${error.response?.status}`,
          result: null,
        };
      } else {
        return {
          errorCode: "NETWORK_ERROR",
          message: "네트워크 연결을 확인해주세요",
          result: null,
        };
      }
    }
    // axios 에러가 아닌 경우의 기본 반환
    return {
      errorCode: "UNKNOWN_ERROR",
      message: error.message || "알 수 없는 오류",
      result: null,
    };
  }
};
export const checkEmailDuplicate = checkEmailDuplicateApi;
