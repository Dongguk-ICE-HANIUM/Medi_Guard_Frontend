import { colors } from "@/constants";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CheckBox from "./CheckBox";
import { SingleMedicineCardProps } from "./SingleMedicineCard";

interface ToggleProps {
  drugItem: SingleMedicineCardProps["drugItem"];
}
const Toggle = ({ drugItem }: ToggleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>복용 체크</Text>
      <CheckBox drugItem={drugItem} />
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.PINK,
    borderStyle: "dashed",
    borderRadius: 16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "space-between",
    gap: 20,
  },
  text: {
    color: colors.PINK,
    fontWeight: "bold",
    fontSize: 16,
  },
});
