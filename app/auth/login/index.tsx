import { login } from "@/api/login";
import Button from "@/components/Button";
import LoginEmailInput from "@/components/Input/LoginEmailInput";
import PasswordInput from "@/components/Input/PasswordInput";
import { LoginFormValues } from "@/types/auth";
import { getSecureStore, saveSecureStore } from "@/utils/secureStore";
import * as LocalAuthentication from "expo-local-authentication";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";

export default function LoginScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // 앱 시작시 Face ID 설정 확인
  useEffect(() => {
    // Face ID로 로그인 함수
    const autoFaceIdLogin = async () => {
      try {
        const enabled = await getSecureStore("biometricEnabled");
        const hasLoggedIn = await getSecureStore("hasLoggedInBefore");
        setBiometricEnabled(enabled === "true");

        if (enabled === "true" && hasLoggedIn === "true") {
          console.log("자동 Face ID 로그인 시도");
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Face ID로 로그인",
            cancelLabel: "취소",
            // disableDeviceFallback: true,
          });

          console.log("face ID 결과: ", result);

          if (result.success) {
            // Face ID 성공 시 저장된 토큰으로 바로 홈으로 이동
            console.log("Face ID 로그인 성공");
            router.replace("/");
          }
        }
      } catch (error) {
        console.log("Face ID 설정 오류: ", error);
      }
    };
    autoFaceIdLogin();
  }, []);

  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: "test@test.com",
      password: "12345678",
    },
  });

  const askFaceId = async () => {
    try {
      const enabled = await getSecureStore("biometricEnabled");

      if (enabled !== null) return;

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      console.log("hasHardware: ", hasHardware);

      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (
        hasHardware &&
        supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        Alert.alert("Face ID 설정", "다음부터 Face ID로 로그인하시겠습니까?", [
          {
            text: "취소하기",
            style: "cancel",
            onPress: async () => {
              await saveSecureStore("biometricEnabled", "false");
            },
          },
          {
            text: "설정하기",
            onPress: async () => {
              await saveSecureStore("biometricEnabled", "true");
              setBiometricEnabled(true);
            },
          },
        ]);
      }
    } catch (error) {
      console.log("Face ID 설정 중 오류:", error);
    }
  };
  const onLogin = async (data: LoginFormValues) => {
    try {
      const result = await login(data);

      if (result?.accessToken && result?.refreshToken) {
        // 토큰 저장
        await saveSecureStore("accessToken", result?.accessToken);
        await saveSecureStore("refreshToken", result.refreshToken);
        await saveSecureStore("hasLoggedInBefore", "true");

        // Face ID 설정 제안
        await askFaceId();
        router.replace("/");
      }
    } catch (error: any) {
      alert(error.message || "로그인에 실패했습니다.");
    }
  };

  return (
    // FormProvider로 하위컴포넌트에 폼상태 전달
    <FormProvider {...loginForm}>
      <View>
        <LoginEmailInput />
        <PasswordInput />
        <View style={styles.Button}>
          <Button text="로그인" onPress={loginForm.handleSubmit(onLogin)} />
        </View>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  Button: {
    marginTop: 25,
    marginHorizontal: 15,
  },
});
