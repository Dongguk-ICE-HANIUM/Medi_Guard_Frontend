import { colors } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

export default function PregnancyCard() {
  return (
    <View style={styles.pregnancyCard}>
      <View style={styles.leftChild}>
        <Text style={{ fontWeight: "500" }}>임신주수</Text>
        <Text>7주차</Text>
      </View>
      <View style={styles.rightChild}>
        <Text style={{ fontWeight: "500" }}>수유여부</Text>
        <Text>O</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pregnancyCard: {
    flexDirection: "row",
    gap: 10,
  },
  leftChild: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: "46%",
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightChild: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: "47%",
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
