import { colors } from "@/constants";
import { SignupProvider } from "@/context/SignupContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

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
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color={"black"} />
              </TouchableOpacity>
            ),
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
          }}
        />
      </Stack>
    </SignupProvider>
  );
}
