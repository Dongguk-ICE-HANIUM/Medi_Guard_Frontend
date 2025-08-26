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
  targetDate?: Date;
  showGroupDetail?: boolean;
  isEditMode?: boolean;
  onDelete?: (id: string) => void;
}

const SingleMedicineCard = ({
  medication,
  selectedDate,
  targetDate,
  showGroupDetail = false,
  isEditMode = false,
  onDelete,
}: SingleMedicineCardProps) => {
  // 복용 상태 계산 (선택된 날짜 기준)
  const medicationStatus = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // targetDate가 있으면 사용, 없으면 오늘 날짜 사용
    const targetDateForStatus = targetDate || today;
    targetDateForStatus.setHours(0, 0, 0, 0);

    const startDate = new Date(medication.startAt);
    const endDate = new Date(medication.endAt);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const isCompleted = targetDateForStatus > endDate;
    const isScheduled = targetDateForStatus < startDate;

    const totalDays =
      Math.ceil(
        (new Date(medication.endAt).getTime() -
          new Date(medication.startAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const daysPassed = Math.max(
      0,
      Math.floor(
        (targetDateForStatus.getTime() -
          new Date(medication.startAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const actualDaysPassed = Math.min(daysPassed, totalDays);
    const completionRate =
      totalDays > 0 ? (actualDaysPassed / totalDays) * 100 : 0;

    let status: "completed" | "taking" | "scheduled";
    if (isCompleted) {
      status = "completed";
    } else if (isScheduled) {
      status = "scheduled";
    } else {
      status = "taking";
    }

    return {
      isCompleted,
      isScheduled,
      completionRate: Math.min(completionRate, 100),
      status,
    };
  }, [medication]);

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
            <Text style={styles.name}>
              {medication.medicineInfo.name || "휴온스아목시크라정"}
            </Text>
            {/* 복용 상태 태그 */}
            {showGroupDetail && (
              <View
                style={[
                  styles.statusTag,
                  {
                    backgroundColor: !medication.isActive
                      ? colors.LIGHT_GRAY + "20"
                      : medication.takingType === "NEED"
                      ? colors.LIGHT_GRAY + "20"
                      : medicationStatus.status === "completed"
                      ? colors.GREEN + "20"
                      : medicationStatus.status === "scheduled"
                      ? colors.YELLOW + "20"
                      : colors.BLUE + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: !medication.isActive
                        ? colors.TEXT_GRAY
                        : medication.takingType === "NEED"
                        ? colors.TEXT_GRAY
                        : medicationStatus.status === "completed"
                        ? colors.GREEN
                        : medicationStatus.status === "scheduled"
                        ? colors.TAG_YELLOW
                        : colors.BLUE,
                    },
                  ]}
                >
                  {!medication.isActive
                    ? "보류"
                    : medication.takingType === "NEED"
                    ? "보류"
                    : medicationStatus.status === "completed"
                    ? "복용 완료"
                    : medicationStatus.status === "scheduled"
                    ? "복용 예정"
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

      {/* 복용 중이거나 필요시 복용이 아니고, isActive가 true일 때만 체크박스 보이게 */}
      {medication.isActive &&
        medication.takingType !== "NEED" &&
        medicationStatus.status === "taking" && (
          <View style={styles.toggle}>
            <Toggle medication={medication} selectedDate={selectedDate} />
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
