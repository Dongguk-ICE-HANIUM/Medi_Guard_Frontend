interface ApiResponse<T> {
  errorCode: string | null;
  message: string;
  result: T | null;
}

interface SignupResult {
  accessToken: string;
  refreshToken: string;
}

export type SignupResponse = ApiResponse<SignupResult>;

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

interface EmailCheckResult {}

export type EmailCheckResponse = ApiResponse<EmailCheckResult>;

export interface EmailCheckRequest {
  email: string;
}
