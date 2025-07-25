import NavigationCard from "@/components/Card/NavigationCard";
import DailyMediCalendar from "@/components/DailyMediCalendar";
import { CalendarProvider } from "@/context/CalendarContext";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

export default function MedicineScreen() {
  return (
    <CalendarProvider>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View>
          <View style={styles.navCardContainer}>
            <NavigationCard
              text="전체 복용약 보기"
              icon="next"
              onPress={() => {
                router.push("/medicine/MedicineList");
              }}
            />
            <NavigationCard
              text="약물 등록하기"
              icon="plus"
              onPress={() => {
                router.push("/medicine/Register");
              }}
            />
          </View>
          <DailyMediCalendar />
        </View>
      </ScrollView>
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  navCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
});
