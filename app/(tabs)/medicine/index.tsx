import NavigationCard from "@/components/NavigationCard";
import { ScreenLayout } from "@/components/ScreenLayout";
import { StyleSheet, View } from "react-native";

export default function MedicineScreen() {
  return (
    <ScreenLayout>
      <View style={styles.navCardContainer}>
        <NavigationCard text="전체 복용약 보기" icon="next" />
        <NavigationCard text="약물 등록하기" icon="plus" />
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
});
