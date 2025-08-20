import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CheckBox from "./CheckBox";

interface ToggleProps {
  medication: Medication;
  selectedDate?: string;
}
const Toggle = ({ medication, selectedDate }: ToggleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>복용 체크</Text>
      <CheckBox medication={medication} selectedDate={selectedDate} />
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
