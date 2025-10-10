import {
  getMe,
  postAppleLogin,
  postGoogleLogin,
  postKakaoLogin,
  postLogin,
  postSignup,
  postSocialLogin,
} from "@/api/auth";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { LoginResponse } from "@/types/api";
import {
  appleLoginResponse,
  googleLoginResponse,
  kakaoLoginResponse,
  SocialLoginResponse,
} from "@/types/social";
import { deleteSecureStore, saveSecureStore } from "@/utils/secureStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

function useGetMe() {
  // 앱 시작시 토큰이 있으면 그대로 getMe 실행
  const { data } = useQuery({
    queryFn: getMe,
    queryKey: [queryKey.AUTH],
  });
  return { data };
}

function useSignup() {
  return useMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      router.replace("/auth");
      console.log("회원가입 성공");
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
    },
  });
}

function useLogin() {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: async ({ result }: LoginResponse) => {
      const accessToken = result!.accessToken;
      await saveSecureStore("accessToken", accessToken);

      router.replace("/");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
    },
  });
}

function useSocialLogin() {
  return useMutation({
    mutationFn: postSocialLogin,
    onSuccess: async ({ result }: SocialLoginResponse) => {
      if (!result) {
        console.error("소셜 로그인 실패: result없음");
      }
      await saveSecureStore("accessToken", result!.accessToken);
      await saveSecureStore("refreshToken", result!.refreshToken);

      console.log("소셜 로그인 성공");
      router.replace("/");
    },
    onError: (error) => {
      console.error("소셜로그인 실패:", error);
    },
  });
}

function useGoogleLogin() {
  return useMutation({
    mutationFn: postGoogleLogin,
    onSuccess: async ({ result }: googleLoginResponse) => {
      if (!result) {
        console.error("구글 로그인 실패: result 없음");
        return;
      }

      if (result.isSignUpNeeded) {
        router.replace({
          pathname: "/auth/signup",
          params: {
            isSocialSignup: "true",
            userId: result.userId,
          },
        });
      } else if (result?.jwtDto) {
        await saveSecureStore("accessToken", result.jwtDto.accessToken);
        await saveSecureStore("refreshToken", result.jwtDto.refreshToken);
        router.replace("/");
      } else {
        // 비활성화된 기존 사용자 (토큰 없음)
        // router.replace("/auth/activate");
      }

      console.log("구글 로그인 성공");
    },
    onError: (error) => {
      console.error("구글 로그인 실패:", error);
    },
  });
}

function useAppleLogin() {
  return useMutation({
    mutationFn: postAppleLogin,
    onSuccess: async ({ result }: appleLoginResponse) => {
      if (result?.isSignUpNeeded) router.replace("/auth/signup");
      if (result?.jwtDto) {
        await saveSecureStore("accessToken", result.jwtDto.accessToken);
        await saveSecureStore("refreshToken", result.jwtDto.refreshToken);
        router.replace("/");
      } else {
        // 비활성화된 기존 사용자 (토큰 없음)
        // router.replace("/auth/activate");
      }

      console.log("애플 로그인 성공");
    },
  });
}

function useKakaoLogin() {
  return useMutation({
    mutationFn: postKakaoLogin,
    onSuccess: async ({ result }: kakaoLoginResponse) => {
      if (result?.isSignUpNeeded) router.replace("/auth/signup");
      else if (result?.jwtDto) {
        await saveSecureStore("accessToken", result.jwtDto.accessToken);
        await saveSecureStore("refreshToken", result.jwtDto.refreshToken);
        router.replace("/");
      }
      console.log("카카오로그인 성공");
    },
  });
}

function useAuth() {
  const { data } = useGetMe();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const socialLoginMutation = useSocialLogin();
  const googleLoginMutation = useGoogleLogin();
  const appleLoginMutation = useAppleLogin();
  const kakaoLoginMutation = useKakaoLogin();

  const logout = () => {
    deleteSecureStore("accessToken");
    queryClient.resetQueries({ queryKey: ["auth"] });
  };

  return {
    auth: {
      id: data?.result?.id ?? "",
    },
    loginMutation,
    signupMutation,
    logout,
    socialLoginMutation,
    googleLoginMutation,
    appleLoginMutation,
    kakaoLoginMutation,
  };
}

export default useAuth;
