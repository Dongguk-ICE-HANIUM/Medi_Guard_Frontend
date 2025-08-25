import { colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: colors.WHITE, marginHorizontal: 13 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="analysis"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="identification"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="registerForm"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="interactionCheck"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="precautions"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="confirm"
        options={{
          headerShown: true,
          title: "약물 등록",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
