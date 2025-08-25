//

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
  const perDay = medication.perDay > 0 ? medication.perDay : 2;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>복용 체크</Text>
      <View style={styles.checkBoxContainer}>
        {Array.from({ length: perDay }, (_, index) => (
          <CheckBox
            key={index}
            medication={medication}
            selectedDate={selectedDate}
            timeSlotIndex={index}
          />
        ))}
      </View>
    </View>
  );
};

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
  checkBoxContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

export default Toggle;
