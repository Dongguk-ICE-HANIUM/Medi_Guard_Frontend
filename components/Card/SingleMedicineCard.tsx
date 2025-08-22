import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import { formatDateStringDot } from "@/utils/dateUtils";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import ProgressBar from "./ProgressBar";
import Toggle from "./Toggle";

export interface SingleMedicineCardProps {
  medication: Medication;
  selectedDate?: string;
  showGroupDetail?: boolean;
  isEditMode?: boolean;
  onDelete?: (medicationId: string) => void;
}

const SingleMedicineCard = ({
  medication,
  selectedDate,
  showGroupDetail = false,
  isEditMode = false,
  onDelete,
}: SingleMedicineCardProps) => {
  // 복용 상태 계산 (임시 로직 - 실제로는 서버 데이터 기반)
  const medicationStatus = useMemo(() => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date();
    const endDate = new Date(medication.endAt);

    const isCompleted = currentDate > endDate;

    const totalDays =
      Math.ceil(
        (new Date(medication.endAt).getTime() -
          new Date(medication.startAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const daysPassed = Math.max(
      0,
      Math.floor(
        (currentDate.getTime() - new Date(medication.startAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const actualDaysPassed = Math.min(daysPassed, totalDays);
    const completionRate =
      totalDays > 0 ? (actualDaysPassed / totalDays) * 100 : 0;

    return {
      isCompleted,
      completionRate: Math.min(completionRate, 100),
      status: isCompleted ? "completed" : "taking",
    };
  }, [medication, selectedDate]);

  const handleToDetail = () => {
    console.log(
      "약물 상세 페이지로 이동:",
      medication.id,
      medication.medicineInfo.name
    );
    router.push({
      pathname: "/medicine/detail",
      params: { id: medication.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.title}>
            <Text style={styles.name}>{medication.medicineInfo.name}</Text>
            {/* 복용 상태 태그 */}
            {showGroupDetail && (
              <View
                style={[
                  styles.statusTag,
                  {
                    backgroundColor:
                      medicationStatus.status === "completed"
                        ? colors.GREEN + "20"
                        : colors.BLUE + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        medicationStatus.status === "completed"
                          ? colors.GREEN
                          : colors.BLUE,
                    },
                  ]}
                >
                  {medicationStatus.status === "completed"
                    ? "복용 완료"
                    : "복용 중"}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.date}>
            {formatDateStringDot(medication.startAt)}~
            {formatDateStringDot(medication.endAt)}
          </Text>
        </View>
        {isEditMode ? (
          <Button
            text="삭제"
            size="small"
            color="gray"
            onPress={() => onDelete?.(medication.id)}
          />
        ) : (
          <Button size="small" icon="right" onPress={handleToDetail} />
        )}
      </View>

      <View style={styles.progressBar}>
        <ProgressBar medication={medication} selectedDate={selectedDate} />
      </View>

      {/* 복용 중일때만 체크박스 보이게 */}
      {(!showGroupDetail || !medicationStatus.isCompleted) && (
        <View style={styles.toggle}>
          <Toggle medication={medication} />
        </View>
      )}
    </View>
  );
};

export default SingleMedicineCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    padding: 15,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  titleContainer: { flexDirection: "column", gap: 5, paddingLeft: 10 },
  title: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  name: { fontWeight: "bold", fontSize: 19 },
  date: {
    fontSize: 12,
    color: colors.TEXT_GRAY,
  },
  progressBar: {
    width: "100%",
    paddingLeft: 10,
    marginTop: 15,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: colors.TEXT_GRAY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: "600",
  },
  checkboxContainer: {
    width: "100%",
    paddingLeft: 10,
    marginTop: 10,
  },
  toggle: {
    width: "100%",
    paddingLeft: 10,
    marginTop: 10,
  },
});
