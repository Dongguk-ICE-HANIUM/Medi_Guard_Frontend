// hooks/useTodayMedications.ts
import { checkIfShouldTakeOnDate } from "@/hooks/useCalendar";
import { Medication, TakingType } from "@/types/medication";
import { useMemo } from "react";
import { useMedicationList } from "./useMedicationQuery";

export interface TodayMedicationsReturn {
  scheduledMedications: Medication[];
  targetDate: Date;
  getTodayScheduledCount: (selectedDate?: string) => number;
  hasMedicationScheduled: (date: Date) => boolean;
}

const useTodayMedications = (selectedDate?: string): TodayMedicationsReturn => {
  const { data: allMedications = [] } = useMedicationList();

  // NEED 타입 완전히 제외한 스케줄된 약물만
  const scheduledMedications = useMemo(() => {
    const targetDateStr =
      selectedDate || new Date().toISOString().split("T")[0];
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const filtered = allMedications.filter((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // 오늘 날짜 기준으로 미래인 경우 (복용 예정)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (targetDate < today) {
        return false; // 과거 날짜는 제외
      }

      // 복용 기간 내에 있거나 복용 시작일 이전인 경우 포함
      if (targetDate > endDate) {
        return false; // 복용 종료일 이후는 제외
      }

      // NEED 타입은 오늘 약물 목록에서도 제외
      if (medication.takingType === TakingType.NEED) {
        return false;
      }

      // 복용 주기에 따라 해당 날짜에 실제로 약을 먹는지 확인
      const shouldTakeToday = checkIfShouldTakeOnDate(medication, targetDate);

      return shouldTakeToday;
    });

    return { filtered, targetDate };
  }, [allMedications, selectedDate]);

  // 특정 날짜에 복용 예정 약물 개수
  const getTodayScheduledCount = (dateString?: string): number => {
    const targetDateStr = dateString || new Date().toISOString().split("T")[0];
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    return allMedications.filter((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (targetDate < startDate || targetDate > endDate) {
        return false;
      }

      if (medication.takingType === TakingType.NEED) {
        return false;
      }

      return checkIfShouldTakeOnDate(medication, targetDate);
    }).length;
  };

  // 특정 날짜에 복용 예정 약물이 있는지 확인
  const hasMedicationScheduled = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0];
    return getTodayScheduledCount(dateString) > 0;
  };

  return {
    scheduledMedications: scheduledMedications.filtered,
    targetDate: scheduledMedications.targetDate,
    getTodayScheduledCount,
    hasMedicationScheduled,
  };
};

export default useTodayMedications;
