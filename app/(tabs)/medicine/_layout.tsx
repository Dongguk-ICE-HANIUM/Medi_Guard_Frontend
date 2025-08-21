import { colors } from "@/constants";
import { CalendarProvider } from "@/context/CalendarContext";
import { MedicationProvider } from "@/context/MedicationContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function MedicineLayout() {
  return (
    <MedicationProvider>
      <CalendarProvider>
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
              title: "약물 관리",
              contentStyle: { marginHorizontal: 13 },
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color={"black"} />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="medicineList"
            options={{
              headerShown: true,
              title: "약물 관리",
              contentStyle: {
                paddingHorizontal: 13,
                backgroundColor: colors.BG_COLOR,
              },
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color={"black"} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
      </CalendarProvider>
    </MedicationProvider>
  );
}
