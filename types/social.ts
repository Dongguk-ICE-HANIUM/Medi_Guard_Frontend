import { ApiResponse } from "./api";

//request body
export interface SocialLoginRequest {
  name: string;
  birthday: string;
  height?: number;
  weight?: number;
  pregnant: number;
  feeding: boolean;
  dueDate: string;
  allergy: string[] | null;
  disease: string[] | null;
}

interface SocialLoginResult {
  accessToken: string;
  refreshToken: string;
}

export type SocialLoginResponse = ApiResponse<SocialLoginResult>;

interface kakaoLoginResult {
  accessToken?: string;
  refreshToken?: string;
  isNewUser?: boolean;
}

export type kakaoLoginResponse = ApiResponse<kakaoLoginResult>;
