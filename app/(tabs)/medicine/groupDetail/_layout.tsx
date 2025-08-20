import { colors } from "@/constants";
import { CalendarProvider } from "@/context/CalendarContext";
import { MedicationProvider } from "@/context/MedicationContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, router } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function GroupDetailLayout() {
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
              title: "그룹 복용약",
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
