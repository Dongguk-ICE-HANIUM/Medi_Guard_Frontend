import { colors } from "@/constants";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function AuthLayout() {
  return (
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
          title: "로그인",
          headerBackTitle: "이전",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/(tabs)/my")}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href={"/"} replace>
              <Foundation name="home" size={28} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
          title: "회원가입",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: "로그인",
        }}
      />
    </Stack>
  );
}
