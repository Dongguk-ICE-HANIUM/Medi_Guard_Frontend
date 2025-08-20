// 회원가입 API
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  birthday: string;
  height: number | undefined;
  weight: number | undefined;
  dueDate: string;
  pregnant: number;
  feeding: boolean;
  allergyList: string[] | null;
  diseaseList: string[] | null;
}

export interface ApiResponse<T> {
  errorCode: string | null;
  message: string;
  result: T | null;
}

interface SignupResult {
  accessToken: string;
  refreshToken: string;
}

export type SignupResponse = ApiResponse<SignupResult>;

// 이메일중복확인 API
export interface EmailCheckRequest {
  email: string;
}
interface EmailCheckResult {}

export type EmailCheckResponse = ApiResponse<EmailCheckResult>;

// 로그인 API
export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = ApiResponse<LoginResult>;

// 내 정보 가져오기 API
export interface GetMeResult {
  email: string;
  id: number;
}

export type GetMeResponse = ApiResponse<GetMeResult>;

// 액세스 토큰 재요청
