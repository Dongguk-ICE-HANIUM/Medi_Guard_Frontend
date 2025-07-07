import { colors } from "@/constants";
import { Stack } from "expo-router";

export default function TreatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.WHITE },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
