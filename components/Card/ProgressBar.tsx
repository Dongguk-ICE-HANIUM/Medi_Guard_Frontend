import { colors } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SingleMedicineCardProps } from "./SingleMedicineCard";

interface ProgressBarProps {
  drugItem: SingleMedicineCardProps["drugItem"];
}

const ProgressBar = ({ drugItem }: ProgressBarProps) => {
  const { startDate, endDate, takenDaysCount, missedDaysCount } = drugItem;
  const totalDays =
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24) +
    1;
  const takenPercentage = takenDaysCount / totalDays;
  const missedPercentage = missedDaysCount / totalDays;

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: takenPercentage,
          backgroundColor: colors.BLACK,
          borderTopLeftRadius: 10, // 왼쪽만
          borderBottomLeftRadius: 10,
        }}
      />
      <View
        style={{
          flex: missedPercentage,
          backgroundColor: colors.RED,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: "25%",
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 15,
    zIndex: 0,
  },
});
