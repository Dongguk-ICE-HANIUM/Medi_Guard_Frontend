import { colors } from "@/constants";
import { SignupProvider } from "@/context/SignupContext";
import { Stack } from "expo-router";

export default function SignupLayout() {
  return (
    <SignupProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.WHITE },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: true,
            title: "회원가입",
          }}
        />
        <Stack.Screen
          name="step2"
          options={{
            headerShown: true,
            title: "회원가입",
            headerBackTitle: "이전",
          }}
        />
        <Stack.Screen
          name="step3"
          options={{
            headerShown: true,
            title: "회원가입",
            headerBackTitle: "이전",
            contentStyle: {
              backgroundColor: colors.BACK_GRAY,
            },
          }}
        />
        <Stack.Screen
          name="step4"
          options={{
            headerShown: true,
            title: "회원가입",
            headerBackTitle: "이전",
            contentStyle: {
              backgroundColor: colors.BACK_GRAY,
            },
          }}
        />
      </Stack>
    </SignupProvider>
  );
}
