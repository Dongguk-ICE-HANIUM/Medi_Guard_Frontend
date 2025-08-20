import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CheckBoxProps {
  medication: Medication;
}
const CheckBox = ({ medication }: CheckBoxProps) => {
  const { perDay } = medication;
  const [checkedCount, setCheckedCount] = useState(0);

  const checkboxes = Array.from({ length: perDay }, (_, i) => i);

  return (
    <View style={styles.container}>
      {checkboxes.map((index) => {
        const isChecked = index < checkedCount;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (isChecked) {
                setCheckedCount(checkedCount - 1);
              } else {
                setCheckedCount(checkedCount + 1);
              }
            }}
          >
            <View style={styles.box}>
              {isChecked ? (
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
