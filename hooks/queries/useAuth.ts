import { getMe, postLogin, postSignup, postSocialLogin } from "@/api/auth";
import queryClient from "@/api/queryClient";
import { queryKey } from "@/constants";
import { deleteSecureStore, saveSecureStore } from "@/utils/secureStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

function useGetMe() {
  // 앱 시작시 토큰이 있으면 그대로 getMe 실행
  const { data } = useQuery({
    queryFn: getMe,
    queryKey: [queryKey.AUTH, queryKey.GET_ME],
  });
  return { data };
}

function useSignup() {
  return useMutation({
    mutationFn: postSignup,
    onSuccess: () => router.replace("/auth/login"),
  });
}

function useLogin() {
  return useMutation({
    mutationFn: postLogin,
    onSuccess: async ({ result }) => {
      const accessToken = result!.accessToken;
      await saveSecureStore("accessToken", accessToken);

      router.replace("/");
    },
  });
}

function useSocialLogin() {
  return useMutation({
    mutationFn: postSocialLogin,
    onSuccess: async ({ result }) => {
      const accessToken = result!.accessToken;
      await saveSecureStore("accessToken", accessToken);

      router.replace("/");
    },
  });
}

function useAuth() {
  const { data } = useGetMe();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const socialLoginMutation = useSocialLogin();

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
  };
}

export default useAuth;
