import { getMedicationStatus } from "@/api/medicine";
import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import { convertBinaryToTimeSlots } from "@/utils/dateUtils";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
  medication: Medication;
  selectedDate?: string;
}

const ProgressBar = ({ medication, selectedDate }: ProgressBarProps) => {
  const { startAt, endAt, perDay } = medication;
  const [completionRate, setCompletionRate] = useState(0);

  // 서버에서 복용 상태를 받아와서 복용률 계산
  useEffect(() => {
    const calculateCompletionRate = async () => {
      if (!selectedDate) return;

      try {
        const response = await getMedicationStatus(medication.id, selectedDate);
        if (response.errorCode === null) {
          const timeSlot = response.result.timeSlot;
          const timeSlots = convertBinaryToTimeSlots(timeSlot);

          // 해당 날짜의 복용 완료 횟수
          const completedDosesToday = timeSlots.length;

          // 전체 복용 기간
          const totalDays =
            Math.ceil(
              (new Date(endAt).getTime() - new Date(startAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1;

          // 현재까지의 복용 가능한 일수
          const currentDate = new Date(selectedDate);
          const startDate = new Date(startAt);
          const daysPassed = Math.max(
            0,
            Math.floor(
              (currentDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          );

          // 실제 복용 가능한 일수 (복용 기간 내에서)
          const actualDaysPassed = Math.min(daysPassed, totalDays);

          // 전체 복용 횟수 = totalDays * perDay
          const totalDoses = totalDays * perDay;

          // 임시로 과거 복용률 계산 (실제로는 서버에서 전체 데이터 조회)
          const pastCompletedDoses = Math.floor(
            actualDaysPassed * perDay * 0.7
          );
          const totalCompletedDoses = pastCompletedDoses + completedDosesToday;

          const rate =
            totalDoses > 0 ? (totalCompletedDoses / totalDoses) * 100 : 0;
          setCompletionRate(Math.min(rate, 100));

          console.log(
            `복용률 계산: ${completedDosesToday}/${perDay} (오늘), 전체 ${Math.round(
              rate
            )}%`
          );
        } else {
          console.error("복용 상태 조회 실패:", response.message);
          setCompletionRate(0);
        }
      } catch (error) {
        console.error("복용률 계산 오류:", error);
        setCompletionRate(0);
      }
    };

    calculateCompletionRate();
  }, [medication.id, startAt, endAt, perDay, selectedDate]);

  const progressPercentage = completionRate / 100;
  const remainingPercentage = 1 - progressPercentage;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View
          style={{
            flex: progressPercentage,
            backgroundColor: colors.PINK,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: progressPercentage === 1 ? 10 : 0,
          }}
        />
        <View
          style={{
            flex: remainingPercentage,
            backgroundColor: colors.LIGHT_GRAY,
            borderTopRightRadius: remainingPercentage === 1 ? 10 : 0,
            borderBottomRightRadius: 10,
          }}
        />
      </View>
      <Text style={styles.percentageText}>{Math.round(completionRate)}%</Text>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  progressContainer: {
    flexDirection: "row",
    flex: 1,
    height: 8,
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 10,
    overflow: "hidden",
  },
  percentageText: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
    fontWeight: "500",
    minWidth: 30,
  },
});
