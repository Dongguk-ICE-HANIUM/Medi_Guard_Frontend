import { colors } from "@/constants";
import { SignupProvider } from "@/context/SignupContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function LoginLayout() {
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
            title: "로그인",
          }}
        />
        <Stack.Screen
          name="socialInfo"
          options={{
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color={"black"} />
              </TouchableOpacity>
            ),
            title: "로그인",
          }}
        />
      </Stack>
    </SignupProvider>
  );
}
