import { ApiResponse } from "./api";

//request body
export interface SocialLoginRequest {
  userId: string;
  name: string;
  birthday: string;
  height?: number;
  weight?: number;
  pregnancyWeek: number;
  feeding: boolean;
  dueDate: string;
  allergyList?: string[] | null;
  diseaseList?: string[] | null;
}

interface SocialLoginResult {
  accessToken: string;
  refreshToken: string;
}

export type SocialLoginResponse = ApiResponse<SocialLoginResult>;

interface googleLoginResult {
  jwtDto: {
    accessToken: string;
    refreshToken: string;
  };
  isSignUpNeeded: boolean;
  userId: string;
}

export type googleLoginResponse = ApiResponse<googleLoginResult>;

export interface appleLoginRequest {
  state: string;
  code: string;
  idToken: string;
}

interface appleLoginResult {
  jwtDto: {
    accessToken: string;
    refreshToken: string;
  };
  isSignUpNeeded: boolean;
  userId: string;
}

export type appleLoginResponse = ApiResponse<appleLoginResult>;

interface kakaoLoginResult {
  jwtDto: {
    accessToken: string;
    refreshToken: string;
  };
  isSignUpNeeded: boolean;
  userId: string;
}

export type kakaoLoginResponse = ApiResponse<kakaoLoginResult>;
