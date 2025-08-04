import { colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SingleMedicineCardProps } from "./SingleMedicineCard";

interface CheckBoxProps {
  drugItem: SingleMedicineCardProps["drugItem"];
}
const CheckBox = ({ drugItem }: CheckBoxProps) => {
  const { timeSlot } = drugItem;
  const [currentTimeSlot, setCurrentTimeSlot] = useState(timeSlot);

  const originalLength = timeSlot.toString(2).length;

  const fixedIndexArray = Array.from({ length: originalLength }, (_, i) => i);

  const getCurrentBit = (position: number): number => {
    const currentBinary = currentTimeSlot
      .toString(2)
      .padStart(originalLength, "0");
    return parseInt(currentBinary[position]);
  };

  const toggleBit = (timeSlot: number, position: number): number => {
    const bitPosition = originalLength - 1 - position;
    return timeSlot ^ (1 << bitPosition);
  };

  return (
    <View style={styles.container}>
      {fixedIndexArray.map((_, index) => {
        const currentBit = getCurrentBit(index);
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              const newTimeSlot = toggleBit(currentTimeSlot, index);
              setCurrentTimeSlot(newTimeSlot);
            }}
          >
            <View style={styles.box}>
              {currentBit === 1 ? (
                <Ionicons
                  name="checkbox-outline"
                  size={25}
                  color={colors.PINK}
                />
              ) : (
                <Ionicons
                  name="square-outline"
                  size={25}
                  color={colors.TEXT_GRAY}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    width: "80%",
  },
  overbox: {},
  box: {},
});
