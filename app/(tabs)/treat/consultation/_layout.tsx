import { colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor: colors.WHITE, paddingHorizontal: 13 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "병원 진료",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="code"
        options={{
          headerShown: true,
          title: "병원 진료",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ongoingConsultation"
        options={{
          headerShown: true,
          title: "병원 진료",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          headerShown: true,
          title: "병원 진료",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="emptyResult"
        options={{
          headerShown: true,
          title: "병원 진료",
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
