import { colors } from "@/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";

export default function DueDateCard() {
  return (
    <View style={styles.dueDateCard}>
      <View style={styles.leftChild}>
        <FontAwesome name="calendar-check-o" size={24} color="black" />
        <View style={styles.text}>
          <Text style={styles.textTop}>출산예정일</Text>
          <Text style={styles.textBottom}>2025.12.08 | 현이</Text>
        </View>
      </View>
      <View style={styles.rightChild}>
        <Text style={styles.textTheDay}>D - 158</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dueDateCard: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: "90%",
    padding: 10,
  },
  leftChild: {
    flexDirection: "row",
    paddingLeft: 5,
    gap: 5,
  },
  text: {
    marginTop: 2,
    gap: 3,
  },
  textTop: {
    fontSize: 11,
    fontWeight: "800",
  },
  textBottom: {
    fontSize: 8,
    color: colors.TEXT_GRAY,
  },
  rightChild: {
    paddingRight: 5,
  },
  textTheDay: {
    fontSize: 22,
    fontWeight: "500",
  },
});
