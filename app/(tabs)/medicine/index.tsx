import NavigationCard from "@/components/Card/NavigationCard";
import { ScreenLayout } from "@/components/ScreenLayout";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MedicineScreen() {
  return (
    <ScreenLayout>
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
      <View style={styles.todayContainer}>
        <Text>Today's</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  navCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  todayContainer: {},
});
