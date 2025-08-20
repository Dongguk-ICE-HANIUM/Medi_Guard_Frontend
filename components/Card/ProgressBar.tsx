import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  medication: Medication;
}

const ProgressBar = ({ medication }: ProgressBarProps) => {
  const { startAt, endAt } = medication;
  // 임시로 복용 진행률 계산 (실제로는 takenDaysCount, missedDaysCount가 필요)
  const totalDays =
    (new Date(endAt).getTime() - new Date(startAt).getTime()) /
      (1000 * 60 * 60 * 24) +
    1;
  const currentDate = new Date();
  const startDate = new Date(startAt);
  const daysPassed = Math.max(0, (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const takenPercentage = Math.min(daysPassed / totalDays, 1);
  const remainingPercentage = 1 - takenPercentage;

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: takenPercentage,
          backgroundColor: colors.BLACK,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
        }}
      />
      <View
        style={{
          flex: remainingPercentage,
          backgroundColor: colors.LIGHT_GRAY,
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
