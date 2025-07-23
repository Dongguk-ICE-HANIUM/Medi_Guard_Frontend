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

  console.log("drugItem:", drugItem);
  console.log("timeSlot:", timeSlot);
  console.log("timeSlot type:", typeof timeSlot);

  const [currentTimeSlot, setCurrentTimeSlot] = useState(timeSlot);

  const toBinaryArray = (timeSlot: number): number[] => {
    return timeSlot.toString(2).split("").map(Number);
  };
  const toggleBit = (timeSlot: number, position: number): number => {
    const bitPosition = timeSlot.toString(2).length - 1 - position;
    return timeSlot ^ (1 << bitPosition);
  };

  return (
    <View style={styles.container}>
      {toBinaryArray(currentTimeSlot).map((bit, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            const newTimeSlot = toggleBit(currentTimeSlot, index);
            setCurrentTimeSlot(newTimeSlot);
          }}
        >
          <View
            style={
              toBinaryArray(currentTimeSlot).length > 7
                ? styles.box
                : styles.overbox
            }
          >
            {bit === 1 ? (
              <Ionicons name="checkbox-outline" size={25} color={colors.PINK} />
            ) : (
              <Ionicons
                name="square-outline"
                size={25}
                color={colors.TEXT_GRAY}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
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
