import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

interface NextTreatItemProps {
  date: string;
}

export default function NextTreatItem({ date }: NextTreatItemProps) {
  return (
    <View style={styles.nextTreatItem}>
      <View style={styles.leftChild}>
        <FontAwesome name="calendar-o" size={18} color="black" />
        <Text style={styles.leftChild_text}>{date}</Text>
      </View>
      <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  nextTreatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftChild: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  leftChild_text: {
    fontSize: 11,
    fontWeight: "500",
  },
});
