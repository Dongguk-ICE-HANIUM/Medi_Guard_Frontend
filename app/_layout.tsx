import queryClient from "@/api/queryClient";
import { getSecureStore } from "@/utils/secureStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as LocalAuthentication from "expo-local-authentication";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  //저장 새로고침 때문에 주석처리
  useEffect(() => {
    if (loaded) checkAutoLogin();
  }, [loaded]);

  const checkAutoLogin = async () => {
    try {
      // 1. 저장된 토큰이 있는지 확인
      const hasToken = await getSecureStore("acccessToekn");
      const biometricEnabled = await getSecureStore("biometricEnabled");

      if (hasToken && biometricEnabled) {
        // 2. Face ID 사용 가능한지 확인
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (
          hasHardware &&
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Face ID로 로그인하기",
            cancelLabel: "취소",
            fallbackLabel: "비밀번호 사용",
          });

          if (result.success) {
            router.replace("/");
            return;
          }
        }
      }
      router.replace("/auth");
    } catch (error) {}
  };

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="sideEffect" options={{ headerShown: false }} />
          <Stack.Screen name="calendar" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>

        <Toast />
      </View>
    </QueryClientProvider>
  );
}
