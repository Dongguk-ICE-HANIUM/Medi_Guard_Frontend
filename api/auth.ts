import {
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/api";
import {
  kakaoLoginResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from "@/types/social";
import axiosInstance from "./axios";

export async function getMe(): Promise<GetMeResponse> {
  const { data } = await axiosInstance.get("/api/auth/me");
  return data;
}

export async function postSignup(body: SignupRequest): Promise<SignupResponse> {
  const { data } = await axiosInstance.post("/api/user", body);
  return data;
}

export async function postLogin(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosInstance.post("/api/auth/normal/login", body);
  return data;
}

export async function postSocialLogin(
  body: SocialLoginRequest
): Promise<SocialLoginResponse> {
  const { data } = await axiosInstance.post(`/api/user/${userId}`, body);
  return data;
}

export async function postKakaoLogin(): Promise<kakaoLoginResponse> {
  const { data } = await axiosInstance.post("/api/auth/kakao/login");
  return data;
}

export async function postGoogleLogin(): Promise<void> {
  const { data } = await axiosInstance.post("/api/auth/google/login");
  return data;
}

export async function postAppleLogin(): Promise<void> {
  const { data } = await axiosInstance.post("/api/auth/apple/login");
  return data;
}

export async function postRefreshToken(refreshToken: string) {
  const { data } = await axiosInstance.post("api/auth/reissue", {
    refreshToken,
  });
  return data as { accessToken: string };
}
