import { colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function MedicineLayout() {
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
          title: "약물등록",
          contentStyle: { marginHorizontal: 13 },
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
