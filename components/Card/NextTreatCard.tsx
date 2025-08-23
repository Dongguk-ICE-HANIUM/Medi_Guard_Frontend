import { colors } from "@/constants";
import { Octicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import NextTreatItem from "./NextTreatItem";

export default function NextTreatCard() {
  return (
    <View style={styles.nextTreatCard}>
      <View style={styles.title}>
        <Text style={styles.titleText}>다음 진료 일정</Text>
        <Octicons name="plus-circle" size={18} color="black" />
      </View>
      <View style={styles.nextTreatList}>
        <View style={styles.nextTreatItem}>
          <NextTreatItem date="10월 24일 화요일" />
          <NextTreatItem date="10월 24일 화요일" />
          <NextTreatItem date="10월 24일 화요일" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nextTreatCard: {},
  title: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    paddingVertical: 7,
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "900",
  },
  nextTreatList: {
    alignItems: "center",
    justifyContent: "center",
  },
  nextTreatItem: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: "90%",
    padding: 10,
  },
});
